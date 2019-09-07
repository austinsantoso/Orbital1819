import React from 'react';

import AddEventModal from './AddEventModal';
import EventDetailModal from './EventDetailModal';

class PlannerModals extends React.Component {
  render() {
    return (
      <div className="planner-modals">
        <AddEventModal
          show={this.props.showAddEventModal}
          toggleShow={this.props.toggleAddEventModal}

          calendarData={this.props.calendarData}
          getEvents={this.props.getEvents}
        />
        <EventDetailModal
          show={this.props.showEventDetailModal}
          toggleShow={this.props.toggleEventDetailModal}

          code={this.props.calendarData.code}
          id={this.props.eventDetail.id}
          title={this.props.eventDetail.title}
          comment={this.props.eventDetail.comment}
          getEvents={this.props.getEvents}
        />
      </div>
    );
  }
}

export default PlannerModals;