import isEqual from 'lodash/isEqual';

import { requestSearch, getResults } from './PeopleFetching.js';
import { parseQuery } from './PersonQueryParsing.js';

const RESULTS_POLLING_FREQ = 250;
const ALLOWED_TIME_IN_CACHE = 3600; // In seconds.
const DEFAULT_ERROR_MESSASGE = 'Search encountered an issue. Please try again.';

const SearchStates = {
  IDLE: 1,
  REQUESTING: 2,
  FETCHING: 3,
  ERROR: 4
}

const emptyQuery = {
  name: '',
  phone: '',
  age: '',
};

// TODO: (In Future) Clean old items from localStorage priodically.
// TODO: (In Future) Break class into smaller chunk. i.e. separate cache management.
// TODO: (In Future) Add tests!

export default class PersonSearchHandler {
  constructor(onSearchStart, onNewResults, onMoreResults) {
    this.onNewResults = onNewResults;
    this.onMoreResults = onMoreResults;
    this.onSearchStart = onSearchStart;
    this.searchState = SearchStates.IDLE;     
    this.resetValues();
    this.requests = new Map();
  }

  resetValues() {
    this.currentRequestId = '';
    this.currentPage = 1;
    this.currentQuery = emptyQuery;
    this.timeout = null;    
  }

  sendResponse(err, results) {
    if (this.currentPage === 1) {
      this.onNewResults(err, results);
    } else {
      this.onMoreResults(err, results);
    }
  }

  changeSearchState(searchState, query = null, currentRequestId = null) {
    this.searchState = searchState;
    switch(searchState) {
      case SearchStates.IDLE:
        clearTimeout(this.timeout); // Do before reseting values.
        this.resetValues();
        break;
      case SearchStates.REQUESTING:
        this.currentQuery = query;
        break;
      case SearchStates.FETCHING:
        this.currentRequestId = currentRequestId;
        break;
      case SearchStates.ERROR:
        this.resetValues();
        break;
      default:
        break;
    }
  }

  checkResults(result, requestId) {
    if (result === null) return;
    
    // Check if we got results. If not, continue polling.
    if (result.results === null) {
      this.timeout = setTimeout(() => this.getResultsForCurrentQuery(), RESULTS_POLLING_FREQ);
    } else {
      // Cache the results
      localStorage.setItem(this.requests.get(requestId), JSON.stringify(result.results));
      localStorage.setItem(this.requests.get(requestId) + ':ts', Date.now());

      // No need to keep the request id now that the results are stored in cache.
      this.requests.delete(requestId);

      this.sendResponse(null, result.results);
    }
  }

  getResultsForCurrentQuery() {
    const currentRequestId = this.currentRequestId;
    getResults(currentRequestId, (err, result) => {
      // Don't continue if a new query has started since asking for results.
      if (currentRequestId === this.currentRequestId) {
        if (err) {
          // Got an unexpected response from the server. Stop polling for results.
          this.changeSearchState(SearchStates.ERROR);
          this.sendResponse(DEFAULT_ERROR_MESSASGE);
        } else {
          this.checkResults(result, currentRequestId);
        }
      }
    });
  }

  getKeyForCache(query, page) {
    return JSON.stringify(Object.assign({}, { page }, query));
  }

  getFromCache(cacheKey) {
    let valueToReturn = null;

    const cachedValue = localStorage.getItem(cacheKey);
    const cachingTime = localStorage.getItem(cacheKey + ':ts');

    if (cachedValue !== null && cachingTime !== null) {
      const ageInCache = (Date.now() - cachingTime) / 1000;
      if (ageInCache <= ALLOWED_TIME_IN_CACHE) {
        valueToReturn = JSON.parse(cachedValue);
      } else {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheKey + ':ts');
      }
    }

    return valueToReturn;
  }

  performSearchRequest(query) {

    // Check local storage for cached results for this query.
    const cacheKey = this.getKeyForCache(query, this.currentPage);
    const cachedValue = this.getFromCache(cacheKey);
    if (cachedValue !== null) {
      this.sendResponse(null, cachedValue);
    } else {
      requestSearch(query, this.currentPage, (err, searchResult) => {
        if (err) {
          this.changeSearchState(SearchStates.ERROR);
          this.sendResponse(DEFAULT_ERROR_MESSASGE);
        } else {
          // Store the request id and the query so caching the results later is possible.
          this.requests.set(searchResult.requestId.id, this.getKeyForCache(query, this.currentPage))
  
          // Only start polling if query wasn't cancelled.
          if (this.searchState === SearchStates.REQUESTING && isEqual(query, this.currentQuery)) {
            this.changeSearchState(SearchStates.FETCHING, null, searchResult.requestId.id);
            this.getResultsForCurrentQuery();
          }
        }
      });
    }
  }

  getMorePersons() {
    if (this.currentQuery !== emptyQuery) {
      this.changeSearchState(SearchStates.REQUESTING, this.currentQuery);
      this.currentPage += 1;
      this.performSearchRequest(this.currentQuery);
    }
  }

  search(queryString) { 
    const query = parseQuery(queryString);

    if (!isEqual(query, this.currentQuery)) {
      this.changeSearchState(SearchStates.IDLE);

      if (isEqual(query, emptyQuery)) {
        // Return empty results for empty query.
        this.sendResponse(' ');
      } else {
        this.onSearchStart();

        this.changeSearchState(SearchStates.REQUESTING, query);
        this.performSearchRequest(query);
      }
    }
  }
}