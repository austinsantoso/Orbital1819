import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';

import './FullCalendar.scss';

class Calendar extends React.Component {
  render() {
    return (
      <FullCalendar
        defaultView='timeGridWeek'
        plugins={[timeGridPlugin, bootstrapPlugin, interactionPlugin]}
        themeSystem='bootstrap'
        allDaySlot={false}
        nowIndicator={true}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: false,
          hour12: false,
        }}
        height={600}
        editable={true}
        events={this.props.events}

        eventDragStart={(info) => {
          //console.log("Dragging start   function", info)
        }}

        eventDragStop={(info) => {
          //console.log("Draggin end function", info)
        }}

        eventDrop={(info) => {
          this.props.handleResize(info.event)
        }}

        eventResize={(info) => {
          this.props.handleResize(info.event)
        }}
        drop={(date, jsEvent, ui, resourceId) => {
          console.log('drop function');
        }}

        select={(start, end, allDay) => {
          console.log('select function');
        }}

      eventClick={(calEvent, jsEvent, view) => {
        console.group('click');
        console.log('calEvent');
        console.dir(calEvent);
        console.groupEnd();
        this.props.handleShowItemDesc(calEvent.event.id)
    }}
      />
    );
  }
}

export default Calendar;