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

// Student add function using (async await)
app.get('/add', async(req, res) => {
    try {
        let classes = await getClasses();
        res.render("student/add-student", {classesResult: classes});
    } catch (error) {
        res.send(error);
    }
    
});

// Add Function using "callback"
// app.get('/add', (req, res) => {
//     con.query("SELECT * FROM class", (err, result) => {
//         if(err){
//             res.send(err);
//         }
//         res.render("student/add-student", {classesResult: result});
//     });
// });
app.post('/insertStudent', async(req, res) =>{
    let students = await insertStudent(req.body);
    try {
        res.redirect('/');
    } catch (error) {
        res.send(err);
    }
})

// add student using async await
function insertStudent(data){
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO student(name, classId, gender, fatherName, motherName, fatherMobile, motherMobile, address, note) VALUES('"+data.sname+"', '"+data.classId+"', '"+data.gender+"', '"+data.fname+"', '"+data.mname+"', '"+data.fphone+"', '"+data.mphone+"', '"+data.address+"', '"+data.note+"')", (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

// add student using callback
// app.post('/insertStudent', (req, res) => {
//     con.query("INSERT INTO student(name, classId, gender, fatherName, motherName, fatherMobile, motherMobile, address, note) VALUES('"+req.body.sname+"', '"+req.body.classId+"', '"+req.body.gender+"', '"+req.body.fname+"', '"+req.body.mname+"', '"+req.body.fphone+"', '"+req.body.mphone+"', '"+req.body.address+"', '"+req.body.note+"')", (err, result) => {
//         if(err){
//             res.send(err);
//         }
//         res.redirect('/');
//     });
// });

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
app.get('/editStudent/:id', (req, res) => {
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
            WHERE s.id= ? `, req.params.id, (err, result) => {
            if(err){
                res.send(err);
            }
                res.render("student/edit-student", {studentData: result});
        });
});

// Update POST
// app.post('/editStudent/:id', (req, res) => {
    
//     con.query(`UPDATE student
//                 SET
//                     name=           '${req.body.name}',
//                     classId=        '${req.body.classN}',
//                     gender=         '${req.body.gender}',
//                     fatherName=     '${req.body.fatherName}',
//                     motherName=     '${req.body.motherName}'
//                 WHERE id =          '${req.params.id}'`, (err, result) => {
//                     if(err){
//                         res.send(err);
//                     }
//                         res.render("student/student-list");
//                 });
// });

// Student Update
app.post('/updateStudent/:id', async(req, res) => {
    let students = await updateStudent(req.body, req.params);
    try {
        res.redirect('/');
} catch (error) {
    res.send(error); 
}
});

function updateStudent(data, value){
    return new Promise((resolve, reject) => {
        con.query(`UPDATE student
                SET
                    name=           '${data.name}',
                    classId=        '${data.classN}',
                    gender=         '${data.gender}',
                    fatherName=     '${data.fname}',
                    motherName=     '${data.mname}',
                    fatherMobile=   ${data.fmobile},
                    motherMobile=   ${data.mmobile},
                    address=        '${data.address}',
                    note=           '${data.notes}'
                WHERE id =          ${value.id}`, (err, result) => {
                    if(err){
                        reject(err);
                    }
                    resolve(result);
                });   
    });
}

// Delete Student

app.get('/deleteStudent/:id', (req, res) =>{
    con.query("DELETE FROM student WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/");
    });
});

// ====================== Teacher Data ==========================//

function getClassData(){
    return new Promise((resolve, reject) =>{
        con.query("SELECT * FROM class", (err, data) => {
            if(err){
                reject(err);
            }
                resolve(data);
        });
    });
}

app.get('/addClass', async (req, res) =>{
    try {
        let classes = await getClassData();
        res.render("teacher/teacher-add", {classResult: classes});
    } catch (error) {
        res.send(error);
    }
});

app.post('/addTeacherData', async(req, res) => {
    try {
        let teachers = await addTeacherData(req.body);
        res.redirect("teacherList");
    } catch (error) {
        res.send(error);
    }
});

function addTeacherData(data){
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO teacher (fullName, classId, dob, gender, joiningDate) VALUES('"+data.fname+"', '"+data.classId+"', "+data.dob+", '"+data.gender+"', "+data.jdate+")", (err, result) => {
            if(err)
            {
                reject(err);
            }
                resolve(result);
        });
    });
}

