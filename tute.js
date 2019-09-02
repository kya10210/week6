let express = require('express');
let app =express();
let bodyparser = require('body-parser');
let mongodb= require('mongodb');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyparser.urlencoded({ extended: false }));
let MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
let db;
let coll;
MongoClient.connect(url,{useNewUrlParser: true},function(err,success){
    if (err) {
        console.log("Err  ", err);
    } else {
        console.log("Connected successfully to server");
        db = success.db("fit2095db");
    }
});

app.listen(8080);