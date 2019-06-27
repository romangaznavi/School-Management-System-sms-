const con = require("../../config");
const recPerPage = 3;

module.exports.addClass =  async (req, res) =>{
    try {
        let classes = await getClassData();
        res.render("teacher/teacher-add", {classResult: classes});
    } catch (error) {
        res.send(error);
    } 
}
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

module.exports.insertTeacher = async(req, res) => {
    try {
        let teachers = await addTeacherData(req.body);
        res.redirect("teacherList");
    } catch (error) {
        res.send(error);
    }
}
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

module.exports.listTeacher = async(req, res) => {
    try {
        let countAllTeachers = await countTeachers();
        let pages = req.query.page || 1;
        let offset = (recPerPage*pages)-recPerPage;
        let allTeachers = await allTeacherList(offset);
        let totalPages = Math.ceil(countAllTeachers/recPerPage);
        res.render("teacher/teacher-list", {teacherListData: allTeachers, pages, totalPages, countAllTeachers});
    } catch (error) {
        console.log(error);
    }
}
function allTeacherList(offset){
    return new Promise((resolve, reject) =>{
        con.query(`SELECT 
                t.id,
                t.fullName,
                c.className,
                t.dob,
                t.gender,
                t.joiningDate
                FROM teacher AS t
                LEFT JOIN class AS c ON c.id = t.classId LIMIT ${recPerPage} OFFSET ${offset}`, (err, result) => {
                    if(err){
                        reject(err);
                    }
                    resolve(result);    
                });
    });
}
function countTeachers(){
    return new Promise((resolve, reject) => {
        con.query("SELECT COUNT(*) AS totalTeachers FROM teacher", (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result[0].totalTeachers);
        });
    });
}

module.exports.editTeacherById = async(req, res) =>{
    try {
        let teacher = await getTeacherById(req.params);
        let allClass = await getAllClassData();
        res.render("teacher/teacher-edit", {allClassData: allClass, singleTeacher: teacher[0]});
    } catch (error) {
        res.send(error);
    }
}
function getTeacherById(classID){
    return new Promise((resolve, reject) => {
        con.query(`SELECT 
                t.id,
                t.fullName,
                c.className,
                t.dob,
                t.gender,
                t.joiningDate
            FROM teacher AS t
            LEFT JOIN class AS c ON c.id=t.classId
            WHERE t.id = ? `, classID.id, (err, result) => {
                if(err){
                    reject(err);
                }
                resolve(result);
            });
        });    
}

function getAllClassData(){
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM class", (err, result) => {
            if(err) {
                reject(err);
            }
            resolve(result);
        });
    });
}


function editTeacher(){
    return new Promise((resolve, reject) => {
        con.query(`UPDATE teacher
                    SET

                        `)
    });
}

module.exports.viewTeacherById = (req, res) => {
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
}

module.exports.deleteTeacherById = (req, res) => {
    con.query("DELETE FROM teacher WHERE id = ? ", req.params.id, (err, result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/teacherList");
    });
}