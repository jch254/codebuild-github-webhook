import { Callback, Context } from 'aws-lambda';
import { CodeBuild } from 'aws-sdk';

import Event from './Event';
import GitHubWebhookPayload from './GitHubWebhookPayload';
import Response from './Response';

const codeBuild = new CodeBuild();

const getCodeBuildProjectName = (repositoryName: string, ref: string): string =>
  ref.endsWith('/master') ? repositoryName : `${repositoryName}-${ref.split('/')[2]}`;

// TODO: Validate body
// POST /
export async function webhookHandler(event: Event, context: Context, callback: Callback) {
  console.log('webhookHandler');
  console.log('event', JSON.stringify(event));
  console.log('context', JSON.stringify(context));

  try {
    const payload: GitHubWebhookPayload = JSON.parse(event.body as string);
    const params = {
      projectName: getCodeBuildProjectName(payload.repository.name, payload.ref),
      sourceVersion: payload.head_commit.id,
    };

    console.log(`Triggering CodeBuild project ${params.projectName} for commit ${params.sourceVersion}`);

    await codeBuild.startBuild(params).promise();

    console.log(`Finished triggering CodeBuild project ${params.projectName} for commit ${params.sourceVersion}`);

    return callback(undefined, new Response({ statusCode: 200 }));
  } catch (err) {
    console.log(err);
    
    return callback(
      undefined,
      new Response({ statusCode: err.responseStatusCode || 500, body: { message: err.message || 'Internal server error' } }),
    );
  }
}
