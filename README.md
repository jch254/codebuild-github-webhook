# Codebuild-github-webhook

GitHub webhook to trigger AWS CodeBuild builds powered by Serverless.

## Technologies Used

* [Serverless](https://github.com/serverless/serverless)
* [TypeScript](https://github.com/microsoft/typescript)
* [Node.js](https://github.com/nodejs/node)
* [Webpack](https://github.com/webpack/webpack)
* [Serverless-offline](https://github.com/dherault/serverless-offline)
* [Serverless-webpack](https://github.com/elastic-coders/serverless-webpack)

---

## Running locally (with live-reloading)

Serverless-webpack and serverless-offline offer great tooling for local Serverless development. To start a local server that will mimic AWS API Gateway, run the commands below. The server will fire up and code will be reloaded upon change so that every request to your local server will serve the latest code.

```
yarn install
serverless offline start
```

## Deployment/Infrastructure

Refer to the [/infrastructure](./infrastructure) directory.
