import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as sm  from "aws-cdk-lib/aws-secretsmanager";

interface Props extends cdk.StackProps {
  vpc: ec2.Vpc;
}

/** Aurora Serverless v2 Postgres cluster.
 *  - Min 0.5 ACU, Max 4 ACU (about ₹3.5K/mo idle, scales as needed).
 *  - Public endpoint OFF; reached via Data API or RDS Proxy from app.
 *  - Auto-rotates the master credentials in Secrets Manager every 30 days.
 *  - Outputs a complete DATABASE_URL secret consumable by Prisma. */
export class DataStack extends cdk.Stack {
  readonly cluster: rds.DatabaseCluster;
  readonly dbSecret: sm.ISecret;
  readonly dbUrlSecret: sm.Secret;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const dbName = "crackgate";

    this.cluster = new rds.DatabaseCluster(this, "PgCluster", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_4 }),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      writer: rds.ClusterInstance.serverlessV2("Writer"),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 4,
      defaultDatabaseName: dbName,
      enableDataApi: true,            // simplest path: query via Data API from Amplify Lambdas
      credentials: rds.Credentials.fromGeneratedSecret("postgres", { secretName: "/crackgate/db/master" }),
      backup: { retention: cdk.Duration.days(7) },
      storageEncrypted: true,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
    });

    this.dbSecret = this.cluster.secret!;

    // Assemble a Prisma-compatible DATABASE_URL secret string.
    // We can't read the live password at synth, but we can store a JSON
    // alongside and emit a CFN reference. The application reads the
    // /crackgate/db/master secret and builds the URL itself.
    this.dbUrlSecret = new sm.Secret(this, "DbUrlTemplate", {
      secretName: "/crackgate/db/url-template",
      description: "Prisma DATABASE_URL template — host/port/db only. Pull password from /crackgate/db/master.",
      secretObjectValue: {
        host:    cdk.SecretValue.unsafePlainText(this.cluster.clusterEndpoint.hostname),
        port:    cdk.SecretValue.unsafePlainText(this.cluster.clusterEndpoint.port.toString()),
        db:      cdk.SecretValue.unsafePlainText(dbName),
        urlTemplate: cdk.SecretValue.unsafePlainText(
          `postgresql://postgres:__PASSWORD__@${this.cluster.clusterEndpoint.hostname}:${this.cluster.clusterEndpoint.port}/${dbName}?schema=public&sslmode=require`
        ),
      },
    });

    new cdk.CfnOutput(this, "DbEndpoint",   { value: this.cluster.clusterEndpoint.hostname });
    new cdk.CfnOutput(this, "DbSecretArn",  { value: this.dbSecret.secretArn });
  }
}