// LIST TEACHER
app.get('/teacherList', (req, res) => {
    con.query(`SELECT 
                t.id,
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

// Update Get
app.get('/teacherEdit/:id', (req, res) =>{
    con.query(`SELECT 
                    t.id,
                    t.fullName,
                    c.className,
                    t.dob,
                    t.gender,
                    t.joiningDate
                FROM teacher AS t
                LEFT JOIN class AS c ON c.id=t.classId
                WHERE t.id = ? `, req.params.id, (err, result) => {
                    if(err){
                        res.send(err);
                    }
                    res.render("teacher/teacher-edit", {teacherEditResult: result});
                });
});

function editTeacher(){
    return new Promise((resolve, reject) => {
        con.query(`UPDATE teacher
                    SET

                        `)
    });
}

// View Teacher
app.get('/viewTeacher/:id', (req, res) => {
    con.query(`SELECT 
                    t.id,
                    t.fullName, 
                    c.className,
                    t.dob,
                    t.gender,
                    t.joiningDate
                FROM teacher AS t
                LEFT JOIN class AS c ON c.id=t.classId
                WHERE t.id = ?`, req.params.id, (err, result)=>{
                    if(err){
                        res.send(err);
                    }
                    res.render("teacher/teacher-view", {viewTeacherdata: result});
        });
});

// Delete Teacher
app.get('/deleteTeacher/:id', (req, res) => {
    con.query("DELETE FROM teacher WHERE id = ? ", req.params.id, (err, result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/teacherList");
    });
});

// ========================= Subject ============================//
// Add using async await

app.post('/subjectAdd', async(req, res) => {
    let subjects = await insertSubject(req.body);
    try {
        res.redirect("subjectList");
    } catch (error) {
        res.send(error);
    }
});


function insertSubject(data){
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO subject (subjectName, teacherId, subjectTeachingDay, startTime, endTime) VALUES('"+data.sname+"','"+data.teacherId+"', '"+data.tDay+"', '"+data.stime+"', '"+data.etime+"')", (err, result) => {
            if(err)
            {
                reject(err);
            }
                resolve(result);
        });
    });
}

// Get teacher Data
app.get('/teacherAdd', async(req, res) => {
    try {
        let teachers = await getTeacherData();
        res.render("subject/add-subject", {teachersResult: teachers});
    } catch (error) {
        res.send(error);
    }
});

function getTeacherData(){
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM teacher", (err, result) =>{
            if(err){
                reject(err);
            }
            resolve(result);
        });
    });
}

// LIST SUBJECT
app.get('/subjectList', (req, res) => {
    con.query(`SELECT 
                s.id,
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

// Update
app.get('/getSubjectData/:id', (req, res) => {
    con.query(`SELECT 
                    s.id,
                    s.subjectName,
                    t.fullName,
                    s.subjectTeachingDay,
                    s.startTime,
                    s.endTime
                FROM subject AS s
                LEFT JOIN teacher AS t ON t.id=s.teacherId
                WHERE s.id = ?`, req.params.id, (err, result) => {
                    if(err){
                        res.send(err);
                    }
                    res.render("subject/edit-subject", {subjectEditResult: result});
                });
});

app.post('/updateSubject/:id', async(req, res) => {
    try {
        let subjects = await updateSubject(req.body, req.params);
        res.redirect("subjectList");
    } catch (error) {
        res.send(error);
    }
});

function updateSubject(data, value) {
    return new Promise((resolve, reject) => {
        con.query(`UPDATE subject
                    SET
                        subjectName =           '${data.sname}',
                        teacherId=              ${data.teacherName},
                        subjectTeachingDay=     '${data.tDay}',
                        startTime=              ${data.sTime},
                        endTime=                ${data.eTime}
                    WHERE id =                  ${value.id}`, (err, subjectData) => {
                        if(err){
                            reject(err);
                        }
                        resolve(subjectData);
                    });
    });
}

app.get('/subjectView/:id', (req, res) => {
    con.query(`SELECT 
                s.id,
                s.subjectName,
                t.fullName,
                s.subjectTeachingDay,
                s.startTime,
                s.endTime
            FROM subject AS s
            LEFT JOIN teacher AS t ON t.id=s.teacherId
            WHERE s.id = ?`, req.params.id, (err, result) =>{
        if(err){
            res.send(err);
        }
        res.render("subject/subject-view", {subjectViewResult: result});
    });
});

// Delete Subject 
app.get('/deleteSubject/:id', (req, res) => {
    con.query("DELETE FROM subject WHERE id= ?", req.params.id, (err, result) =>{
        if(err){
            res.send(err);
        }
        res.redirect("/subjectList");
    })
});


// ======================== Assignment ==========================//

// ADD ASSIGNMENT using callback
// app.get('/asAdd', (req, res) => {
//     con.query("SELECT * FROM student", (err, result) => {
//         if(err){
//             res.send(err);
//         }
//         con.query("SELECT * FROM subject", (err, result1) => {
//             if(err){
//                 res.send(err);
//             }
//             con.query("SELECT * FROM teacher", (err, result3) => {
//                 if(err){
//                     res.send(err);
//                 }
//                     res.render("assignment/add-assignment", { studentResult: result, subjectResult: result1, teacherResult: result3 });
//             });
//         });
//     });
// });

// ADD ASSIGNMENT
app.post('/addAssignment', (req, res) => {
    con.query("INSERT INTO assignment (studentId, assignmentSubject, assignmentTeacher, completed, incomplete, notes) VALUES('"+req.body.sname+"', '"+req.body.asSubject+"', '"+req.body.asTeacher+"', '"+req.body.completed+"', '"+req.body.incomplete+"', '"+req.body.notes+"')", (err, data) => {
        if(err){
            res.send(err);
        }
            res.redirect("assignmentList");
    });
});

// Add Using async await 
function getStudent() {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM student", (err, student) => {
            if(err){
                reject(err);
            }
            resolve(student);
        });
    });
}

