const classes = require("./class.model");
const con = require("../../config");
module.exports = (app) => {
    app.get('/classInfo', classes.classData);
    app.post('/addClass', classes.insertClassData);
    app.get('/listClas', classes.listClass);
    app.get('/editClass/:id', classes.editClassById);
    app.post('/updateClass/:id', classes.updateClass);
    app.get('/viewClass/:id', classes.viewClassById);
    app.get('/deleteClass/:id', classes.deleteClassById);
}