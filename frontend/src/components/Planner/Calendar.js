import React from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import Axios from 'axios';

import './FullCalendar.scss';

class Calendar extends React.Component {
  render() {
    const calendarData = this.props.calendarData;
    const isCalendarDataEmpty = JSON.stringify(calendarData) === '{}';

    return (
      <FullCalendar
        plugins={[timeGridPlugin, bootstrapPlugin, interactionPlugin]}
        themeSystem='bootstrap'

        defaultView='timeGridWeek'
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
        validRange={nowDate => {
          var startDate = moment(nowDate).format('YYYY-MM-DD');
          var endDate = moment(nowDate).add(1, 'months').format('YYYY-MM-DD');

          if (!isCalendarDataEmpty) {
            startDate = calendarData.start_date;
            endDate = calendarData.end_date;
          }

          return {
            start: startDate,
            end: endDate
          }
        }}

        // Events and event interactions
        events={this.props.events}
        eventClick={info => {
          this.props.handleShowEventDetail(info.event.id);
        }}

        editable={true}
        eventDragStart={(info) => {

        }}
        eventDragStop={(info) => {

        }}
        eventResize={(info) => {
          this.props.handleResize(info.event)
        }}

        droppable={true}
        eventDrop={(info) => {
          this.props.handleResize(info.event)
        }}
        drop={info => {
          const el = info.draggedEl;
          const data = {
            id: el.getAttribute('placeId'),
            title: el.getAttribute('title'),
            start: moment(info.date).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(info.date).add({ minutes: 60 }).format('YYYY-MM-DD HH:mm:ss'),
            comment: '',
          }

          Axios.post('http://localhost:5000/addEvent/' + this.props.calendarData.code + '/' + JSON.stringify(data))
            .then((res) => {
              //this.props.toggleShow();
              //this.props.getEvents(this.props.calendarData.code);
            })
            .catch(console.log);
        }}

        select={(start, end, allDay) => {
          console.log('select function');
        }}
      />
    );
  }
}

export default Calendar;