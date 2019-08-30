let express = require('express');
let bodyparser = require('body-parser');
//1, ref-> Mongodb module
let mongodb= require('mongodb');
//2. get cilent from the ref
let mongodbClient=mongodb.MongoClient;
//3. get ccess to db from the cilent
let url = 'mongodb://localhost:27017/';
let viewsPath=__dirname +'/views/';
let db=null;
let col=null;
mongodbClient.connect(url,{useNewUrlParser: true},function(err,cilent){
    db=cilent.db('week5lec');
    col=db.collection('customers');
   // col.insertOne({name: 'Tim',age: 23});
});
//4 get access to collection form db
//5. all insert, update, delete, find from collection

let app=express();
app.use(bodyparser.urlencoded({extended:false}));

app.get('/',function(req,res){
    //col.insertOne({name:'John',address:'mel'});
    res.sendFile(viewsPath+'w5.html');
});

app.post('/newCustomer',function(req,res){
    col.insertOne(req.body);
    res.sendFile(viewsPath+'w5.html');
});

app.get('/getall',function(req,res){
    col.find({}).toArray(function(err,data){
        res.send(data);
        console.log(data);  
    });
});
app.listen(8080);
//nodemon server.js

// 1<= age < 40
    let query={$and:[{age:{$gte:1}},{age:{$lt:40}}]};