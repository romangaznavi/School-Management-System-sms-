const staff = require("./staff.model");
const con = require("../../config");

module.exports = (app) => {
    app.get('/staffAdd', staff.staffAddForm);
    app.post('/insertStaff', staff.insertStaff);
    app.get('/stafflist', staff.staffList);
    app.get('/editStaff/:id', staff.editStaffById);
    app.post('/updateStaff/:id', staff.postStaff);
    app.get('/staffView/:id', staff.staffViewById);
    app.get('/deleteStaff/:id', staff.deleteStaffById);

}