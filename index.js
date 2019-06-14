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

// ====================== Student Data ========================//
// Student List
app.get('/', function(req, res, next) {
    con.query(`SELECT 
                    s.id,
                    s.name, 
                    c.className,
                    s.gender,
                    s.fatherName,
                    s.motherName,
                    s.fatherMobile,
                    s.motherMobile,
                    s.address,
                    s.note
                FROM student AS s
                LEFT JOIN class AS c ON c.id = s.classId`, (err, result) => {
                if(err){
                    res.send(err);
                }
                    res.render("student/student-list", {studentList: result});
        });
});

function getClasses()
{
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM class", (err, result) => {
            if(err)
            {
                reject(err);
            }
            resolve(result);
        });
    });
}

// Student add
app.get('/add', async(req, res) => {
    let classes = await getClasses();
    res.render("student/add-student", {classesResult: classes});
});

// add student
app.post('/insertStudent', (req, res) => {
    con.query("INSERT INTO student(name, classId, gender, fatherName, motherName, fatherMobile, motherMobile, address, note) VALUES('"+req.body.sname+"', '"+req.body.classId+"', '"+req.body.gender+"', '"+req.body.fname+"', '"+req.body.mname+"', '"+req.body.fphone+"', '"+req.body.mphone+"', '"+req.body.address+"', '"+req.body.note+"')", (err, result) => {
        if(err){
            res.send(err);
        }
        res.redirect('/');
    });
});

// Student View
app.get('/studentView/:id', (req, res) => {
    con.query(`SELECT 
                s.id,
                s.name, 
                c.className,
                s.gender,
                s.fatherName,
                s.motherName,
                s.fatherMobile,
                s.motherMobile,
                s.address,
                s.note
            FROM student AS s
            LEFT JOIN class AS c ON c.id = s.classId
            WHERE s.id=4`, (err, result) => {
                if(err){
                    res.send(err);
                }
                res.render("student/view-student", {studentViewData: result});
            });
});



// Update
app.get('/editS/:id', (req, res) => {
    con.query(`SELECT 
                s.id,
                s.name,
                s.gender,


            FROM student AS s
            LEFT JOIN parent AS p ON p.id=s.fatherName
            LEFT JOIN parent AS pp ON pp.id=s.motherName
            WHERE s.id = ? `, req.params.id, (err, result) => {
            if(err){
                res.send(err);
            }
                res.render("student/edit-student", {studentData: result});
        });
});

// Update POST
app.post('/editStudent/:id', (req, res) => {
    
    con.query(`UPDATE student
                SET
                    name=           '${req.body.name}',
                    classId=        '${req.body.className}',
                    gender=         '${req.body.gender}',
                    fatherName=     '${req.body.fatherName}',
                    motherName=     '${req.body.motherName}'
                WHERE id =          '${req.params.id}'`, (err, result) => {
                    if(err){
                        res.send(err);
                    }
                        res.render("student/student-list");
                });
});

// ====================== Teacher Data ==========================//

app.get('/addClass', function(req, res) {
    con.query("SELECT * FROM class", (err, data) => {
        if(err){
            res.send(err);
        }
            res.render("teacher/teacher-add", {classData: data});
    });
});

app.post('/addTeacherData', (req, res, next) => {
    con.query("INSERT INTO teacher (fullName, classId, dob, gender, joiningDate) VALUES('"+req.body.fname+"', '"+req.body.classId+"', '"+req.body.dob+"', '"+req.body.gender+"', '"+req.body.jdate+"')", (err, result) => {
        if(err)
        {
            res.send(err);
        }
            res.redirect("Teacher Added Successfully");
    });
});

// LIST TEACHER
app.get('/teacherList', (req, res) => {
    con.query(`SELECT 
                t.fullName,
                c.className,
                t.dob,
                t.gender,
                t.joiningDate
                FROM teacher AS t
                LEFT JOIN class AS c ON c.id = t.classId`, (err, result) => {
                    if(err){
                        res.send(err);
                    }
                        res.render("teacher/teacher-list", {teacherListData: result});
                });
});

// ========================= Subject ============================//
// ADD SUBJECT
app.get('/addSubject', function(req, res) {
    con.query("SELECT * FROM teacher", (err, data) => {
        if(err){
            res.send(err);
        }
            res.render("subject/add-subject", { sData: data });
    });
});

app.post('/insertSubject', (req, res, next) => {
    con.query("INSERT INTO subject (subjectName, teacherId, subjectTeachingDay, startTime, endTime) VALUES('"+req.body.sname+"','"+req.body.teacherId+"', '"+req.body.subjectTeachingDay+"', '"+req.body.stime+"', '"+req.body.etime+"')", (err, result) => {
        if(err)
        {
            res.send(err);
        }
            res.redirect("Teacher Added Successfully");
    });
});

