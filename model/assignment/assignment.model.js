const con = require("../../config");



module.exports.assignmentPost = (req, res) => {
    con.query("INSERT INTO assignment (studentId, assignmentSubject, assignmentTeacher, completed, incomplete, notes) VALUES('"+req.body.sname+"', '"+req.body.asSubject+"', '"+req.body.asTeacher+"', '"+req.body.completed+"', '"+req.body.incomplete+"', '"+req.body.notes+"')", (err, data) => {
        if(err){
            res.send(err);
        }
            res.redirect("assignmentList");
    });
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

module.exports.assignmentList = (req, res) => {
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
}

module.exports.assignmentEdit = (req, res) => {
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

module.exports.assignmentView = (req, res) => {
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
}

module.exports.deleteAssignmentById=(req, res) =>{
    con.query("DELETE FROM assignment WHERE id = ? ", req.params.id, (err,result) => {
        if(err){
            res.send(err);
        }
        res.redirect("/assignmentList");
    });
}