const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./models/Employee");
const app = express();
const http = require("http");
bodyParser = require('body-parser');
var server = http.createServer(app);
var cors = require('cors');

// use it before all route definitions
app.use(cors({ origin: 'http://localhost:3000' }));



// mongdb cloud connection is here
mongoose
    .connect("mongodb+srv://VrajSoni:JaiShreeKrishna0203@vrajsoni.wktya.mongodb.net/101247932_assignment2?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connected to mongodb cloud! :)");
    })
    .catch((err) => {
        console.log(err);
    });


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));



// route for handling get req.
app.get("/api/v1/employees", (req, res) => {
    Employee.find({})
        .then((result) => res.send(result))
        .catch(err => res.send(err))
})
    .get("/api/v1/employees/:id", async (req, res) => {
        let id = req.params.id;
        let obj = await Employee.findOne({ id: id });
        if (!obj) {
            res.status(400)
            return res.send("Employee with this id not found");
        }
        else {
            return res.send(obj);
        }

    })

// route for handling put req.
app.put("/api/v1/employees/:id", async (req, res) => {
    let id = req.params.id
    let obj = await Employee.findOne({ id: id });
    if (!obj) {
        res.status(500)
        return res.send("Invalid id");
    }
    if (req.body.lastname) {
        obj.lastname = req.body.lastname;
    }
    if (req.body.firstname) {
        obj.firstname = req.body.firstname;
    }
    if (req.body.emailid && obj.emailid !== req.body.emailid) {

        obj.emailid = req.body.emailid;
    }
    obj.save()
        .then(result => { return res.send(obj) })
        .catch(err => {
            if (err.code == 11000) {
                return res.send("Email id already exists");
            }
            res.status(500);
            return res.send(err)
        })

})



// route for handling post req.
app.post("/api/v1/employees", async (req, res) => {
    const { firstname, lastname, emailid } = req.body;
    var last_emp = await Employee.find().sort({ _id: -1 }).limit(1)
    last_emp = last_emp[0]
    if (last_emp) {
        let id = last_emp.id + 1;
        let emp_obj = Employee({ id, firstname, lastname, emailid })
        emp_obj.save()
            .then(result => { res.status(201); res.send(result); })
            .catch(err => {
                res.status(500)
                if (err.code === 11000) {
                    return res.send('Email Already Exists')
                }
                return res.send(err)
            })
    }
    else {
        let id = 1;
        let emp_obj = Employee({ id, firstname, lastname, emailid })
        emp_obj.save()
            .then(result => { res.status(201); return res.send(result); })
            .catch(err => {
                res.status(500)
                if (err.code === 11000) {
                    return res.send('Email Already Exists')
                }
                return res.send(err)
            })
    }
})



app.delete("/api/v1/employees/:id", async (req, res) => {
    let id = req.params.id
    Employee.findOne({ id: id }).remove()
        .then(() => { res.status(204); return res.send(); })
        .catch((err) => { res.status(500); return res.send(err) })

})




// server config
const PORT = 9090;
server.listen(process.env.PORT || 9090, function () {
    console.log('app running');
});