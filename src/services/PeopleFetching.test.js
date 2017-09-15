import { requestSearch } from './PeopleFetching.js';

describe('test data fetching', function() {

  // TODO: Fix test.
  it('check search request', function() {
    requestSearch({ name: 'Anna Nilsson' }, 1, (result) => {
      expect(result).toBe(1);
    });
  });

  // TODO: More tests!
});