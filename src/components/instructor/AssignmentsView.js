import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';

const AssignmentsView = (props) => {

    const location = useLocation();
    const { secNo, courseId, secId } = location.state;

    const headers = ['Assignment Id', 'Title', 'Due Date', 'Grade', 'Edit', 'Delete'];
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

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
    }, []);

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

    const onDelete = (assignmentId) => {
        deleteAssignment(assignmentId);
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
                            <Link to={`/assignments/${a.id}/grades`} state={{ assignmentId: a.id }}>
                                Grade
                            </Link>
                        </td>
                        <td>
                            <AssignmentUpdate assignment={a} save={saveAssignment} onClose={fetchAssignments} />
                        </td>
                        <td>
                            <Button onClick={() => onDelete(a.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <AssignmentAdd save={addAssignment} onClose={fetchAssignments} section={{ secNo, courseId, secId }} />
        </div>
    );
};

export default AssignmentsView;
