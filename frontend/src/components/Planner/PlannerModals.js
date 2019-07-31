import React from 'react';

import AddEventModal from './AddEventModal';
import ItemDescModal from './ItemDescModal';

class PlannerModals extends React.Component {
  render() {
    return (
      <div className="planner-modals">
        <AddEventModal
          code={this.props.code}
          destinationLatLong={this.props.destinationLatLong}
          destinationId={this.props.destinationId}
          show={this.props.showAddEventModal}
          toggleShow={this.props.toggleAddEventModal}
          getEvents={this.props.getEvents}
        />
        <ItemDescModal
          code={this.props.code}
          id={this.props.item.id} //the item id
          title={this.props.item.title}
          placeId={this.props.item.placeId}
          comment={this.props.item.comment}
          show={this.props.showItemDescModal}
          toggleShow={this.props.toggleItemDescModal}
          getEvents={this.props.getEvents}
        />
      </div>
    );
  }
}

export default PlannerModals;