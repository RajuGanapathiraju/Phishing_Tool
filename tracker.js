let express = require('express');
let app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


const url = 'mongodb://localhost:27017';
const dbName = 'phishing';


MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    start_tracker(db);
});


function start_tracker(db) {

    app.get('/trackedby', (req, res, next) => {
        let email = req.query.tid;
        let source_user = req.query.dm;

        db.collection('tracker').insert({
            "email": email,
            type: "open",
            timestamp: parseInt(Date.now()/1000)
        }, (err, resp) => {
            if (err) console.log("error at insertion", err);
            else {
                console.log("email opened ---->>", email);
                res.send({
                    "opens": "captured"
                });
            }
        })
    })

    app.get('/path', (req, res, next) => {
        let email = req.query.enc;

        db.collection('tracker').insert({
            "email": email,
            type: "click",
            timestamp: parseInt(Date.now()/1000)
        }, (err, resp) => {
            if (err) console.log("error at click insertion", err);
            else {
                console.log("email clicked ---->>", email);
                res.redirect(`https://docs.google.com/spreadsheets/d/16B0p3il8B_Krc5Y8a74BYX7kIdE8Sy7xQQ2URrJ3vMY/edit?usp=sharing`);
            }
        })
    })

    app.get('/unpath', (req, res, next) => {
        let email = req.query.email;
        db.collection('tracker').insert({
            "email": email,
            type: "unsub",
            timestamp: parseInt(Date.now()/1000)
        }, (err, resp) => {
            if (err) console.log("error at click insertion", err);
            else {
                console.log("email unsub ---->>", email);
                res.send(`<html><body><h1>unsubscribed successfully</h1></body></html>`);
            }
        })
    })

    app.listen(80);
}