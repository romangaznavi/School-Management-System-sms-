'use strict'
const recPerPage = 3;
const con = require("../../config");
module.exports.list = async function (req, res, next) {
    let page = req.query.page || 1;
    let offset = (recPerPage*page) - recPerPage;
    let totalStudent = await countStudent();
    let totalPage = Math.ceil(totalStudent/recPerPage);
    // console.log(totalPage);return;
    let students = await getAllStudents(offset);
    res.render("student/student-list", {totalPageData: totalPage, totalStudent, students});
}

// student add form view
module.exports.add = async(req, res) => {
    try {
        let classes = await getClasses();
        res.render("student/add-student", {classesResult: classes});
    } catch (error) {
        res.send(error);
    }
    
}

// Post student
module.exports.addStudent = async(req, res) =>{
    let students = await insertStudent(req.body);
    try {
        res.redirect('/');
    } catch (error) {
        res.send(err);
    }
}

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


// Update Student

module.exports.studentUpdate = async(req, res) => {
    let students = await updateStudent(req.body, req.params);
    try {
        res.redirect('/');
    } catch (error) {
    res.send(error); 
    }
}
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

function getAllStudents(offsetData){
    return new Promise((resolve, reject) => {
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
                LEFT JOIN class AS c ON c.id = s.classId LIMIT ${recPerPage} OFFSET ${offsetData} `, (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result);
        });
    })
}

// For pagination use
function countStudent(){
    return new Promise ((resolve, reject) =>{
        con.query("SELECT COUNT(*) AS totalStudent FROM student", (err, result) =>{
            if(err){
                reject(err);
            }
            // totalStudent came from query alias
            resolve(result[0].totalStudent);
        });
    });
}


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

module.exports.getStudentById = (req, res) => {
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
}

module.exports.editStudent = (req, res) => {
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
}

module.exports.deleteStudent = (req, res) =>{
    con.query("DELETE FROM student WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/");
    });
}

module.exports.studentList = async function (req, res, next) {
    let page = req.query.page || 1;
    let offset = (recPerPage*page) - recPerPage;
    let totalStudent = await countStudent();
    let totalPage = Math.ceil(totalStudent/recPerPage);
    // console.log(totalPage);return;
    let students = await getAllStudents(offset);
    res.render("student/student-list", {totalPageData: totalPage, totalStudent, students});
}

function getAllStudents(offsetData){
    return new Promise((resolve, reject) => {
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
                LEFT JOIN class AS c ON c.id = s.classId LIMIT ${recPerPage} OFFSET ${offsetData} `, (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result);
        });
    })
}

// For pagination use
function countStudent(){
    return new Promise ((resolve, reject) =>{
        con.query("SELECT COUNT(*) AS totalStudent FROM student", (err, result) =>{
            if(err){
                reject(err);
            }
            // totalStudent came from query alias
            resolve(result[0].totalStudent);
        });
    });
}