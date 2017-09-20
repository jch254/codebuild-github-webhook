import { Callback, Context } from 'aws-lambda';
import { CodeBuild } from 'aws-sdk';
import * as validator from 'validator';
// import verifyGithubWebhook from 'verify-github-webhook';

import Event from './Event';
import GitHubWebhookPayload from './GitHubWebhookPayload';
import Response from './Response';

const codeBuild = new CodeBuild();

const getCodeBuildProjectName = (repositoryName: string, ref: string): string =>
  ref.endsWith('/master') ? repositoryName : `${repositoryName}-${ref.split('/')[2]}`;

const verifyWebhook = (signature: string, body: string, secret: string) => {
  try {
    // return verifyGithubWebhook(signature, body, secret);
    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

// POST /
export async function webhookHandler(event: Event, context: Context, callback: Callback): Promise<void> {
  console.log('webhookHandler');
  console.log('event', JSON.stringify(event));
  console.log('context', JSON.stringify(context));

  try {
    if (!event.body || !validator.isJSON(event.body)) {
      return callback(
        undefined,
        new Response({ statusCode: 400, body: { message: 'Invalid request body' } }),
      );
    }

    if (!verifyWebhook(event.headers['X-Hub-Signature'], event.body, process.env.GITHUB_WEBHOOK_SECRET as string)) {
      return callback(
        undefined,
        new Response({ statusCode: 401, body: { message: 'Unauthorised' } }),
      );
    }

    const gitHubEvent: string = event.headers['X-GitHub-Event'];

    if (gitHubEvent === 'ping') {
      return callback(undefined, new Response({ statusCode: 200 }));
    } else if (gitHubEvent === 'push') {
      const payload: GitHubWebhookPayload = JSON.parse(event.body as string);
      const params = {
        projectName: getCodeBuildProjectName(payload.repository.name, payload.ref),
        sourceVersion: payload.head_commit.id,
      };

      console.log(`Triggering CodeBuild project ${params.projectName} for commit ${params.sourceVersion}`);

      await codeBuild.startBuild(params).promise();

      console.log(`Finished triggering CodeBuild project ${params.projectName} for commit ${params.sourceVersion}`);

      return callback(undefined, new Response({ statusCode: 200 }));
    }

    return callback(
      undefined,
      new Response({ statusCode: 400, body: { message: 'Unsupported GitHub event' } }),
    );
  } catch (err) {
    console.log(err);

    return callback(
      undefined,
      new Response({ statusCode: err.responseStatusCode || 500, body: { message: err.message || 'Internal server error' } }),
    );
  }
}
