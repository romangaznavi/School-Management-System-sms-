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
        let countAllTeachers = await countTeachers(req);
        let pages = req.query.page || 1;
        let offset = (recPerPage*pages)-recPerPage;
        let allTeachers = await allTeacherList(offset, req);
        let totalPages = Math.ceil(countAllTeachers/recPerPage);
        res.render("teacher/teacher-list", {teacherListData: allTeachers, pages, totalPages, countAllTeachers});
    } catch (error) {
        console.log(error);
    }
}
function allTeacherList(offset, formData){
    let condition = "1";
    let fullName = formData.query.name;
    let className = formData.query.className;
    let joiningDate = formData.query.JoiningDate;
    
    if(fullName) {
        condition += ` AND fullName LIKE "%${fullName}%"`;
    }
    if(className) {
        condition += ` AND className LIKE "%${className}%"`;
    }
    if(joiningDate) {
        condition += ` AND JoiningDate LIKE "%${joiningDate}%"`;
    }
    
    return new Promise((resolve, reject) =>{
        let teachQuery = `SELECT 
                        t.id,
                        t.fullName,
                        c.className,
                        t.dob,
                        t.gender,
                        t.joiningDate
                    FROM teacher AS t
                    LEFT JOIN class AS c ON c.id = t.classId 
                    WHERE ${condition}
                    LIMIT ${recPerPage} OFFSET ${offset}`;
        console.log("====================>");
        console.log(teachQuery);
          
        con.query(teachQuery, (err, result) => {
                    if(err){
                        reject(err);
                    }
                    resolve(result);    
                });
    });
}
function countTeachers(formData){
    let condition = "1";
    let fullName = formData.query.name;
    let className = formData.query.className;
    let joiningDate = formData.query.JoiningDate;

    if(fullName) {
        condition += ` AND fullName LIKE "%${fullName}%"`;
    }
    if(className) {
        condition += ` AND className LIKE "%${className}%"`;
    }
    if(joiningDate) {
        condition += ` AND JoiningDate LIKE "%${joiningDate}%"`;
    }
    return new Promise((resolve, reject) => {

        let teacherQuery = `SELECT COUNT(*) AS totalTeachers 
                            FROM teacher AS t
                            LEFT JOIN class AS c ON c.id = t.classId
                            WHERE ${condition}`;

        console.log("==================>");
        console.log(teacherQuery);

        con.query(teacherQuery, (err, result) => {
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