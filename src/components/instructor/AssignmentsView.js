// import React, {useState, useEffect} from 'react';
// import {useLocation} from 'react-router-dom'

// // instructor views assignments for their section
// // use location to get the section value 
// // 
// // GET assignments using the URL /sections/{secNo}/assignments
// // returns a list of AssignmentDTOs
// // display a table with columns 
// // assignment id, title, dueDate and buttons to grade, edit, delete each assignment

// const AssignmentsView = (props) => {

//     const location = useLocation();
//     const {secNo, courseId, secId} = location.state;
     
//     return(
//         <> 
//            <h3>Not implemented</h3>
//         </>
//     );
// }

// export default AssignmentsView;


import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';

const AssignmentsView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { secNo, courseId, secId } = location.state;

  const headers = ['Assignment Id', 'Title', 'Due Date', '', '', ''];
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch assignments for the section
  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const data = await response.json();
        setMessage("Response error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update assignment via PUT
  const saveAssignment = async (assignment) => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      });
      if (response.ok) {
        setMessage("Assignment updated");
        fetchAssignments();
      } else {
        const data = await response.json();
        setMessage("Response error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  // Add new assignment via POST
  const addAssignment = async (assignment) => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      });
      if (response.ok) {
        setMessage("Assignment added");
        fetchAssignments();
      } else {
        const data = await response.json();
        setMessage("Response error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  // Delete assignment via DELETE
  const deleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setMessage("Assignment deleted");
        fetchAssignments();
      } else {
        const data = await response.json();
        setMessage("Response error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  // Confirm deletion
  const onDelete = (assignmentId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Do you really want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteAssignment(assignmentId)
        },
        {
          label: 'No'
        }
      ]
    });
  };

  // Navigate to grading view
  const onGrade = (assignmentId) => {
    navigate(`/assignments/${assignmentId}/grades`, { state: { secNo, courseId, secId } });
  };

  return (
    <div>
      <h3>Assignments</h3>
      <h4>{message}</h4>
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{a.dueDate}</td>
              <td>
                <Button onClick={() => onGrade(a.id)}>Grade</Button>
              </td>
              <td>
                {/* Pass the assignment object and onClose callback to refresh the list */}
                <AssignmentUpdate assignment={a} save={saveAssignment} onClose={fetchAssignments} />
              </td>
              <td>
                <Button onClick={() => onDelete(a.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* AssignmentAdd component for adding new assignments */}
      <AssignmentAdd save={addAssignment} onClose={fetchAssignments} />
    </div>
  );
};

export default AssignmentsView;
