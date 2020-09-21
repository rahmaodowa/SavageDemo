const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://rodowa:Soccer123@cluster0.nat1q.mongodb.net/21Savage?retryWrites=true&w=majority"
const dbName = "21savage";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});


/*Server:
First line: this file requires express
2nd: anywhere you see app = express running function
3rd: body parser: grab stuff from index.ejs
4th: mongo db
Var db collection = saying render it to
Const url = mongo db url

16 - App300 - connects to server */


/*Upsert: check if another property exists, if it does - update it.

View engine: tells express what view engine to use: ejs.

/ route folder app.js another path: goes to collection called messages

Array.from makes an array from those objects.

26 - fetch message on route - put array renders index.js

Query from data base -

Find one document & update

When get request from route: find whats in it & put in an array. */

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp:"", thumbDown: "", value: 0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  if(req.body.thumbUp == "yes"){
    db.collection('messages')
    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      $set: {
        thumbUp: req.body.thumbUp,
        thumbDown: req.body.thumbDown,
        value:req.body.value + 1
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  } else if((req.body.thumbDown == "yes") && (req.body.value!=0)){
    db.collection('messages')
    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp: req.body.thumbUp,
      thumbDown: req.body.thumbDown,
      value: req.body.value -1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
    })
  }
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
