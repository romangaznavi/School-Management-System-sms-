const con = require("../../config");
const recPerPage = 3;
 
module.exports.staffAddForm = (req, res) => {  
    res.render("staff/add-staff");
}

module.exports.insertStaff = (req, res) => {
    con.query("INSERT INTO staff (fullName, designation, mobile, address, joiningDate, salary) VALUES ('"+req.body.name+"', '"+req.body.designation+"', '"+req.body.mobile+"', '"+req.body.address+"', '"+req.body.jdate+"', '"+req.body.salary+"')", (err, data) => {
        if(err){
            res.send(err);
        }
            res.redirect("/stafflist");
    });
}
 
module.exports.staffList = async(req, res) => {
    try {
        let page = req.query.page || 1;
        let allStaff = await countAllStaff();
        let offset = (recPerPage * page) - recPerPage;
        let staffs = await getStaff(offset);
        let totalPage = Math.ceil(allStaff/recPerPage);
        res.render("staff/list-staff", {allStaffData: allStaff, staffData: staffs, pageNo: page, totalPages: totalPage});
    } catch (error) {
        console.log(error);
    }
}
function getStaff(offset){
    return new Promise((resolve, reject) => {
        con.query(`SELECT
                        s.id,
                        s.fullName,
                        s.designation,
                        s.mobile,
                        s.address,
                        s.joiningDate,
                        s.salary
                    FROM staff AS s
                    LIMIT ${recPerPage} OFFSET ${offset}`, function (err, result) {
                        if(err){
                            reject(err);
                        }               
                        resolve(result);         
                    });
    });
}

function countAllStaff(){
    return new Promise((resolve, reject) => {
        con.query("SELECT COUNT(*) AS totalStaff FROM staff", (err, staffCount) => {
            if(err){
                reject(err);
            }
            resolve(staffCount[0].totalStaff);
        });
    });
} 

module.exports.editStaffById = async(req, res) => {
    try {
        let staffEdit = await editStaff(req.params)
        res.render("staff/edit-staff", {staffEdit: staffEdit});
    } catch (error) {
        
    }
}
function editStaff(reqParams){
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM staff WHERE id = ?", reqParams.id, (err, result) => {
            if(err){
                reject(err);
            }
            resolve(result);                
        });
    });
}

module.exports.postStaff = (req, res) => {
    con.query(`UPDATE staff
                SET
                fullName= '${req.body.fname}',
                designation= '${req.body.designation}',
                mobile= ${req.body.mobile},
                address= '${req.body.address}',
                joiningDate= '${req.body.jdate}',
                salary= ${req.body.salary}
                WHERE id= '${req.params.id}'`, function(err, result){
                    if(err){
                        res.send(err);
                    }
                        res.redirect("/stafflist");
                });
}

module.exports.staffViewById = (req, res) => {
    con.query("SELECT * FROM staff WHERE id = ?", req.params.id, (err, result) =>{
        if(err){
            res.send(err);
        }
        res.render("staff/view-staff", {viewStaffData: result});
    });
}

module.exports.deleteStaffById = (req, res) => {
    con.query("DELETE FROM staff WHERE id = ? ", req.params.id,(err, result) =>{
        if(err){
            res.send(err);
        }
        res.redirect("/stafflist");
    });
}