// LIST SUBJECT
app.get('/subjectList', (req, res) => {
    con.query(`SELECT 
                s.subjectName,
                t.fullName,
                s.subjectTeachingDay,
                s.startTime,
                s.endTime
            FROM subject AS s
            LEFT JOIN teacher AS t ON t.id = s.teacherId`, (err, result) => {
                if(err){
                    res.send(err);
                }
                    res.render("subject/list-subject", {subListData: result});
            });
});

// ======================== Assignment ==========================//

// ADD ASSIGNMENT
app.get('/asAdd', (req, res) => {
    con.query("SELECT * FROM student", (err, result) => {
        if(err){
            res.send(err);
        }
        con.query("SELECT * FROM subject", (err, result1) => {
            if(err){
                res.send(err);
            }
            con.query("SELECT * FROM teacher", (err, result3) => {
                if(err){
                    res.send(err);
                }
                    res.render("assignment/add-assignment", { studentResult: result, subjectResult: result1, teacherResult: result3 });
            });
        });
    });
});

// ADD ASSIGNMENT
app.post('/addAssignment', (req, res) => {
    con.query("INSERT INTO assignment (studentId, assignmentSubject, assignmentTeacher, completed, incomplete, notes) VALUES('"+req.body.sname+"', '"+req.body.asSubject+"', '"+req.body.asTeacher+"', '"+req.body.completed+"', '"+req.body.incomplete+"', '"+req.body.notes+"')", (err, data) => {
        if(err){
            res.send(err);
        }
            res.send("Data added");
    });
});

// LIST ASSIGNMENT

app.get('/asList', (req, res) => {
    con.query(`SELECT 
                s.name,
                sub.subjectName,
                t.fullName,
                a.completed,
                a.incomplete,
                a.notes
            FROM assignment AS a
            LEFT JOIN student AS s ON s.id=a.studentId
            LEFT JOIN subject AS sub ON sub.id=a.assignmentSubject
            LEFT JOIN teacher AS t ON t.id=a.assignmentTeacher`, function(err, result){
                if(err){
                    res.send(err);
                }
                    res.render("assignment/list-assignment", {assignData: result});
        });
});

// =========================== CLASS ===========================

app.get('/aaa', (req, res) => {  
    con.query("SELECT * FROM teacher", (err, teacherr) => {
        if(err){
            res.send(err);
        }
        con.query("SELECT * FROM subject", (err, subjectt) => {
            if(err){
                res.send(err);
            }
                res.render('class/add-class', {teacherData: teacherr, subjectData: subjectt });
        });
    });
});

// ADD CLASS
app.post('/addClass', (req, res) => {
    con.query("INSERT INTO class (className, teacherId, subjectId) VALUES('"+req.body.classNumber+"', '"+req.body.teach+"', '"+req.body.sub+"')", (err, data) => {
        if(err){
            res.send(err);
        }
            res.send("Data added");
    });
});

// LIST CLASS
app.get('/listClas', (req, res) => {
    con.query(`SELECT 
                    c.className,
                    t.fullName,
                    s.subjectName
                FROM class AS c
                LEFT JOIN teacher AS t ON t.id = c.teacherId
                LEFT JOIN subject AS s ON s.id = c.subjectId`, (err, result) => {
                    if(err){
                        res.send(err);
                    }
                        res.render("class/list-class", {classResult: result});
                })
})

// =========================== STAFF ===========================

app.get('/staffAdd', (req, res) => {  
    res.render("staff/add-staff");
});

// ADD CLASS
app.post('/insertStaff', (req, res) => {
    con.query("INSERT INTO staff (fullName, designation, mobile, address, joiningDate, salary) VALUES ('"+req.body.name+"', '"+req.body.designation+"', '"+req.body.mobile+"', '"+req.body.address+"', '"+req.body.jdate+"', '"+req.body.salary+"')", (err, data) => {
        if(err){
            res.send(err);
        }
            res.send("Data added");
    });
});

// LIST STAFF
app.get('/stafflist', (req, res) => {
    con.query("SELECT * FROM staff", (err, result) => {
        if(err){
            res.send(err);
        }
            res.render("staff/list-staff", {staffData: result});
    });
});

//  Update
app.get('/editStaff/:id', (req, res) => {
    con.query("SELECT * FROM staff WHERE id = ?", req.params.id, (err, result) => {
        if(err){
            res.send(err);
        }
            res.render("staff/edit-staff", {staffEdit: result});
    });
});

// Update POST
app.post('/updateStaff/:id', (req, res) => {
    con.query(`UPDATE staff
                SET
                fullName= '${req.body.fname}',
                designation= '${req.body.designation}',
                mobile= '${mobile}',
                address= '${address}',
                joiningDate= '${jdate}',
                salary= '${salary}'
                WHERE id= '${req.params.id}'`, function(err, result){
                    if(err){
                        res.send(err);
                    }
                        res.send("staff/list-staff");
                });
});

app.listen(port, (req, res) => {
    console.log("Your application is running on port", port);
});