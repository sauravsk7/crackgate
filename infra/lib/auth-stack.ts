import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

interface Props extends cdk.StackProps {
  domainPrefix: string;       // → <prefix>.auth.<region>.amazoncognito.com
  callbackUrls: string[];
  logoutUrls: string[];
}

/** Cognito User Pool with Google as the sole IdP (matches the frontend
 *  decision to keep only Google sign-in). */
export class AuthStack extends cdk.Stack {
  readonly userPool: cognito.UserPool;
  readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, "Users", {
      userPoolName: "crackgate-users",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        fullname:    { required: true,  mutable: true },
        profilePicture: { required: false, mutable: true },
      },
      passwordPolicy: { minLength: 12, requireDigits: true, requireSymbols: true, requireLowercase: true, requireUppercase: true },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // === Google federation ===
    // You must store the Google OAuth client_id/secret in Secrets Manager
    // (key path /crackgate/google) BEFORE first deploy, OR override values
    // here. CDK references them by SSM lookup at synth time.
    const google = new cognito.UserPoolIdentityProviderGoogle(this, "Google", {
      userPool: this.userPool,
      clientId: cdk.SecretValue.secretsManager("/crackgate/google", { jsonField: "clientId" }).unsafeUnwrap(),
      clientSecretValue: cdk.SecretValue.secretsManager("/crackgate/google", { jsonField: "clientSecret" }),
      scopes: ["openid", "email", "profile"],
      attributeMapping: {
        email:        cognito.ProviderAttribute.GOOGLE_EMAIL,
        fullname:     cognito.ProviderAttribute.GOOGLE_NAME,
        profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
      },
    });

    this.userPoolClient = this.userPool.addClient("WebClient", {
      userPoolClientName: "crackgate-web",
      generateSecret: true,                 // NextAuth Cognito provider wants a secret
      authFlows: { userSrp: true },
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
        callbackUrls: props.callbackUrls,
        logoutUrls: props.logoutUrls,
      },
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.GOOGLE],
      preventUserExistenceErrors: true,
      accessTokenValidity:  cdk.Duration.hours(1),
      idTokenValidity:      cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(30),
    });
    this.userPoolClient.node.addDependency(google);

    this.userPool.addDomain("HostedUi", {
      cognitoDomain: { domainPrefix: props.domainPrefix },
    });

    // Admin group
    new cognito.CfnUserPoolGroup(this, "AdminGroup", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
      description: "CrackGate administrators",
      precedence: 1,
    });

    new cdk.CfnOutput(this, "UserPoolId",       { value: this.userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPoolClientId", { value: this.userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, "CognitoDomain",    { value: `https://${props.domainPrefix}.auth.${this.region}.amazoncognito.com` });
  }
}