function getSubject() {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM subject", (err, subject) => {
            if(err){
                reject(err);
            }
            resolve(subject);
        });
    });
}

function getTeacher() {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM teacher", (err, teacher) => {
            if(err){
                reject(err);
            }
            resolve(teacher);
        });
    });
}

app.get('/assignmentAdd', async(req, res) => {
    try {
        let students = await getStudent();
        let subjects = await getSubject();
        let teachers = await getTeacher();
        
        res.render("assignment/add-assignment", {studentResult: students, subjectResult: subjects, teacherResult: teachers});
    } catch (error) {
        res.send(error);
    }
});
// LIST ASSIGNMENT

app.get('/assignmentList', (req, res) => {
    con.query(`SELECT 
                s.id,
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
// Edit Show data
app.get('/showAssignment/:id', (req, res) => {
    con.query(`SELECT 
                    a.id,
                    s.name,
                    sub.subjectName,
                    t.fullName,
                    a.completed,
                    a.incomplete,
                    a.notes
                    FROM assignment as a
                    LEFT JOIN student AS s ON s.id = a.studentId
                    LEFT JOIN subject AS sub ON sub.id = a.assignmentSubject
                    LEFT JOIN teacher AS t ON t.id = a.assignmentTeacher
                    WHERE a.id = ?`, req.params.id, (err, result) => {
                        if(err){
                            res.send(err);
                        }
                        res.render("assignment/edit-assignment", {assignmentResult: result});
                    });
});
// Update Post

function updateAssignment(data, value){
    return new Promise(function(resolve, reject) {
        con.query(`UPDATE assignment
                    SET
                        studentId =             ${data.sId},
                        assignmentSubject =     ${data.assignmentSubject},
                        assignmentTeacher =     ${data.assignmentListTeach},,
                        completed =             '${data.completed}',
                        incomplete =            '${data.incomplete}',
                        notes =                 '${data.notes}'
                    WHERE id = ? `, value.id, (err, result) => {
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
    });
}

app.post('/updateAssignment/:id', async(req, res) => {
    try {
        let assignments = updateAssignment(req.body, req.params);
        res.redirect("/assignmentList");
    } catch (error) {
        res.send(error);
    }
});

app.get('/assignmentView/:id', (req, res) => {
    con.query(`SELECT 
                a.id,
                s.name,
                sub.subjectName,
                t.fullName,
                a.completed,
                a.incomplete,
                a.notes
            FROM assignment AS a
            LEFT JOIN student AS s ON s.id = a.studentId
            LEFT JOIN subject AS sub ON sub.id = a.assignmentSubject
            LEFT JOIN teacher AS t ON t.id = a.assignmentTeacher
            WHERE a.id = ? `, req.params.id, (err, result) =>{
                if(err){
                    res.send(err);
                }
                res.render("assignment/view-assignment", {viewAssignmentData: result}); 
            })
})

// Delete Assignment

app.get('/deleteAssignment/:id', (req, res) =>{
    con.query("DELETE FROM assignment WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/assignmentList");
    });
});
// =========================== CLASS ===========================
// Add Class Info for Dropdowns
app.get('/classInfo', async(req, res) => {
    try {
        let teachers  = await getTeacherData();
        let subjects = await getSubjectData();
        res.render("class/add-class", {teachersResult: teachers, subjectsResult: subjects});
    } catch (error) {
        res.send(error);
    }
})

function getTeacherData(){
    return new Promise(function(resolve, reject) {
        con.query("SELECT * FROM teacher", (err, teacher) =>{
            if(err){
                reject(err);
            }
            resolve(teacher);
        });
    });
}

function getSubjectData(){
    return new Promise((resolve, reject) =>{
        con.query("SELECT * FROM subject", (err, subject) =>{
            if(err){
                reject(err);
            }
            resolve(subject);
        });
    }); 
}

// Class POST Data
app.post('/addClass', async(req, res) => {
    let classes = await addClass(req.body);
    try {
        res.redirect("/listClas");
    } catch (error) {
        res.send(error);
    }
});

function addClass(data){
    return new Promise((resolve, reject) =>{
        con.query("INSERT INTO class (className, teacherId, subjectId) VALUES('"+data.className+"', '"+data.teacherName+"', '"+data.subjectName+"')", (err, result) => {
            if(err){
                reject(err);
            }
                resolve(result);
        });
    });
}

// LIST CLASS
app.get('/listClas', (req, res) => {
    con.query(`SELECT 
                    c.id,
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
                });
});

