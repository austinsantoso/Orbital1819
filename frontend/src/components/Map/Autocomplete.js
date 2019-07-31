import React from 'react';
import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
} from 'react-places-autocomplete';

import classnames from './helper'
import './mapstyle.css'

/*
searchOptions = {}
*/
class TempMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        address: '',
        placeId: ''
    };
  }
 
  handleChange = address => {
    this.setState({ address });
  };
 
  handleSelect = (address, placeId) => {
    this.setState({
        address: address,
        placeId: placeId,
    })
    this.props.handleSelect(address, placeId)
  };

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status); // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  handleCloseClick = () => {
    this.setState({
      address: '',
      latitude: null,
      longitude: null,
    });
  };
 
  render() {
    return (
        <PlacesAutocomplete
        onChange={this.handleChange}
        value={this.state.address}
        onSelect={this.handleSelect}
        onError={this.handleError}
        searchOptions={this.props.searchOptions}
        //shouldFetchSuggestions={address.length > 2}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
          return (
            <div className="search-bar-container" style={{padding:"0", paddingLeft:"0", paddingRight:"0"}}>
              <div className="search-input-container">
                <input
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'search-input',
                  })}
                />
                {this.state.address.length > 0 && (
                  <button
                    className="clear-button"
                    onClick={this.handleCloseClick}
                  >
                    x
                  </button>
                )}
              </div>
              {suggestions.length > 0 && (
                <div className="autocomplete-container">
                  {suggestions.map(suggestion => {
                    const className = classnames('suggestion-item', {
                      'suggestion-item--active': suggestion.active,
                    });

                    return (
                      /* eslint-disable react/jsx-key */
                      <div
                        {...getSuggestionItemProps(suggestion, { className })}
                      >
                        <strong>
                          {suggestion.formattedSuggestion.mainText}
                        </strong>{' '}
                        <small>
                          {suggestion.formattedSuggestion.secondaryText}
                        </small>
                      </div>
                    );
                    /* eslint-enable react/jsx-key */
                  })}
                  <div className="dropdown-footer">
                    <div>
                      <img
                        src={require('../../images/powered_by_google_default.png')}
                        className="dropdown-footer-image"
                        alt="Powered by Google"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </PlacesAutocomplete>
    );
  }
}

export default TempMap;