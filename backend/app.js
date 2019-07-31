const express = require('express');
const cors = require('cors')
const bodyparser = require('body-parser');

//import { Promise } from 'es6-promise';
//import fetch from 'isomorphic-fetch';
//import axios from 'axios'
const axios = require('axios')

const event = require('./routes/Event');

const app = express();
app.use(cors());
app.use(bodyparser());

app.get('/', (req, res) => {
    res.send('Helllo World');
})

app.get('/example', (req, res) => {
    // res.send("hello world")
    console.log("gettig")
    axios.get('https://passwordwolf.com/api/?length=8&upper=off&lower=off&special=off&exclude=012345&repeat=5')
        .then(response => res.send(response.data))
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        })
})

app.use('/event', event)

const sqlite3 = require('sqlite3')
let db = new sqlite3.Database('./abcd.db');

// Requires: userId, calendarName, destination, startDate, endDate
app.post('/addCalendar', (req, res) => {
    const data = req.body;
    axios.get('http://localhost:5000/event/example').then((resp) => {
        let code = resp.data[0].password;

        db.serialize(() => {
            db.run(
                `INSERT INTO allEvents (code, name, destination, startTime, endTime, events) VALUES ($code, $name, $dest, $start, $end, '{"events":[]}')`,
                {
                    $code: code,
                    $name: data.calendarName,
                    $dest: data.destination,
                    $start: data.startDate,
                    $end: data.endDate
                },
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            db.run(
                "UPDATE UserInfo SET events = events || $code || ',' WHERE id = $id",
                {
                    $code: code,
                    $code: data.userId,
                },
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        });

        res.send({ calendarCode: code });
    });
});

app.get('/getEvents/:code', (req, res) => {
    db.get("SELECT events FROM allEvents WHERE code = $code", { $code: req.params.code }, (err, row) => {
        if (!err) {
            res.send(JSON.parse(row.events).events)
        } else {
            console.log(err);
        }
    })
})

app.get('/getDestination/:code', (req, res) => {
    db.get("SELECT destination FROM allEvents WHERE code = $code", { $code: req.params.code }, (err, row) => {
        if (!err) {
            res.send(JSON.parse(row.destination))
        } else {
            console.log(err);
        }
    })
})

app.post('/updateEvent/:code/:data', (req, res) => {
    db.run("UPDATE allEvents SET events = $events WHERE code = $code", { $events: req.params.data, $code: req.params.code }, (err) => {
        if (!err) {
            console.log("Success updating Event")
            res.send("OK");
        } else {
            console.log(err);
        }
    })
})

app.post('/addEvent/:code/:data', (req, res) => {
    db.get("SELECT events FROM allEvents WHERE code = $code", { $code: req.params.code }, (err, row) => {
        if (!err) {
            eventsObj = JSON.parse(row.events);
            eventsObj.events.push(JSON.parse(req.params.data));
            db.run("UPDATE allEvents SET events = $events WHERE code = $code", { $events: JSON.stringify(eventsObj), $code: req.params.code }, (err) => {
                if (!err) {
                    res.send("OK");
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    });
});


const GOOGLE_KEY = 'AIzaSyAzGPFfakx2b7G1xTG_wIya4nb0uktwV78'

app.get('/getLatLong/:code', (req, res) => {
    axios.get('https://maps.googleapis.com/maps/api/place/details/json?&fields=geometry&key=' + GOOGLE_KEY + '&placeid=' + req.params.code)
        .then((response) => {
            console.log(response.data.result.geometry.location);
            res.send(response.data.result.geometry.location);
        })
})
app.listen('5000');