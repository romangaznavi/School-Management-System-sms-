const con = require("../../config");
const subject = require("./subject.model");

module.exports = (app, recPerPage) =>{

app.post('/subjectAdd', subject.addSubject);

app.get('/teacherAdd', subject.getTeacher);

app.get('/subjectList', subject.subjectList);

app.get('/getSubjectData/:id', subject.updateSubject);
app.post('/updateSubject/:id', subject.subjectUpdate);

app.get('/subjectView/:id', subject.subjectById);

app.get('/deleteSubject/:id', (req, res) => {
    con.query("DELETE FROM subject WHERE id= ?", req.params.id, (err, result) =>{
        if(err){
            res.send(err);
        }
        res.redirect("/subjectList");
    })
});
}