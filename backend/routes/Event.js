const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router()

const axios = require('axios')

const DB_PATH = './abcd.db' // sqlite3 file
let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Main error message: ", err.message);
  }
  console.log(`vacayPlan is connected to ${DB_PATH}`);
})


router.get('/reset', (req, res) => {
    console.log("Resetting the DB")
    db.serialize(() => {
        db.run("DROP TABLE allEvents", function(err) {
            if(err) {
                console.log(err.message)
            }
        }) //delete the main table containt all the data
        const command1 = "CREATE TABLE allEvents (" +
            "id	INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE," +
            "code	TEXT UNIQUE," +
            "name TEXT," +
            "destination TEXT," +
            "startTime	TEXT," +
            "endTime	TEXT" +
            "description TEXT" +
            ")";
        db.run(command1, function(err) {
            if(err) {
                console.log(err.message)
            }
        })
    })
})

router.get('/users', (req, res) => {
    db.all('SELECT * FROM UserInfo', (err, rows) => {
        if(err) {
            console.log(err)
        } else {
            console.log("sending user info: ", rows)
            res.send(rows)
            console.log("---------------------------------------------")
        }
    })
})

router.post('/addusers', (req, res) => {
    
    console.log(req.body)
    db.run("INSERT INTO UserInfo VALUES(null, ?, ?, '')", [req.body.username, req.body.password], function(err) {
        if(err) {
                console.log("error insert new code: " , err)
        } else {
            console.log("adding new user to database:", req.body.username)
            res.send(this.lastID.toString()) //returning the id
            console.log("---------------------------------------------")
        }
    })
})
router.post('/modifyusers', (req, res) => {
    console.log("modifying user")
    console.log(req.body)
    var command = "UPDATE  UserInfo SET " +
         "events = " + "'" + req.body.events + "'" +
         " WHERE id = " + req.body.id;

    console.log("command: ", command)
    db.run(command, function(err) {
        if(err) {
            console.log("error in posting basic update: " + err.message)
        } else {
            res.send("done")
        }
        console.log("---------------------------------------------")
    })
})


