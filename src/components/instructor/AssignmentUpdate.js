//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../../Constants';

//Update assignment
const AssignmentUpdate = (props)  => {
  const [open, setOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [assignment, setAssignment] = useState({ id: '', title: '', dueDate: '', secNo: '', courseId: '', secId: '' });

  const editOpen = () => {
    setEditMessage('');
    setOpen(true);
    setAssignment(props.assignment);
  };

  const editClose = () => {
    setOpen(false);
    setAssignment({ id: '', title: '', dueDate: '', secNo: '', courseId: '', secId: '' });
    setEditMessage('');
  };

  const editChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  const onSave = () => {
    if (assignment.title === '') {
      setEditMessage("Title cannot be blank");
    } else if (assignment.dueDate === '') {
      setEditMessage("Due Date cannot be blank");
    } else {
      saveAssignment(assignment);
    }
  };

  const saveAssignment = async (assignment) => {
    try {
      const response = await fetch(`${SERVER_URL}/assignments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      });
      if (response.ok) {
        const rc = await response.json();
        setEditMessage("Assignment updated successfully");
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
      <Button onClick={editOpen}>Edit Assignment</Button>
      <Dialog open={open}>
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogContent style={{ paddingTop: 20 }}>
          <h4>{editMessage}</h4>
          <TextField
            style={{ padding: 10 }}
            autoFocus
            fullWidth
            label="Title"
            name="title"
            value={assignment.title}
            onChange={editChange}
          />
          <TextField
            style={{ padding: 10 }}
            fullWidth
            label="Due Date"
            name="dueDate"
            value={assignment.dueDate}
            onChange={editChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={editClose}>Close</Button>
          <Button color="primary" onClick={onSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignmentUpdate;
