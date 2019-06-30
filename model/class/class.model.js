const con = require("../../config");
const classData = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"]; 
const recPerPage = 3;
 
module.exports.classData = async(req, res) => {
    try {
        let teachers  = await getTeacherData();
        let subjects = await getSubjectData();
        res.render("class/add-class", {teachersResult: teachers, subjectsResult: subjects});
    } catch (error) {
        res.send(error);
    }
}
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

module.exports.insertClassData = async(req, res) => {
    let classes = await addClass(req.body);
    try {
        res.redirect("/listClas");
    } catch (error) {
        res.send(error);
    }
}
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

module.exports.listClass = async(req, res) => {
    try {
        let page = req.query.page || 1;
        let offset = (recPerPage*page) - recPerPage
        let classListdata = await classList(offset, req);
        let classCount = await countClass(req);
        let totalPage = Math.ceil(classCount/recPerPage);
        res.render("class/list-class", {classResult: classListdata, totalPage, classCount});
    } catch (error) {
        console.log(error);
    }
}
function classList(offset, formData){

    let condition = "1";
    let className = formData.query.className;
    let teacherName = formData.query.teacher;

    if(className) {
        condition +=  ` AND className LIKE "%${className}%"`;
    }
    if(teacherName) {
        condition +=  ` AND fullName LIKE "%${teacherName}%"`;
    }

    return new Promise((resolve, reject) => {
        let classQuery = `SELECT 
                            c.id,
                            c.className,
                            t.fullName,
                            s.subjectName
                        FROM class AS c
                        LEFT JOIN teacher AS t ON t.id = c.teacherId
                        LEFT JOIN subject AS s ON s.id = c.subjectId
                        WHERE ${condition}
                        LIMIT ${recPerPage} OFFSET ${offset}`;
        console.log("=======================>");
        console.log(classQuery);                
        con.query(classQuery, (err, result) => {
                    if(err){
                        reject(err);
                    }
                    resolve(result);    
                });
    });
} 

function countClass(formData){
    let condition = "1"; 
    let className = formData.query.className;
    let teacherName = formData.query.teacher;

    if(className) {
        condition +=  ` AND className LIKE "%${className}%"`;
    }
    if(teacherName) {
        condition +=  ` AND fullName LIKE "%${teacherName}%"`;
    }

    return new Promise((resolve, reject) => {
        let classQuery = `SELECT COUNT (*) AS total 
                            FROM class AS c
                            LEFT JOIN teacher AS t ON t.id = c.teacherId
                            WHERE ${condition}`;
        console.log("=======================>");
        console.log(classQuery);    
        con.query(classQuery, (err,result) => {
            if(err){
                reject(err);
            }
            resolve(result[0].total);
        });
    });
}

module.exports.editClassById = async(req, res) => {
    try {
        let classEdit = await editClass(req.params);
        let teachers = await getTeacherData();
        let subjects = await getSubjectData();
        res.render("class/edit-class", {classInfoResult: classEdit[0], classData, teachers, subjects});
    } catch (error) {
        res.send(error); 
    }
}
function editClass(reqParams){
    return new Promise((resolve, reject) => {
        con.query(`SELECT 
                c.id,
                c.className,
                t.fullName,
                s.subjectName
            FROM class AS c
            LEFT JOIN teacher AS t ON t.id = c.teacherId
            LEFT JOIN subject AS s ON s.id = c.subjectId 
            WHERE c.id = ?`, reqParams.id, (err, result) => {
        if(err){
            reject(err);
        }
        resolve(result);
    });
    })
}

module.exports.updateClass = async(req, res) => {
    let classes = await updateClass(req.body, req.params);
    try {
        res.redirect("/listClas");
    } catch (error) {
        res.send(error);
    }
}
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

module.exports.viewClassById = (req, res) => {
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
}

module.exports.deleteClassById = (req, res) =>{
    con.query("DELETE FROM class WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/listClas");
    });
}
