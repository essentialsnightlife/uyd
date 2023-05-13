import { PublishCommand, PublishCommandInput, SNSClient } from '@aws-sdk/client-sns';

import { AnalysedDream } from '../../domains/analysedDreams/types';
import { removeNonLetters } from './helpers';

export async function analyseDream(query: string) {
  let response;
  let data;
  try {
    response = await fetch(
      'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/analyse',
      {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
      },
    );
    data = await response.json();
    console.log('query: ', query);
    console.log('data: ', data);
  } catch (err: unknown) {
    console.log('api error');
    console.log(err);
    throw new Error(
      'Sorry, there was an error trying to analyse your dream. Please try again. 🙏',
    );
  }

  if (data.body.error) {
    console.log('data body error');
    console.log(data.body);
    throw new Error(
      'Sorry, there was an error trying to analyse your dream. Please try again. 🙏',
    );
  }
  return removeNonLetters(data.body.result);
}

export const getUsersDreams = async (id: string) => {
  try {
    const response = await fetch(
      'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/' + id || '',
      // 'user123',
    );
    const result = await response.json();
    console.log('result', result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(
      'Sorry, something went wrong. Please refresh the page and try again. 🙏',
    );
  }
};

export async function deleteDream(dreamId: string) {
  try {
    const response = await fetch(
      'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/' + dreamId,
      {
        method: 'DELETE',
      },
    );
    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    }
    console.log('result', result);
    alert('Dream deleted! 👋');
    return result;
  } catch (err) {
    console.log('Error deleting dream 🚨');
    console.log(err);
    throw new Error('Sorry, we could not delete your dream. Please try again. 🙏');
  }
}

export async function publishAnalysedDream(analysedDream: AnalysedDream) {
  const credentials = {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  };

  let snsClient = new SNSClient({
    region: 'eu-west-2',
    credentials,
  });
  if (import.meta.env.DEV) {
    snsClient = new SNSClient({
      region: 'eu-west-2',
      endpoint: 'http://localhost:4002',
      credentials: {
        accessKeyId: '',
        secretAccessKey: 'e0xdF543BzuPdW04SRKnUXEeJ3YGHT271FWKvT8N',
      },
    });
  }

  const { id, userId, query, response, date } = analysedDream;

  const input: PublishCommandInput = {
    TopicArn: 'arn:aws:sns:eu-west-2:410317984454:AnsweredQueryTopic',
    Message: JSON.stringify({ id, userId, query, response, date }),
  };

  try {
    const command = new PublishCommand(input);
    const snsResponse = await snsClient.send(command);
    return { snsResponse };
  } catch (err: unknown) {
    console.log('Error: ', err);
    console.log(err);
    throw new Error('Sorry, we could not save your dream. Please try again. 🙏');
  }
}
