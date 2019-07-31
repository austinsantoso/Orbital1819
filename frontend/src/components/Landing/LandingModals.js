import React from 'react';

import CreateCalendarModal from './CreateCalendarModal';

class LandingModals extends React.Component {
  render() {
    return (
      <div className="landing-modals">
        <CreateCalendarModal
          userData={this.props.userData}
          show={this.props.showCreateCalendarModal}
          toggleShow={this.props.toggleCreateCalendarModal}
          loadCalendar={this.props.loadCalendar}
        />
      </div>
    );
  }
}

export default LandingModals;