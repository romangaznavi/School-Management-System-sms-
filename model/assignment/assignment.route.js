const con = require("../../config");
const assignment = require("./assignment.model");
module.exports = (app) => { 
    app.get('/assignmentAdd', assignment.assignmentAdd);
    app.post('/addAssignment', assignment.assignmentPost);
    app.get('/assignmentList', assignment.assignmentList);
    app.get('/editAssignmentById/:id', assignment.assignmentEdit);
    app.post('/updateAssignment/:id', assignment.updateAssignment);
    app.get('/assignmentView/:id', assignment.assignmentView);
    app.get('/deleteAssignment/:id', assignment.deleteAssignmentById);
} 