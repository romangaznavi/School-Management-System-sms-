const express = require('express');
const app = express();
const port = process.env.PORT || 9090;
const path = require('path');
const Joi = require('joi');
const bodyParser = require('body-parser');
const con = require('./config');
const recPerPage = 3;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('views', __dirname + '/view');
app.set("view engine", "ejs");
app.set('/views', '/view');

require("./model/student/student.route")(app, recPerPage);
require("./model/subject/subject.route")(app, recPerPage);
require("./model/assignment/assignment.route")(app);
require("./model/teacher/teacher.route")(app);
require("./model/class/class.rout")(app);

app.listen(port, (req, res) => {
    console.log("Your application is running on port", port);

});