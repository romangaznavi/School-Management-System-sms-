const con = require('../../config');
const student = require("./student.model");
module.exports = (app, recPerPage) => {

    app.get('/', student.list);

    app.get('/add', student.add);

    app.post('/insertStudent', student.addStudent);

    app.get('/studentView/:id', student.viewStudentById);

    app.get('/editStudent/:id', student.editStudent);

    app.post('/updateStudent/:id', student.studentUpdate);

    app.get('/deleteStudent/:id', student.deleteStudent);
}