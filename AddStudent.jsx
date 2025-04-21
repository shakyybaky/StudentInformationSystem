import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Sidebar.css";
import "./AddStudent.css";
import { TextField, Button, Typography, Table, TableHead, TableBody, TableRow, TableCell, Modal, Box } from "@mui/material";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function AddStudent() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []); 

  async function fetchStudents() {
    try {
      const response = await axios.get("http://localhost:1337/fetchstudents");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  const idNumber = useRef(null);
  const firstname = useRef(null);
  const lastname = useRef(null);
  const middlename = useRef(null);
  const course = useRef(null);
  const year = useRef(null);

  async function handleAddStudent() {
    const newStudent = {
      idNumber: idNumber.current.value,
      firstname: firstname.current.value,
      lastname: lastname.current.value,
      middlename: middlename.current.value,
      course: course.current.value,
      year: year.current.value,
    };

    try {
      await axios.post("http://localhost:1337/addstudentsmongo", newStudent);
      fetchStudents();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  }

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditingStudent(null);
    setOpenEditModal(false);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Handle Edit Student
  async function handleEdit() {
    try {
      await axios.put(`http://localhost:1337/updatestudent/${editingStudent.idNumber}`, editingStudent);
      fetchStudents();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  }

  // Handle Delete Student
  async function handleDelete(idNumber) {
    try {
      await axios.delete(`http://localhost:1337/deletestudent/${idNumber}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="Buttons">
        <Button variant="contained" size="small" className="add-student-button" onClick={handleOpenAddModal}>
          <AddCircleIcon />
        </Button>
        <Typography variant="h2">MANAGE STUDENT</Typography>

        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell><b>ID Number</b></TableCell>
              <TableCell><b>First Name</b></TableCell>
              <TableCell><b>Last Name</b></TableCell>
              <TableCell><b>Middle Name</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Year</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.idNumber}</TableCell>
                <TableCell>{student.firstname}</TableCell>
                <TableCell>{student.lastname}</TableCell>
                <TableCell>{student.middlename}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>{student.year}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" className="EditButton" onClick={() => handleOpenEditModal(student)}>
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button variant="contained" className="DeleteButton" size="small" sx={{ ml: 1 }} onClick={() => handleDelete(student.idNumber)}>
                    <DeleteIcon fontSize="small" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Student Modal */}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h4" className="AddStudentTitle" sx={{ mb: 2 }}>ADD STUDENT</Typography>
          <TextField inputRef={idNumber} label="ID Number" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField inputRef={firstname} label="First Name" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField inputRef={lastname} label="Last Name" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField inputRef={middlename} label="Middle Name" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField inputRef={course} label="Course" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <TextField inputRef={year} label="Year" variant="outlined" fullWidth sx={{ mb: 2 }} />
          <Button onClick={handleAddStudent} variant="contained" fullWidth sx={{ backgroundColor: "#0c0c0c", color: "white", "&:hover": { backgroundColor: "#0c0c0c" } }}>ADD STUDENT</Button>
        </Box>
      </Modal>
            {/* Edit Student Modal */}
            <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h4"  className="EditTitle" sx={{ mb: 2 }}>EDIT STUDENT</Typography>
          <TextField label="ID Number" variant="filled" fullWidth sx={{ mb: 2 }} value={editingStudent?.idNumber || ""} InputProps={{ readOnly: true }} />
          <TextField label="First Name" variant="filled" fullWidth sx={{ mb: 2 }} value={editingStudent?.first || ""} onChange={(e) => setEditingStudent({ ...editingStudent, first: e.target.value })} />
          <TextField label="Last Name" variant="filled" fullWidth sx={{ mb: 2 }} value={editingStudent?.last || ""} onChange={(e) => setEditingStudent({ ...editingStudent, last: e.target.value })} />
          <TextField label="Middle Name" variant="filled" fullWidth sx={{ mb: 2 }} value={editingStudent?.middle || ""} onChange={(e) => setEditingStudent({ ...editingStudent, middle: e.target.value })} />
          <TextField label="Course" variant="filled" fullWidth sx={{ mb: 2 }} value={editingStudent?.course || ""} onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })} />
          <TextField label="Year" variant="filled" fullWidth sx={{ mb: 3 }} value={editingStudent?.year || ""} onChange={(e) => setEditingStudent({ ...editingStudent, year: e.target.value })} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained"  className="SaveButton" onClick={handleEdit}>Save</Button>
            <Button variant="outlined"  className="Close" onClick={handleCloseEditModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
   
export default AddStudent;
