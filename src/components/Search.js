import React, { Component } from 'react';
import debounce from 'lodash/debounce';

const DEBOUNCE_VALUE = 500;

class Search extends Component {
  state = {
    searchTerm: '',
    debouncedSearch: debounce(this.props.startNewSearch, DEBOUNCE_VALUE)
  }

  onSearchInputChanged = event => {
    const searchTerm = event.target.value;
    const previousSearchTerm = this.state.searchTerm;
    
    this.setState({searchTerm}, () => {
      const trimmedSearchTerm= searchTerm.trim();
      if (trimmedSearchTerm !== previousSearchTerm.trim()) {
        this.state.debouncedSearch(trimmedSearchTerm, this.props.updateResults);
      }
    });    
  }

  // If the user pressed the Enter key, force the debounced search method to execute.
  onKeyPress = event => {
    if (event.key === 'Enter'){
      this.state.debouncedSearch.flush();
    }
  }

  render() {
    const showPlaceHolder = !this.state.searchTerm.length;
    return (  
      <div className="cui__input giant">
      {showPlaceHolder && 
        <label className="cui__input__label">
            Type your search query
        </label>
      }
        <input 
          className="cui__input__input"
          value={this.state.searchTerm}
          onChange={this.onSearchInputChanged}
          onKeyPress={this.onKeyPress}/>
      </div>
    );
  }
}

export default Search;