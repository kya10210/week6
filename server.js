const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const morgan = require('morgan');
//Configure Express
const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.listen(8080);
//Configure MongoDB
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017/";
//reference to the database (i.e. collection)
let db;
//Connect to mongoDB server
MongoClient.connect(url,{ useUnifiedTopology: true }, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });

    //homepage
    app.get('/', function (req, res) {
        res.render('index.html');
    });

    //insert
    app.get('/inserttask', function(req,res){
        res.render('inserttask.html');
    });

    app.post('/add', function(req,res){
        let taskDetails = req.body;
        let taskStatus = taskDetails.taskstatus;

        console.log(taskDetails);
        
        db.collection('tasks').insertOne({ 
            id: getNewId(),
            name: taskDetails.taskname,
            assign: taskDetails.taskassign,
            due: taskDetails.taskdue,
            status: taskDetails.taskstatus,
            description: taskDetails.taskdesc });
        res.redirect('/listtasks');
    });
    //date haven't fixed

    //list all
    app.get('/listtasks', function(req,res){
        db.collection('tasks').find({}).toArray(function (err, data) {
            res.render('listtasks.html', { taskDb: data });
        });
    });

    //delete by task id
    app.get('/deletebytaskid', function(req,res){
        res.render('deletetask.html');
    });

    app.post('/deletebyid', function(req,res){
        let taskId = Number(req.body.taskid);
        db.collection('tasks').deleteOne({id: taskId}, function(err,obj){
            console.log(obj.result);
        });
        res.redirect('/listtasks');
    });

    //delete all completed task
    app.get('/deletecompletedtask', function(req,res){
        res.render('deletecompleted.html');
    });

    app.post('/deletecompleted', function(req,res){
        let filter = { status: 'Complete' };
        db.collection('tasks').deleteMany(filter, function (err, obj) {
            console.log(obj.result);
          });
        res.redirect('/listtasks');
    });

    //update status
    app.get('/updatetaskbyid', function(req,res){
        res.render('updatetask.html');
    });

    app.post('/update', function(req,res){
        let taskId = Number(req.body.taskid);
        let taskStatus = req.body.taskstatus;
        let filter = { id: taskId};
        let theUpdate = { $set: {status: taskStatus} };
        db.collection('tasks').updateOne(filter,theUpdate, function (err, obj) {
            console.log(obj.result);
          });
        res.redirect('/listtasks');
    });

   
    //generate ID
    function getNewId() {
        return (Math.floor(Math.random() * 1000));
    }