// Edit Class
app.get('/editClass/:id', (req, res) => {
    con.query(`SELECT 
                c.id,
                c.className,
                t.fullName,
                s.subjectName
            FROM class AS c
            LEFT JOIN teacher AS t ON t.id = c.teacherId
            LEFT JOIN subject AS s ON s.id = c.subjectId 
            WHERE c.id = ?`, req.params.id, (err, result) => {
        if(err){
            res.send(err);
        }
        res.render("class/edit-class", {classInfoResult: result});
    });
});

// POST UPDATE CLASS
app.post('/updateClass/:id', async(req, res) => {
    let classes = await updateClass(req.body, req.params);
    try {
        res.redirect("/listClas");
    } catch (error) {
        res.send(error);
    }
});

function updateClass(data, value){
    return new Promise((resolve, reject) => {
    con.query(`UPDATE class
                SET
                    className = '${data.className}',
                    teacherId = '${data.teacherName}',
                    subjectId = '${data.subjectName}'
                WHERE id = ?`, value.id, (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result);
            });
    });
}

// VIEW CLASS
app.get('/viewClass/:id', (req, res) => {
    con.query(`SELECT 
                c.id,
                c.className,
                t.fullName,
                s.subjectName
            FROM class AS c
            LEFT JOIN teacher AS t ON t.id = c.teacherId
            LEFT JOIN subject AS s ON s.id = c.subjectId
            WHERE c.id = ?`, req.params.id, (err, result) => {
                if(err){
                    res.send(err);
                }
                res.render("class/view-class", {classViewData: result});
            });
});

// Delete Class

app.get('/deleteClass/:id', (req, res) =>{
    con.query("DELETE FROM class WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/listClas");
    });
});

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
            res.redirect("/stafflist");
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
                mobile= ${req.body.mobile},
                address= '${req.body.address}',
                joiningDate= '${req.body.jdate}',
                salary= ${req.body.salary}
                WHERE id= '${req.params.id}'`, function(err, result){
                    if(err){
                        res.send(err);
                    }
                        res.redirect("/stafflist");
                });
});

// Staff View
app.get('/staffView/:id', (req, res) => {
    con.query("SELECT * FROM staff WHERE id = ?", req.params.id, (err, result) =>{
        if(err){
            res.send(err);
        }
        res.render("staff/view-staff", {viewStaffData: result});
    });
});

// Delete Staff
app.get('/deleteStaff/:id', (req, res) => {
    con.query("DELETE FROM staff WHERE id = ? ", req.params.id,(err, result) =>{
        if(err){
            res.send(err);
        }
        res.redirect("/stafflist");
    });
});
app.listen(port, (req, res) => {
    console.log("Your application is running on port", port);

});