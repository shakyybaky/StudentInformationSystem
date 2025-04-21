const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const mongoose = require("mongoose");
const Student = require("./models/student.model");
mongoose.connect("mongodb://localhost:27017/StudentInformationSystem");


const app = express();
const USERS_FILE = path.join(__dirname, "users.json");

app.use(cors());
app.use(express.json());

const port = 1337;

// ========================
// Student API Endpoints (DO NOT REMOVE)
// ========================

let students = [];

app.get("/fetchstudents", async (req, res) => {
    try {
      const students = await Student.find(); // Fetch students from MongoDB
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Error fetching students" });
    }
  });

  app.post("/addstudentsmongo", async (req, res) => {
    try {
      const { idNumber, firstname, lastname, middlename, course, year } = req.body;
      const newStudent = new Student({ idNumber, firstname, lastname, middlename, course, year });
      await newStudent.save();
      return res.status(201).json({ message: "Student added successfully" });
    } catch (error) {
      console.error("Error adding student:", error);
      return res.status(500).json({ message: "Server error while adding student." });
    }
  });

   

app.put("/updatestudent/:idNumber", async (req, res) => {
  const { idNumber } = req.params;
  const updatedStudent = req.body;

  try {
    const student = await Student.findOneAndUpdate(
      { idNumber },
      updatedStudent,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
    console.log("Updated Student:", student);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student" });
  }
});

app.delete("/deletestudent/:idNumber", async (req, res) => {
    const { idNumber } = req.params;
  
    try {
      const deletedStudent = await Student.findOneAndDelete({ idNumber });
  
      if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json({ message: "Student deleted successfully", deletedStudent });
      console.log("Deleted Student:", deletedStudent);
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Error deleting student" });
    }
  });

// ========================
// User API Endpoints (Persistent Storage)
// ========================

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf-8");
}

// Load users from file
const loadUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading users:", error);
        return [];
    }
};

// Save users to file
const saveUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (error) {
        console.error("Error saving users:", error);
    }
};

// Fetch users
app.get("/fetchusers", (req, res) => {
    res.json(loadUsers());
});

// Add user
app.post("/adduser", (req, res) => {
    let users = loadUsers();
    const newUser = req.body;

    if (!newUser.idNumber || !newUser.username) {
        return res.status(400).json({ message: "ID Number and Username are required" });
    }

    if (users.some(user => user.idNumber === newUser.idNumber)) {
        return res.status(400).json({ message: "User with this ID already exists" });
    }

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: "User added successfully" });
    console.log("Added User:", newUser);
});

// Update user
app.put("/updateuser/:idNumber", (req, res) => {
    let users = loadUsers();
    const { idNumber } = req.params;
    const updatedUser = req.body;

    let userIndex = users.findIndex(user => user.idNumber === idNumber);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        saveUsers(users);

        res.json({ message: "User updated successfully" });
        console.log("Updated User:", users[userIndex]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Delete user
app.delete("/deleteuser/:idNumber", (req, res) => {
    let users = loadUsers();
    const { idNumber } = req.params;

    const userIndex = users.findIndex(user => user.idNumber === idNumber);

    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        saveUsers(users);

        res.json({ message: "User deleted successfully", deletedUser });
        console.log("Deleted User:", deletedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
