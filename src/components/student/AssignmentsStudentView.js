import React, {useState} from 'react';
import {GRADEBOOK_URL} from "../../Constants";
import Button from "@mui/material/Button";

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {
    const [term, setTerm] = useState({year:'', semester:''});
    const [assignments, setAssignments] = useState([])
    const [message, setMessage] = useState('');

    const headers = ['Assignment Id', 'Title', 'Due Date', 'Score'];
    const onChange = (event) => {
        setTerm({...term, [event.target.name]:event.target.value});
    }

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${GRADEBOOK_URL}/assignments?studentId=3&year=${term.year}&semester=${term.semester}`)
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setAssignments(data)
            } else {
                const rc = await response.json()
                setMessage("Response error: " + rc.message)
            }
        } catch (err) {
            setMessage("Network error: " + err.message);
        }
    }
    return(
        <>
            <h3>Enter Information</h3>
            <table className="Center">
                <tbody>
                <tr>
                    <td>Year:</td>
                    <td><input type="text" id="year" name="year" value={term.year} onChange={onChange} /></td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td><input type="text" id="semester" name="semester" value={term.semester} onChange={onChange} /></td>
                </tr>
                </tbody>
            </table>

            <Button onClick={fetchAssignments}> View Assignments </Button>

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
                        <tr key={a.assignmentId}>
                            <td>{a.assignmentId}</td>
                            <td>{a.title}</td>
                            <td>{a.dueDate}</td>
                            <td>{a.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AssignmentsStudentView;