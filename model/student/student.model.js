'use strict' 
const recPerPage = 3;
const con = require("../../config");
module.exports.list = async function (req, res, next) {
    let page = req.query.page || 1;
    let offset = (recPerPage*page) - recPerPage;
    let totalStudent = await countStudent(req);
    let totalPage = Math.ceil(totalStudent/recPerPage);
    let students = await getAllStudents(offset, req);
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
    });
}

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

function countStudent(formData){

    let name= formData.query.name;
    let className = formData.query.className;
    let father = formData.query.fname;
    let mother = formData.query.mname;

    let condition = "1"; /* if I dont define as "1", i
                          *t will take "undefine" as default value which will show error in MYSQL
                          */  
    if (name) {
        condition += ` AND name LIKE "%${name}%"`;
    }
    if(className){
        condition += ` AND className LIKE "%${className}%"`;
    }
    if(father){
        condition += ` AND fatherName LIKE "%${father}%"`;
    }
    if(mother) {
        condition += ` AND motherName LIKE "%${mother}%"`;
    }


    return new Promise ((resolve, reject) =>{
        let qu = `SELECT COUNT(*) AS totalStudent
        FROM student AS s
        LEFT JOIN class AS c ON c.id = s.classId
        WHERE ${condition}`;
        console.log(qu);
        con.query(qu, (err, result) =>{
            if(err){
                reject(err);
            }
            // totalStudent came from query alias
            if (result == 0) {
                resolve(result);
            } else {
                resolve(result[0].totalStudent);
            }
        });
    });
}

function getAllStudents(offsetData, formData){
    let name= formData.query.name;
    let className = formData.query.className;
    let father = formData.query.fname;
    let mother = formData.query.mname;
    let condition = "1"; /* if I dont define as "1", i
                          *t will take "undefine" as default value which will show error in MYSQL
                          */  
    if (name) {
        condition += ` AND name LIKE "%${name}%"`;
    }
    if(className) {
        condition += ` AND className LIKE "%${className}%"`;
    }
    if(father){
        condition += ` AND fatherName LIKE "%${father}%"`;
    }
    if(mother){
        condition += ` AND motherName LIKE "%${mother}%"`;
    }
    return new Promise((resolve, reject) => {
    let qu = `SELECT 
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
            WHERE ${condition}
            LIMIT ${recPerPage} OFFSET ${offsetData} `;
    console.log("===========================>");
    console.log(qu);
    con.query(qu, (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result);
        });
    })
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

// For pagination use


module.exports.viewStudentById = (req, res) => {
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

module.exports.editStudent = async (req, res) => {
    try {
        let studentsEditData = await editStudentById(req.params.id);
        let classes = await getClasses();
        res.render("student/edit-student", {studentData: studentsEditData[0], classResult: classes});
    } catch (error) {
        res.send(err);
    }
}

function editStudentById(reqParamsId){
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
            LEFT JOIN class AS c ON c.id = s.classId
            WHERE s.id= ? `, reqParamsId, (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result);
        });
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