const con = require("../../config");
const recPerPage = 3; 
 
module.exports.assignmentPost = async(req, res) => {
    try {
        let postAssignment = await assignmentPostData(req.body);
        res.redirect("assignmentList");
    } catch (error) {
        res.send(error);
    }
}
function assignmentPostData(reqBody){
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO assignment (studentId, assignmentSubject, assignmentTeacher, completed, incomplete, notes) VALUES('"+reqBody.sname+"', '"+reqBody.asSubject+"', '"+reqBody.asTeacher+"', '"+reqBody.completed+"', '"+reqBody.incomplete+"', '"+reqBody.notes+"')", (err, data) => {
            if(err){
                reject(err);
            }
            resolve(data);    
        });
    })
}

module.exports.assignmentAdd = async(req, res) => {
    try {
        let students = await getStudent();
        let subjects = await getSubject();
        let teachers = await getTeacher();
        
        res.render("assignment/add-assignment", {studentResult: students, subjectResult: subjects, teacherResult: teachers});
    } catch (error) {
        res.send(error);
    }
}
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

module.exports.assignmentList = async (req, res) => {
    try {
        let countAssignments = await countAllAssignment(req); 
        let pages = req.query.page || 1;
        let offset = (recPerPage*pages)-recPerPage;
        let totalPages = Math.ceil(countAssignments/recPerPage);
        let assignments = await ListAssignment(offset, req);
        res.render("assignment/list-assignment", {assignData: assignments, totalPages, pages});
    } catch (error) {
        console.log(error);
    }
}
function ListAssignment(offset, formData){
    let condition = "1";
    let studentName = formData.query.student;
    let subjectName = formData.query.subject;
    let teacherName = formData.query.teacher;

    if(studentName) {
        condition +=  ` AND name LIKE "%${studentName}%"`;
    }
    if(subjectName) {
        condition +=  ` AND subjectName LIKE "%${subjectName}%"`;
    }
    if(teacherName) {
        condition +=  ` AND fullName LIKE "%${teacherName}%"`;
    }
    return new Promise((resolve, reject) => {
        let assignmentQuery = `SELECT 
                                a.id,
                                s.name,
                                sub.subjectName,
                                t.fullName,
                                a.completed,
                                a.incomplete,
                                a.notes
                            FROM assignment AS a
                            LEFT JOIN student AS s ON s.id=a.studentId
                            LEFT JOIN subject AS sub ON sub.id=a.assignmentSubject
                            LEFT JOIN teacher AS t ON t.id=a.assignmentTeacher 
                            WHERE ${condition}
                            LIMIT ${recPerPage} OFFSET ${offset}`
        console.log("=================>");
        console.log(assignmentQuery);  
        con.query(assignmentQuery, function(err, result){
                if(err){
                    reject(err);
                }
                resolve(result);    
        });
    });
}
function countAllAssignment(formData){
    let condition = "1";
    let studentName = formData.query.student;
    let subjectName = formData.query.subject;
    let teacherName = formData.query.teacher;

    if(studentName) {
        condition += ` AND name LIKE "%${studentName}%"`;
    }
    if(subjectName) {
        condition +=  ` AND subjectName LIKE "%${subjectName}%"`;
    }
    if(teacherName) {
        condition +=  ` AND fullName LIKE "%${teacherName}%"`;
    }

    return new Promise((resolve, reject) => {
        let assignmentQuery = `SELECT COUNT(*) AS total 
                                FROM assignment AS a
                                LEFT JOIN student AS s ON s.id = a.studentId
                                LEFT JOIN subject AS sub ON sub.id = a.assignmentSubject
                                LEFT JOIN teacher AS t ON t.id = a.assignmentTeacher
                                WHERE ${condition}`;
        console.log("=================>");
        console.log(assignmentQuery);                        
        con.query(assignmentQuery, (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result[0].total);
        });
    });
}


module.exports.assignmentEdit = async(req, res) => {
     try {
        let editAssignmentsById = await editAssignmentById(req.params);  
        let students = await getStudent();
        let teachers = await getTeacher();
        let subjects = await getSubject();
        res.render("assignment/edit-assignment", {editAssignment: editAssignmentsById[0], students, teachers, subjects});
     } catch (error) {
         res.send(error);
     }
}
function editAssignmentById(editDataId){
    return new Promise((resolve, reject) => {
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
                    WHERE a.id = ${editDataId.id}`, (err, result) => {
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
    });
  }

module.exports.updateAssignment = async(req, res) => {
    try {
        let assignments = updateAssignment(req.body, req.params);
        res.redirect("/assignmentList");
    } catch (error) {
        res.send(error);
    }
}
function updateAssignment(data, value){
    return new Promise(function(resolve, reject) {
        con.query(`UPDATE assignment
                    SET
                        studentId =             ${data.sId},
                        assignmentSubject =     ${data.assignmentSubject},
                        assignmentTeacher =     ${data.assignmentListTeach},
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

module.exports.assignmentView = async(req, res) => {
    try {
        let assignmentViewData = await viewAssignmentById(req.params);
        res.render("assignment/view-assignment", {viewAssignmentData:assignmentViewData[0] });
    } catch (error) {
        res.send(error);
    }   
}
function viewAssignmentById(AssignmentId){
    return new Promise((resolve, reject) => {
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
            WHERE a.id = ? `, AssignmentId.id, (err, result) =>{
                if(err){
                    reject(err);
                }
                resolve(result);
            });
    });
}

module.exports.deleteAssignmentById=(req, res) =>{
    con.query("DELETE FROM assignment WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/assignmentList");
    });
}