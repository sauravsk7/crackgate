#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network-stack";
import { AuthStack } from "../lib/auth-stack";
import { DataStack } from "../lib/data-stack";
import { AppStack } from "../lib/app-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "ap-south-1",
};

const domainName = app.node.tryGetContext("domain") ?? "crackgate.in";
const githubOwner = app.node.tryGetContext("ghOwner") ?? "your-github-username";
const githubRepo  = app.node.tryGetContext("ghRepo")  ?? "crackgate";
const githubBranch = app.node.tryGetContext("ghBranch") ?? "main";

const tags = { Project: "crackgate", ManagedBy: "cdk" };

const network = new NetworkStack(app, "CrackgateNetwork", { env, tags });

const auth = new AuthStack(app, "CrackgateAuth", {
  env, tags,
  domainPrefix: "crackgate", // → crackgate.auth.ap-south-1.amazoncognito.com
  callbackUrls: [`https://${domainName}/api/auth/callback/cognito`, "http://localhost:3000/api/auth/callback/cognito"],
  logoutUrls:   [`https://${domainName}/`, "http://localhost:3000/"],
});

const data = new DataStack(app, "CrackgateData", { env, tags, vpc: network.vpc });

new AppStack(app, "CrackgateApp", {
  env, tags,
  domainName,
  githubOwner, githubRepo, githubBranch,
  userPool: auth.userPool,
  userPoolClient: auth.userPoolClient,
  cognitoIssuer: `https://cognito-idp.${env.region}.amazonaws.com/${auth.userPool.userPoolId}`,
  dbSecret: data.dbSecret,
  dbUrlSecret: data.dbUrlSecret,
});
