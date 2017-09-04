import { Callback, Context } from 'aws-lambda';

import Event from './Event';
import Response from './Response';

// POST /
export async function webhookHandler(event: Event, context: Context, callback: Callback) {
  console.log('webhookHandler');
  console.log('event', JSON.stringify(event));
  console.log('context', JSON.stringify(context));

  try {
    return callback(undefined, new Response({ statusCode: 200 }));
  } catch (err) {
    console.log(err);
    
    return callback(
      undefined,
      new Response({ statusCode: err.responseStatusCode || 500, body: { message: err.message || 'Internal server error' } }),
    );
  }
}
