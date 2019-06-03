const express = require('express');
const app = express();
const port = process.env.PORT || 9090;
const path = require('path');
const bodyParser = require('body-parser');
const con = require('./config');
const session = require('express-session');

app.use(session({
    secret: 'ali',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.set('views', __dirname + '/view');
app.set("view engine", "ejs");
app.set('/views', '/view');



app.get('/', (req, res) =>{
    res.render("login/login-add")
});

app.post('/addData', (req, res) => {
    con.query("INSERT INTO login (email, password, confirm_password) VALUES('"+req.body.email+"', '"+req.body.password+"', '"+req.body.confirmPassword+"')", (err, result) => {
        if(err){
            res.send(err);
            return;
        }
            res.send("Data Added Successfully");
    });
});

app.get('/addData', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;
    if(email && password) {
    con.query("SELECT * FROM login WHERE email = ? AND password = ? ", [email, password], (err, result) => {
        if(result.length > 0) {
            req.session.loggedin = true;
            req.session.email = email;
            res.redirect("student/student-add");
        } else {
            res.send("Incorrent Email address");
        }
            res.end();
    });
        res.send("pleaes enter your email and password");
        res.end();
    }
});


app.listen(port, (req, res) => {
    console.log("your port is", port);
})