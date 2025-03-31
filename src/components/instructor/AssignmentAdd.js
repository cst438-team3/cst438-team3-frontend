
// // instructor adds an assignment to a section
// // use mui Dialog with assignment fields Title and DueDate
// // issue a POST using URL /assignments to add the assignment

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../../Constants';

const AssignmentAdd = (props)  => {
  const section = props.section || { secNo: '', courseId: '', secId: '' };
  const [open, setOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '', secNo: section.secNo, courseId: section.courseId, secId: section.secId });

  const editOpen = () => {
    setAssignment({ title: '', dueDate: '', secNo: section.secNo, courseId: section.courseId, secId: section.secId });
    setEditMessage('');
    setOpen(true);
  };

  const editClose = () => {
    setOpen(false);
    setAssignment({ title: '', dueDate: '', secNo: section.secNo, courseId: section.courseId, secId: section.secId });
    setEditMessage('');
  };

  const editChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  // Validate input 
  const onSave = () => {
    if (assignment.title === '') {
      setEditMessage("Title cannot be blank");
    } else if (assignment.dueDate === '') {
      setEditMessage("Due Date cannot be blank");
    } else {
      addAssignment(assignment);
    }
  };


  const addAssignment = async (assignment) => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      });
      if (response.ok) {
        const rc = await response.json();
        setEditMessage("Assignment added successfully");
        editClose();
        if (props.onClose) {
          props.onClose();
        }
      } else {
        const rc = await response.json();
        setEditMessage(rc.message);
      }
    } catch (err) {
      setEditMessage("Network error: " + err.message);
    }
  };

  return (
    <>
      <Button id="addAssignment" onClick={editOpen}>Add Assignment</Button>
      <Dialog open={open}>
        <DialogTitle>Add Assignment</DialogTitle>
        <DialogContent style={{ paddingTop: 20 }}>
          <h4>{editMessage}</h4>
          <TextField
            style={{ padding: 10 }}
            autoFocus
            fullWidth
            label="Title"
            name="title"
            id="title"
            value={assignment.title}
            onChange={editChange}
          />
          <TextField
            style={{ padding: 10 }}
            fullWidth
            label="Due Date"
            name="dueDate"
            id="dueDate"
            value={assignment.dueDate}
            onChange={editChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={editClose}>Close</Button>
          <Button id="save" color="primary" onClick={onSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignmentAdd;
