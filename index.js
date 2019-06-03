const express = require('express');
const app = express();
const port = process.env.PORT || 9090;
const path = require('path');
const bodyParser = require('body-parser');
const con = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('views', __dirname + '/view');
app.set("view engine", "ejs");
app.set('/views', '/view');

// Student List
app.get('/studentList', function(req, res, next) {
    con.query("SELECT * FROM student", (err, value) => {
        if(err){
            res.send(err);
        }
            res.render("student-list", {dataList: value});
    })
});
// Student add
app.get('/add', (req, res) => {
    res.render("student/add-student");
});
// Student Post
app.post('/addData', (req, res) => {
    con.query("INSERT INTO student(name, class, gender, dob, fatherName, motherName) VALUES('"+req.body.name+"', '"+req.body.class+"', '"+req.body.gender+"', '"+req.body.dob+"', '"+req.body.fname+"', '"+req.body.mname+"')", function(err, result){
        if(err){
            res.send(err);
        }
            res.send("Data inserted successfully!");
    });
});

// ---------------- Parent Data --------------------

app.get('/parentList', (req, res) => {
    con.query("SELECT * FROM parent", function(err, result) {
        if(err){
            res.send(err);
        }
            res.render('parent/list-parent', {parentData: result});
    });
});

app.get('/addParent', (req, res) => {
    res.render('parent/add-parent');
});

app.get('/getStud', (req, res) => {
    con.query("SELECT * FROM student", (err, result) => {
        if(err){
            res.send(err);
        }
            res.render("/parent//add-parent", {studentParent: result});
    });
});

app.post('/insertParent', (req, res, next) => {
    con.query("INSERT INTO parent (studentName, fatherName, motherName, fatherMobile, motherMobile, address, notes) VALUES('"+req.body.sname+"','"+req.body.fname+"', '"+req.body.mname+"', '"+req.body.fmobile+"', '"+req.body.mmobile+"', '"+req.body.address+"', '"+req.body.note+"')", (err, result) => {
        if(err)
        {
            res.send(err);
        }
            res.redirect('parent/parentList');
    });
});


app.listen(port, (req, res) => {
    console.log("Your application is running on port", port);
});