const mongoose = require('mongoose');

const Student = new mongoose.Schema(
  {
    idNumber: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, required: false },
    course: { type: String, required: true },
    year: { type: String, required: true },
  },
  { collection: "student-data" }
);

module.exports = mongoose.model('Student', Student);