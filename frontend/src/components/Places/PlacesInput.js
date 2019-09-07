import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import './PlacesInput.css';

class PlacesInput extends React.Component {
  render() {
    return (
      <PlacesAutocomplete
        value={this.props.value}
        onChange={this.props.onChange}
        onSelect={this.props.onSelect}
        onError={(status, clearSuggestions) => clearSuggestions()}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Form.Control {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input'
            })} />
            <div className="autocomplete-dropdown-container">
              {loading && <Row><Col>Loading...</Col></Row>}
              {suggestions.map(suggestion =>
                <Row {...getSuggestionItemProps(suggestion, { className: "suggestion-item" })} >
                  <Col lg={1} className="suggestion-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </Col>
                  <Col lg={11} className="suggestion-name">
                    {suggestion.formattedSuggestion.mainText + "    "}
                    <span className="text-muted">{suggestion.formattedSuggestion.secondaryText}</span>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default PlacesInput;