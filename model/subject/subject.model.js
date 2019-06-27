const recPerPage = 3;
const con = require("../../config");
const week = ["Saturday", "Sunday","Monday", "Tuesday", "Wednesday", "Thursday","Friday"];

module.exports.addSubject = async(req, res) => {
    try {
        let subjects = await insertSubject(req.body);
        res.redirect("subjectList");
    } catch (error) {
        // req.validationErrors(true);
        res.send(error);
    }
}
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

module.exports.getTeacher = async(req, res) => {
    try {
        let teachers = await getTeacherData();
        res.render("subject/add-subject", {teachersResult: teachers});
    } catch (error) {
        res.send(error);
    }
}
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

module.exports.subjectList = async (req, res) => {
    try {
        // if query param with id "page" does not exist in URL then set it as "1" 
        let page= req.query.page || 1;
        let countSubject = await countAllStudent();
        let offset = (recPerPage*page)-recPerPage;
        let subjects = await getSubjects(offset);
        let totalPage = Math.ceil(countSubject/recPerPage);
        res.render("subject/list-subject", {subListData: subjects, totalPage, countSubject, page});    
    } catch (error) {
        res.send(error);
    }
}
function getSubjects(offset) {
    return new Promise((resolve, reject) => {
            con.query(`SELECT 
            s.id,
            s.subjectName,
            t.fullName,
            s.subjectTeachingDay,
            s.startTime,
            s.endTime
        FROM subject AS s
        LEFT JOIN teacher AS t ON t.id = s.teacherId LIMIT ${recPerPage} OFFSET ${offset}`, (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result);
        });
    });
}
function countAllStudent() {
    return new Promise((resolve, reject) => {
        // in count[0].total, total came from the below query alias
        con.query("SELECT COUNT(*) as total FROM subject",(err, count) =>{
            if (err) {
                reject(err);
            }
            resolve(count[0].total)
        });
    });
}

module.exports.updateSubject = async(req, res) => {
    const teachers =  await getTeachers();
    const subjects = await getSubjectById(req.params.id);
    // res.send(subjects[1]);
    // return;
    res.render("subject/edit-subject", {teachersData: teachers, subjectsData: subjects[0],weekDays:week});
}
function getTeachers(){
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM teacher", (err, result) =>{
            if(err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

function getSubjectById(subjectId){
    // console.log(subjectId,'------>subjectId');
    return new Promise((resolve, reject) => {
    con.query(`SELECT 
                s.id,
                s.subjectName,
                s.teacherId,
                t.fullName,
                s.subjectTeachingDay,
                s.startTime,
                s.endTime
            FROM subject AS s
            LEFT JOIN teacher AS t ON t.id=s.teacherId
            WHERE s.id = ${subjectId}`, (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        });
}

module.exports.subjectUpdate = async(req, res) => {
    try {
        let subjects = await updateSubject(req.body, req.params);
        res.redirect("/subjectList");
    } catch (error) {
        res.send(error);
    }
}
function updateSubject(data, value) {
    return new Promise((resolve, reject) => {
        con.query(`UPDATE subject
                    SET
                        subjectName =           '${data.sname}',
                        teacherId=              ${data.teacherName},
                        subjectTeachingDay=     '${data.tDay}',
                        startTime=              '${data.sTime}',
                        endTime=                '${data.eTime}'
                    WHERE id =                  ${value.id}`, (err, subjectData) => {
                        if(err){
                            reject(err);
                        }
                        resolve(subjectData);
                    });
    });
}

module.exports.subjectById = (req, res) => {
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
}