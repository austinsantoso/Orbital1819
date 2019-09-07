const express = require('express');
const cors = require('cors')
const bodyparser = require('body-parser');
const axios = require('axios');
const sqlite3 = require('sqlite3');

const app = express();
app.use(cors());
app.use(bodyparser());

const DB_PATH = './abcd.db' // sqlite3 file
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  }

  console.log(`Backend is connected to ${DB_PATH}`);
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Users - Create, Authenticate
const createUserQuery = `INSERT INTO users (username, password) VALUES ($username, $pass)`;
const authUserQuery = `SELECT id, username FROM users WHERE username = $username AND password = $pass`;

app.post('/createUser', (req, res) => {
  const userData = {
    $username: req.body.username,
    $pass: req.body.password
  };

  db.run(createUserQuery, userData, function (err) {
    if (err) {
      console.log('Add User error:', err);
      res.status(400).send();
      return;
    }

    const response = {
      id: this.lastID,
      username: req.body.username
    };

    res.send(response);
  });
});

app.post('/authUser', (req, res) => {
  const userData = {
    $username: req.body.username,
    $pass: req.body.password
  };

  db.get(authUserQuery, userData, (err, row) => {
    if (err) {
      console.log('Auth User error:', err);
      res.status(400).send();
      return;
    }

    if (!row) {
      console.log('Auth User error: Wrong username/password');
      res.status(401).send();
      return;
    }

    res.send(row);
  });
});

// Calendars - Create, Read, Delete
const insertCalendarQuery = `INSERT INTO calendars (code, name, destination, lat_lng, start_date, end_date) VALUES ($code, $name, $dest, $latlng, $start, $end)`;
const getUserCalendarsQuery = `SELECT calendars FROM users WHERE id = $id`;
const updateUserCalendarsQuery = `UPDATE users SET calendars = $cals WHERE id = $id`;
const getCalendarDataQuery = `SELECT * FROM calendars WHERE code = $code`
const getCalendarsDataBaseQuery = `SELECT * FROM calendars WHERE code IN`;

app.post('/addCalendar/:userId', (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  axios.get('https://passwordwolf.com/api/?length=8&repeat=1&lower=off&numbers=off&special=off')
    .then(response => {
      const code = response.data[0].password;

      const calendarData = {
        $code: code,
        $name: data.calendarName,
        $dest: data.destination,
        $latlng: data.latLong,
        $start: data.startDate,
        $end: data.endDate
      };

      db.serialize(() => {
        db.run(insertCalendarQuery, calendarData, err => {
          if (err) {
            throw err;
          }
        });

        db.get(getUserCalendarsQuery, { $id: userId }, (err, row) => {
          if (err) {
            throw err;
          }

          const calendars = JSON.parse(row.calendars);
          calendars.push(code);

          const updateUserCalendarsData = {
            $cals: JSON.stringify(calendars),
            $id: userId
          };

          db.run(updateUserCalendarsQuery, updateUserCalendarsData, err => {
            if (err) {
              throw err;
            }
          });
        });
      });

      res.send({ calendarCode: code });
    })
    .catch(err => {
      console.log('Add Calendar error:', err.message);
      res.status(400).send();
    });
});

app.get('/getCalendars/:userId', (req, res) => {
  db.get(getUserCalendarsQuery, { $id: req.params.userId }, (err, row) => {
    if (err) {
      console.log('Get Calendars error:', err);
      res.status(400).send();
      return;
    }

    const calendars = JSON.parse(row.calendars);
    const bindvars = '(' + calendars.map(() => '?').join(',') + ')';

    db.all(getCalendarsDataBaseQuery + ' ' + bindvars, calendars, (err, rows) => {
      if (err) {
        console.log('Get Calendars error:', err);
        res.status(400).send();
        return;
      }

      res.send(rows);
    })
  });
});

app.get('/getCalendarData/:code', (req, res) => {
  db.get(getCalendarDataQuery, { $code: req.params.code }, (err, row) => {
    if (err) {
      console.log('Get Calendar Data error:', err);
      res.status(400).send();
      return;
    }

    if (!row) {
      console.log('Get Calendar Data error: no calendar found');
      res.status(401).send();
      return;
    }

    res.send(row);
  })
});

app.delete('/deleteCalendar/:userId/:code', (req, res) => {
  db.get(getUserCalendarsQuery, { $id: req.params.userId }, (err, row) => {
    if (err) {
      console.log('Delete Calendar error:', err);
      res.status(400).send();
      return;
    }

    var calendars = JSON.parse(row.calendars);
    calendars = calendars.filter(cal => cal !== req.params.code);

    const updateUserCalendarsData = {
      $cals: JSON.stringify(calendars),
      $id: req.params.userId
    };

    db.run(updateUserCalendarsQuery, updateUserCalendarsData, err => {
      if (err) {
        console.log('Delete Calendar error:', err);
        res.status(400).send();
        return;
      }

      res.send('Success');
    })
  });
})

// Calendar events - Create, Read, Update
const addEventQuery = `SELECT events FROM calendars WHERE code = $code`;
const updateEventQuery = `UPDATE calendars SET events = $events WHERE code = $code`;

app.post('/addEvent/:code/:data', (req, res) => {
  db.get(addEventQuery, { $code: req.params.code }, (err, row) => {
    if (err) {
      console.log('Add Event error:', err);
      res.status(400).send();
      return;
    }
    console.log("Adding event");
    const events = JSON.parse(row.events).events;
    if (!events) {
      events = [];
    }
    console.log(events);
    events.push(JSON.parse(req.params.data));
    

    const updateEventData = {
      $events: JSON.stringify(events),
      $code: req.params.code
    }

    db.run(updateEventQuery, updateEventData, (err) => {
      if (err) {
        console.log('Add Event error:', err);
        res.status(400).send();
        return;
      }

      res.send(events);
    });
  });
});

app.get('/getEvents/:code', (req, res) => {
  db.get(`SELECT events FROM calendars WHERE code = $code`, { $code: req.params.code }, (err, row) => {
    if (err) {
      console.log('Get Events error:', err);
      res.status(400).send();
      return;
    }

    res.send(row.events);
  });
});

app.post('/updateEvent/:code/:data', (req, res) => {
  const events = req.params.data;

  db.run("UPDATE calendars SET events = $events WHERE code = $code", { $events: events, $code: req.params.code }, (err) => {
    if (err) {
      console.log('Update Event error:', err);
      res.status(400).send();
      return;
    }

    res.send(events);
  });
});

// Google API - Get Suggestions

const GOOGLE_KEY = 'AIzaSyAzGPFfakx2b7G1xTG_wIya4nb0uktwV78';
const getSuggestionsUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?&radius=50000&key=' + GOOGLE_KEY;

app.get('/getSuggestions/:latlong', (req, res) => {
  axios.get(getSuggestionsUrl + '&location=' + req.params.latlong)
    .then(response => {
      const data = response.data.results.map(place => {
        return {
          id: place.place_id,
          name: place.name
        }
      });

      res.send(data);
    })
    .catch(err => {
      console.log('Get Suggestions error:', err.message);
      res.status(400).send();
    });
});

app.listen('5000');