//to get a random word
router.get('/example', (req, res) => {
    axios.get('https://passwordwolf.com/api/?lower=off&numbers=off&special=off&length=7&repeat=1')
        .then(response => res.send(response.data))
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             // ADD THIS THROW error
              throw error;
        })
})
//to initiante a new event
router.get('/new', (req, res) => {
    console.log("in /new")
    axios.get('http://localhost:5000/event/example')
        .then((res) => {
            console.log(res)
            return(res.data[0].password)
        })
        .then((response) => {
            db.serialize(function() {
                //adding the code to the main table
                db.run("INSERT INTO allEvents VALUES(null, ?, '', '', '', '', '')", [response], function(err) {
                    if(err) {
                            console.log("error insert new code: " , err)
                    } else {
                        res.send(this.lastID.toString()) //returning the id
                    }
                });
                //creating the item info table
                var command1 = "CREATE TABLE "+  response + "_ItemInfo"+ " (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, title TEXT, startTime TEXT, endTime TEXT, itemDesc TEXT)";
                db.run(command1, function(err) {
                    if(err) {
                        console.log("error making table: ", err.message)
                    }
                })
                console.log("table itemInfo " + response + " created")
                //creating the suggestion table
                var command2 = "CREATE TABLE "+  response + "_Suggestion"+ " (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, title TEXT, createdAt TEXT, text TEXT)";
                db.run(command2, function(err) {
                    if(err) {
                        console.log("error making table: ", err.message)
                    }
                })
                console.log("table Suggestion " + response + " created")
            })
            return response;
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        })



/*
db.serialize(function() {
  db.run("CREATE TABLE user (id INT, dt TEXT)");

  var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
  for (var i = 0; i < 10; i++) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  stmt.run(i, n);
  }
  stmt.finalize();

  db.each("SELECT id, dt FROM user", function(err, row) {
      console.log("User id : "+row.id, row.dt);
  });
});

*/

    // db.run("INSERT INTO eventCode VALUES(null, ?)", (err) => {
    //     if(err) {
    //         console.log("error: " ,err.message)
    //     }
    // });

    // var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
    // for (var i = 0; i < 10; i++) {

    //     var d = new Date();
    //     var n = d.toLocaleTimeString();
    //     stmt.run(i, n);
    // }
    // stmt.finalize();

    // db.each("SELECT id, dt FROM user", function(err, row) {
    //     console.log("User id : "+row.id, row.dt);
    // });
    //db.close();
})
//to get the basic info of an event
router.get('/basic/:eventId', (req, res) => {
    db.all('SELECT * FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
        if(err) {
            console.log("error getting basic: ", err.message)
        } else {
            console.log("basicINfo: ", req.params.eventId," : ", rows)
            res.send(rows)
            console.log("---------------------------------------------")
        }
    })
})
//to get the items of an event
router.get('/items/:eventId', (req, res) => {
    
    db.serialize(function() {
        console.log("req.params.id:", req.params.eventId)
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting basic: ", err.message)
            } else {
                var temp = rows[0].code + "_ItemInfo"
                var command = 'SELECT * FROM ' + temp
                console.log("command: ", command)
                db.all(command, (err, rows) => {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log("inside /items/eventId")
                        console.log(rows)
                        res.send(rows)
                        console.log("---------------------------------------------")
                    }
                })
            }
        })
    })
    
})
//to get the suggestions of an event
router.get('/suggestions/:eventId', (req, res) => {
    
    db.serialize(function() {
        
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting basic: ", err.message)
            } else {
                var temp = rows[0].code + "_Suggestion"
                console.log("temp: ", temp)
                var command = 'SELECT * FROM ' + temp
                console.log("command: ", command)
                db.all(command, (err, rows) => {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log("inside /suggestion/eventId")
                        console.log(rows)
                        res.send(rows)
                        console.log("---------------------------------------------")
                    }
                })
            }
        })
    })
    
})
//to update/modify the basic information
router.post('/updateBasic/:eventId', (req, res) => {
    console.log("inside update basic")
    var command = "UPDATE allEvents SET " +
         "name = " + "'" + req.body.vacationName + "'" +
         ", destination = " + "'" + req.body.destination + "'" + 
         ", startTime = " + "'" + req.body.defaultTimeStart + "'" +
         ", endTime = " + "'" + req.body.defaultTimeEnd + "'" +
         ", description = " + "'" + req.body.description + "'" +
         " WHERE id = " + req.params.eventId;

    console.log("command: ", command)
    db.run(command, function(err) {
        if(err) {
            console.log("error in posting basic update: " + err.message)
        } else {
            console.log("---------------------------------------------")
        }
    })
});
//to add items to an event
router.post('/addItem/:eventId', (req, res) => {
    db.serialize(function() {

        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting basic: ", err.message)
            } else {
                console.log(req.params)
                console.log("rows: ", rows)
                console.log(req.body)
                var code = rows[0].code + "_ItemInfo"
                var command = "INSERT INTO " + code + " VALUES(null, " + 
                    "'" + req.body.title + "'" +  ", " +
                    "'" + req.body.startTime + "'" + ", " +
                    "'" + req.body.endTime + "'" + ", " + 
                    "'" + " " + "'" + ")";
                    
                console.log("command: ", command)
                db.run(command, function(err) {
                    if(err) {
                        console.log("error insert new code: " , err)
                    } else {
                        res.send(this.lastID.toString());
                        console.log("---------------------------------------------")
                    }
                });
            }
        })


    })
});
//to add suggestions to an event
router.post('/addSuggestion/:eventId', (req, res) => {
    db.serialize(function() {
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting suggsetion: ", err.message)
            } else {
                console.log(req.params)
                console.log("rows: ", rows)
                console.log(req.body)

                var code = rows[0].code + "_Suggestion"
                var command = "INSERT INTO " + code + " VALUES(null";
                for(x in req.body) {
                        command += ", "+ "'" + req.body[x] + "'"
                }    
                command += ")"

                console.log("command: ", command)
                db.run(command, function(err) {
                    if(err) {
                        console.log("error adding suggestion: " , err)
                    } else {
                        res.send(this.lastID.toString());
                        console.log("---------------------------------------------")
                    }
                });
            }
        })
    })
});
//to update/modify an item of an event
router.post('/updateItem/:eventId/:itemId', (req, res) => {
    db.serialize(function() {
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting basic: ", err.message)
            } else {
                console.log(req.params)
                console.log("rows: ", rows)
                console.log(req.body)
                
                var code = rows[0].code + "_ItemInfo"
                var command = "UPDATE " + code + " SET";
                const len = Object.keys(req.body).length
                var i = 1;
                for(x in req.body) {
                        command += " " + x + " = " + "'" + req.body[x] + "'"
                        if(i < len) {
                            command += " ,";
                            i++
                        }
                }    
                command += " WHERE id = " + req.params.itemId;

                console.log("command: ", command)
                db.run(command, function(err) {
                    if(err) {
                        console.log("error update Desc: " , err)
                    } else {
                        res.send(this.lastID.toString());
                        console.log("---------------------------------------------")
                    }
                });
            }
        })


    })
});
//to delete a suggestion from an event
router.post('/deleteSuggestion/:eventId', (req, res) => {
    db.serialize(function() {
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting basic: ", err.message)
            } else {
                console.log(req.params)
                console.log("rows: ", rows)
                console.log(req.body)

                var code = rows[0].code + "_Suggestion"
                var command = "DELETE FROM " + code + " WHERE";
                command += " id = " + req.body.sugId;

                console.log("command: ", command)
                db.run(command, function(err) {
                    if(err) {
                        console.log("error update Desc: " , err)
                    } else {
                        res.send(this.lastID.toString());
                        console.log("---------------------------------------------")
                    }
                });
            }
        })
    })
});
//to delete an item from an event
router.post('/deleteItem/:eventId', (req, res) => {
    db.serialize(function() {
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error getting basic: ", err.message)
            } else {
                console.log(req.params)
                console.log("rows: ", rows)
                console.log(req.body)

                var code = rows[0].code + "_ItemInfo"
                var command = "DELETE FROM " + code + " WHERE";
                command += " id = " + req.body.itemId;

                console.log("command: ", command)
                db.run(command, function(err) {
                    if(err) {
                            console.log("error update Desc: " , err)
                    } else {
                        res.send(this.lastID.toString());
                        console.log("---------------------------------------------")
                    }
                });
            }
        })
    })
});
//delete event
router.post('/deleteEvent/:eventId', (req, res) => {
    db.serialize(function() {
        db.all('SELECT code FROM allEvents WHERE id=?', [req.params.eventId], (err, rows) => {
            if(err) {
                console.log("error deleteing event: ", err.message)
            } else {
                console.log("rows: ", rows)
                console.log(req.params)
                var code = rows[0].code
                var maincommand = "DELETE FROM allEvents WHERE id = " + req.params.eventId;
                    console.log("command: ", maincommand)
                var delone = "DROP TABLE " + code + "_ItemInfo"
                    console.log("command: ", delone)
                var deltwo = "DROP TABLE " + code + "_Suggestion"
                    console.log("command: ", deltwo)
                
                    db.run(maincommand, function(err) {
                        if(err) {
                                console.log("error deleting event: " , err)
                        }
                    });

                    db.run(delone, function(err) {
                        if(err) {
                                console.log("error deleting event: " , err)
                        }
                    });

                    db.run(deltwo, function(err) {
                        if(err) {
                                console.log("error deleting event: " , err)
                        }
                    });
                res.send("done")
                console.log("---------------------------------------------")
            }
        })
    })
});

module.exports = router