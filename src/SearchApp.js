import React, { Component } from 'react';
import clone from 'lodash/clone';

import './SearchApp.css';
import loading from './loading.gif';

import Search from './components/Search.js';
import PersonList from './components/PersonList.js';
import PersonSearcher from './services/PersonSearcher.js';

const RESULTS_IN_FULL_PAGE = 25;

class SearchApp extends Component {
  constructor(props) {
    super(props);
    this.startNewSearch = this.startNewSearch.bind(this);
    this.loadMoreResults = this.loadMoreResults.bind(this);

    // Must bind before constructing PersonSearchHandler.
    this.updateResults = this.updateResults.bind(this);
    this.updateMoreResults = this.updateMoreResults.bind(this);
    this.onSearchStarted = this.onSearchStarted.bind(this);
    
    this.personSearcher = new PersonSearcher(this.onSearchStarted, this.updateResults, this.updateMoreResults);
    this.state = { 
      results: [],
      message: ' ',
      loading: false,
      hasMoreResults: false,
      moreResultsMessage: ' ',
    };
  }

  updateResults(err, newResults = null) {
    let results = [];
    let message = ' ';
    let hasMoreResults = false;
    let moreResultsMessage = ' ';

    if (err) { // Assuming err is an error message.
      message = err;
    } else {
      results = newResults;
      message = 'Search results:';
      if (results.length === 0) {
        message = 'Search found no results. Please try searching something else.';
      } else if (results.length === RESULTS_IN_FULL_PAGE) {
        hasMoreResults = true;
      }
    }
    
    this.setState({ loading: false, results, message, hasMoreResults, moreResultsMessage });
  }

  updateMoreResults(err, newResults = null) {
    let results = clone(this.state.results);
    let hasMoreResults = false;
    let moreResultsMessage = '';

    if (err) {
      moreResultsMessage = err;
    } else {
      if (newResults.length > 0) {
        results = results.concat(newResults);
        if (newResults.length === RESULTS_IN_FULL_PAGE) {
          hasMoreResults = true;
        }
      }
    }

    this.setState({ loading: false, results, hasMoreResults, moreResultsMessage });
  }

  onSearchStarted() {
    this.setState({ 
      message: ' ',
      results: [],
      loading: true,
      hasMoreResults: false
    });
  }

  startNewSearch(query) {
    this.personSearcher.search(query);
  }

  loadMoreResults() {
    this.setState({ 
      loading: true,
    }, () => {
      this.personSearcher.getMorePersons();
    });
  }

  render() {
    return (
      <div className="search">
        <Search startNewSearch={this.startNewSearch}/>
      {this.state.loading && (
        <div className="loading">
          <img src={loading} alt="Loading results" />
        </div>
      )}
        <PersonList persons={this.state.results} message={this.state.message} />
      {this.state.hasMoreResults && (
        <p onClick={this.loadMoreResults} style={{cursor:'pointer'}}>Load more results...</p>
      )}
        
      </div>
    );
  }
}

export default SearchApp;
