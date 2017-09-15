import map from 'lodash/map';

export const TokenTypes = {
  NAME: 1,
  PHONE: 2,
  AGE: 3,
  INVALID :4,
}

// Adapted to phone numbers in the following format: XXXX-XXXXXX
const isPhone = (phone) => {
  return (phone.match(/^[0-9]{0,4}-{1}[0-9]{0,6}$/) != null) ||
         (phone.match(/^[0-9]{3,6}$/) != null);
}

const isAge = (age) => {
  const ageAsNumber = Number(age);
  if (isNaN(ageAsNumber)) {
    return false;
  } else {
    return (ageAsNumber > 0 && ageAsNumber <= 120)
  }
}

const isWord = (word) => {
  return word.match(/^[a-z.]+$/) != null;
}

// Check age before phone since in theory any number between 0 and 120
// is also a valid phone query.
export const getTokenType = (token) => {
  if (isAge(token)) {
    return TokenTypes.AGE;
  } else if (isPhone(token)) {
    return TokenTypes.PHONE;
  } else if (isWord(token)) {
    return TokenTypes.NAME;
  }

  return TokenTypes.INVALID;
}
 

/*
  Notes on API:
  Query "an Ni" will return Anna Nilson. "anNi" won't. "Ni an" also won't.
  Consider sending all permutations of text strings as search queries.
  Query phone number for 8348-383282
  48-38 will find it. 4838 won't.
  Keep '-' in phone query!

  For phone and age using the first valid candidates in the query.
  For name, all valid text token and concatenated in the order of appearence.
*/
export const parseQuery = (query) => {

  const parsedQuery = {
    name: '',
    phone: '',
    age: '',
  }

  const queryTokens = query.trim().toLowerCase().split(/\s+/);

  map(queryTokens, token => {
    switch(getTokenType(token)) {
      case TokenTypes.NAME:
        parsedQuery.name = parsedQuery.name === '' ? token : parsedQuery.name + ' ' + token;
        break;
      case TokenTypes.PHONE:
        if (parsedQuery.phone === '') {
          parsedQuery.phone = token;
        }
        break;
      case TokenTypes.AGE:
        if (parsedQuery.age === '') {
          parsedQuery.age = token;
        }
        break;
      case TokenTypes.INVALID:
        break;
      default:
        break;
    }
  })

  return parsedQuery;
}