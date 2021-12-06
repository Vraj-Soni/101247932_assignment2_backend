const mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const EmployeeSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: 'id is required',
  },
  firstname: {
    type: String,
    required: 'First name  is required',
  },
  lastname: {
    type: String,
    required: 'Last name is required',
  },
  emailid: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

  },

});


module.exports = new mongoose.model("employee", EmployeeSchema, 'employee');
