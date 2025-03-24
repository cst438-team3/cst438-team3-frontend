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

const AssignmentUpdate = (props)  => {
    // Expect assignment to be passed via props
    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({ id:'', title:'', dueDate:'' });

    // Open the dialog, reset message, and load the assignment to be updated
    const editOpen = () => {
        setEditMessage('');
        setOpen(true);
        setAssignment(props.assignment);
    };

    // Close the dialog and reset state
    const editClose = () => {
        setOpen(false);
        setAssignment({ id:'', title:'', dueDate:'' });
        setEditMessage('');
    };

    // Handle changes in text fields
    const editChange = (event) => {
        setAssignment({ ...assignment, [event.target.name]: event.target.value });
    };

    // Validate input and update the assignment via a PUT call
    const onSave = () => {
        if (assignment.title === '') {
            setEditMessage("Title cannot be blank");
        } else if (assignment.dueDate === '') {
            setEditMessage("Due Date cannot be blank");
        } else {
            saveAssignment(assignment);
        }
    };

    // Async function to update an assignment using fetch and async/await
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
                        style={{ padding:10 }} 
                        autoFocus 
                        fullWidth 
                        label="Title" 
                        name="title" 
                        value={assignment.title} 
                        onChange={editChange} 
                    />
                    <TextField 
                        style={{ padding:10 }} 
                        fullWidth 
                        label="Due Date" 
                        name="dueDate" 
                        type="date" 
                        value={assignment.dueDate} 
                        onChange={editChange} 
                        InputLabelProps={{ shrink: true }} 
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