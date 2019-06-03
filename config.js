const mysql = require('mysql');

const con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "sms",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

con.connect((err) => {
    if(err)
    {
        console.log(err);
    }
        console.log("Connected");
});

module.exports = con;