const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient;

const app = express()


app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.get('/',(req,res) => {
    res.render('index')
})

app.get('/collection',(req,res) => {
    res.render('collection')
})

app.post('/collection', (req, res) => {
    const db_name = req.body.DBname
    const collection_name = req.body.collection_name
    const url = `mongodb://localhost:27017/${db_name}`;

    MongoClient.connect(url, function(err, db) {
    if (err) {
        console.error(err)
        res.redirect('/')
    };
    console.log("Database created!");
    const dbo = db.db(db_name);
    dbo.createCollection(collection_name, function(err, collection) {
      if (err) {
        console.error(err)
        res.redirect('/')
      };
      console.log("Collection created!");
      db.close();
      res.redirect('/')
    });    
    });

    
})

app.get('/insert',(req,res) => {
    res.render('insert')
})

app.post('/insert', (req,res) => {
    let db_name = req.body.db_name
    let collection_name = req.body.collection_name
    let myobj = req.body.insert_doc
    console.log(myobj)
    MongoClient.connect(`mongodb://localhost:27017/${db_name}`, function(err, db) {
        if (err) throw err;
        let dbo = db.db("mydb");
        dbo.collection(collection_name).insertOne(JSON.parse(myobj), function(err, res) {
          if (err) throw err;
          console.log(res.ops);
          db.close();

        });
      });
      res.redirect('/')
})

app.get('/insert',(req,res) => {
    res.render('insert')
})

app.listen(3000,() => console.log('server running on port 3000'))