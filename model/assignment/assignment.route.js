const con = require("../../config");
const assignment = require("./assignment.model");
module.exports = (app) => {

    app.post('/addAssignment', assignment.assignmentPost);

    app.get('/assignmentAdd', assignment.assignmentAdd);

    app.get('/assignmentList', assignment.assignmentList);

    app.get('/showAssignment/:id', assignment.assignmentEdit);

    app.post('/updateAssignment/:id', assignment.updateAssignment);

    app.get('/assignmentView/:id', assignment.assignmentView);

    app.get('/deleteAssignment/:id', assignment.deleteAssignmentById);
}