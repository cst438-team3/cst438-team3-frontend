import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../../App.css";
import {SERVER_URL} from '../../Constants';
import { Button } from '@mui/material';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignments/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 

const AssignmentGrade = (props) => {

    const location = useLocation(); 
    const {assignmentId} = location.state;

    const [message, setMessage] = useState('');
    const [grades, setGrades] = useState([]);

    const headers = ['gradeId', 'student name', 'student email', 'score', ''];

    const fetchGrades = async () => {
        try{
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}/grades`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                }
            })

            if(response.ok){
                const data = await response.json();
                //if grade doesn't have a score, set to empty string
                const formattedData = data.map(grade => ({
                    ...grade, 
                    score: grade.score !== undefined ? grade.score : ''
                }));
                setGrades(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        }catch(err){
            setMessage("network error: " + err);
        }
    }

    const onSave = (grade) => {
        saveScore(grade);
    }

    const saveScore = async (grade) => {
        try{
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch (`${SERVER_URL}/grades`,
                {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                    body: JSON.stringify([grade])
                }); 
                if(response.ok){
                    setMessage("score saved");
                } else {
                    const rc = await response.json();
                    setMessage(rc.message);
                }
        }catch(err){
            setMessage("network error: " + err)
        }
    }

    const onScoreChange = (e, gradeId) => {
        const newScore = e.target.value;
        setGrades(prevGrades =>
            prevGrades.map(g =>
                g.gradeId === gradeId ? { ...g, score: newScore } : g
            )
        );
    };

    useEffect(() => {
                fetchGrades();
            }, [assignmentId]);
 
    return(
        <>
            <h3>Assignment Grades</h3>

            { grades.length > 0 &&
                <>
                    <h3 id="message"> {message} </h3>
                    <table className="Center">
                        <thead>
                        <tr>
                            {headers.map((g, idx) => (<th key={idx}>{g}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                            {grades.map((g) => (
                                <tr key={g.gradeId}>
                                    <td>{g.gradeId}</td>
                                    <td>{g.studentEmail}</td>
                                    <td>{g.studentName}</td>
                                    <td><input id="score" type="text" name="score" value={g.score} onChange={(e) => onScoreChange(e, g.gradeId)}></input></td>
                                    <td><Button id="save" onClick={() => onSave(g)}>Save</Button></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </>
            }
        </>          
    );
}

export default AssignmentGrade;
