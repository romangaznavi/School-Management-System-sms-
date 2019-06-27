const teacher = require("./teacher.model");
const con = require("../../config"); 
module.exports = (app) => {

    app.get('/addClass', teacher.addClass);
    app.post('/addTeacherData', teacher.insertTeacher);
    app.get('/teacherList', teacher.listTeacher);
    app.get('/getTeacherById/:id', teacher.editTeacherById);    
    app.get('/viewTeacher/:id', teacher.viewTeacherById);
    app.get('/deleteTeacher/:id', teacher.deleteTeacherById);
}