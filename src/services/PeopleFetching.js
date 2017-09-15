import withQuery from 'with-query';

const SMOOOTH_HOST = 'http://Smoooth-env.2xcdmffjih.us-east-2.elasticbeanstalk.com:3001/';

const defaultFetchOptions = {
  mode: 'cors',
  cache: 'default'
}

const fetchFromServer = (query, fetchOptions, callback) => {
  fetch(query, fetchOptions).then(function(response) {
    if (!response.ok) {
      throw new Error('Bad request.');
    }
    
    return response.json();
  })
  .then(response => {
    callback(null, response);
  })
  .catch(err => callback(err, null));
}

export const requestSearch = (peopleQuery, page, callback) => {
  const validQuery = {};

  if (peopleQuery.name) {
    validQuery.name = peopleQuery.name;
  }

  if (peopleQuery.phone) {
    validQuery.phone = peopleQuery.phone;
  }

  if (peopleQuery.age) {
    validQuery.age = peopleQuery.age;
  }
  const queryParams = Object.assign({}, { page }, validQuery);

  const query = withQuery(SMOOOTH_HOST + 'search', queryParams);
  const fetchOptions = Object.assign({}, defaultFetchOptions, { method: 'POST' });
  fetchFromServer(query, fetchOptions, callback);
}

export const getResults = (requestId, callback) => {
  const query = withQuery(SMOOOTH_HOST + 'results', { id: requestId });
  const fetchOptions = Object.assign({}, defaultFetchOptions, { method: 'GET' });
  fetchFromServer(query, fetchOptions, callback);
}