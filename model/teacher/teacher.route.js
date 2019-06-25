const teacher = require("./teacher.model");
const con = require("../../config");
module.exports = (app) => {


 

    

    app.get('/addClass', teacher.addClass);

    app.post('/addTeacherData', teacher.insertTeacher);

    app.get('/teacherList', teacher.listTeacher);

    // Update Get
    app.get('/getTeacherById/:id', teacher.editTeacherById);

    

    // View Teacher
    app.get('/viewTeacher/:id', teacher.viewTeacherById);

    // Delete Teacher
    app.get('/deleteTeacher/:id', teacher.deleteTeacherById);
}