import { parseQuery, getTokenType, TokenTypes } from './PersonQueryParsing.js';

describe('test query parsing', function() {

  it('check \'adam 83 smith 83-2888\' query', function() {
    const token = 'adam 83 smith 83-2888';
    expect(parseQuery(token)).toEqual({
      name: 'adam smith',
      age: '83',
      phone: '83-2888',
    });
  });

  it('check \'83\' query', function() {
    const token = '83';
    expect(parseQuery(token)).toEqual({
      name: '',
      age: '83',
      phone: '',
    });
  });

  it('check \'8-3\' query', function() {
    const token = '8-3';
    expect(parseQuery(token)).toEqual({
      name: '',
      age: '',
      phone: '8-3',
    });
  });

  // BAD QUERIES:
  it('check \'ad*m\' query', function() {
    const token = 'ad*m';
    expect(parseQuery(token)).toEqual({
      name: '',
      age: '',
      phone: '',
    });
  });
});

describe('test age token parsing', function() {
  
  // AGE:

  it('check 1 is age', function() {
    const token = '1';
    expect(getTokenType(token)).toBe(TokenTypes.AGE);
  });

  it('check 120 is age', function() {
    const token = '120';
    expect(getTokenType(token)).toBe(TokenTypes.AGE);
  });

  // NOT AGE:

  it('check 1- is not age', function() {
    const token = '1-';
    expect(getTokenType(token)).not.toBe(TokenTypes.AGE);
  });

  it('check -1 is not age', function() {
    const token = '-1';
    expect(getTokenType(token)).not.toBe(TokenTypes.AGE);
  });

  it('check 121 is not age', function() {
    const token = '121';
    expect(getTokenType(token)).not.toBe(TokenTypes.AGE);
  });
  
  it('check 0 is age', function() {
    const token = '0';
    expect(getTokenType(token)).not.toBe(TokenTypes.AGE);
  });
});

describe('test phone token parsing', function() {

  // PHONE:

  it('check 121 is phone', function() {
    const token = '121';
    expect(getTokenType(token)).toBe(TokenTypes.PHONE);
  });

  it('check 1- is phone', function() {
    const token = '1-';
    expect(getTokenType(token)).toBe(TokenTypes.PHONE);
  });

  it('check -1 is phone', function() {
    const token = '-1';
    expect(getTokenType(token)).toBe(TokenTypes.PHONE);
  });

  it('check - is phone', function() {
    const token = '-';
    expect(getTokenType(token)).toBe(TokenTypes.PHONE);
  });

  it('check six digits is phone', function() {
    const token = '012345';
    expect(getTokenType(token)).toBe(TokenTypes.PHONE);
  });

  it('check 2342-283423 is phone', function() {
    const token = '2342-283423';
    expect(getTokenType(token)).toBe(TokenTypes.PHONE);
  });

  // NOT PHONE:

  it('check % is not phone', function() {
    const token = '%';
    expect(getTokenType(token)).not.toBe(TokenTypes.PHONE);
  });

  it('check seven digits is not phone', function() {
    const token = '1111111';
    expect(getTokenType(token)).not.toBe(TokenTypes.PHONE);
  });

  it('check 12345-123456 is not phone', function() {
    const token = '12345-123456';
    expect(getTokenType(token)).not.toBe(TokenTypes.PHONE);
  });

  it('check 1234-1234567 is not phone', function() {
    const token = '1234-1234567';
    expect(getTokenType(token)).not.toBe(TokenTypes.PHONE);
  });
});

describe('test name token parsing', function() {

  // NAME:

  it('check adam is name', function() {
    const token = 'adam';
    expect(getTokenType(token)).toBe(TokenTypes.NAME);
  });

  // NOT NAME:

  it('check \'\' is not name', function() {
    const token = '';
    expect(getTokenType(token)).not.toBe(TokenTypes.NAME);
  });

  it('check \' \' is not name', function() {
    const token = ' ';
    expect(getTokenType(token)).not.toBe(TokenTypes.NAME);
  });

  it('check aDam is not name', function() {
    const token = 'aDam';
    expect(getTokenType(token)).not.toBe(TokenTypes.NAME);
  });

  it('check a$am is not name', function() {
    const token = 'a$am';
    expect(getTokenType(token)).not.toBe(TokenTypes.NAME);
  });
});
