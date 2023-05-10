export async function analyseDream(query: string) {
  function removeNonLetters(str: string) {
    return str.replace(/^[^a-zA-Z]*/g, '');
  }

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
    throw new Error('api error');
  }

  if (data.body.error) {
    console.log('data body error');
    console.log(data.body);
    throw new Error(data.body.error);
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
