import React, {useState, useEffect} from 'react';
import { Link, useLocation } from "react-router-dom";
import "../../App.css";
import {GRADEBOOK_URL} from '../../Constants';
import { Button } from '@mui/material';

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const [message, setMessage] = useState('');
    const [enrollments, setEnrollments] = useState([]);

    const headers = ['enrollment id', 'student id', 'name', 'email', 'grade', ''];
    
    //get enrollments for a given section 
    const fetchEnrollments = async () => {
        try{
            const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/enrollments`)

            if(response.ok){ 
                const data = await response.json();
                setEnrollments(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch(err) {
            setMessage("network error: " + err);
        }
    }; 

 
    const onSave = (enrollment) => {
        //check for valid letter grade
       const validGrades = ['A', 'B', 'C', 'D', 'F'];

       if(!validGrades.includes(enrollment.grade)){ 
            setMessage("Invalid grade entered. Only letter grades allowed.")
            return;
       }
            setMessage("");
            saveGrade(enrollment);
    }

     
    const saveGrade = async (enrollment) => {
        try{
            const response = await fetch (`${GRADEBOOK_URL}/enrollments`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([enrollment])
                });
                if (response.ok) {
                    setMessage("grade saved");
                  } else {
                    const rc = await response.json();
                    setMessage(rc.message);
                  }
        }catch(err){
            setMessage("network error: " + err);
        }
    }

    //updates grade in local state upon input field change
    const onGradeChange = (e, enrollmentId) => {
        const newGrade = e.target.value.toUpperCase();

        setEnrollments(prevEnrollments => 
            prevEnrollments.map(enrollment => {
                if( enrollment.enrollmentId === enrollmentId) {
                    return {...enrollment, grade: newGrade}
                } else {
                    return enrollment;
                }
            }));
    }


     useEffect(() => {
            fetchEnrollments();
        }, [secNo]);


    return(
        <div>
            <h3> Enrollments </h3>

            { enrollments.length > 0 &&
                <>
                    <h3> {courseId} - Section {secNo} </h3>
                    <h3 id="message"> {message} </h3>
                    <table className = "Center">
                        <thead>
                        <tr>
                            {headers.map((e, idx) => (<th key={idx}>{e}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((e) => (
                                <tr key={e.enrollmentId}>
                                    <td>{e.enrollmentId}</td>
                                    <td>{e.studentId}</td>
                                    <td>{e.name}</td>
                                    <td>{e.email}</td>
                                    <td><input
                                        id="grade"
                                        type="text"
                                        name="grade"
                                        value={e.grade || ''} 
                                        onChange={(event) => onGradeChange(event, e.enrollmentId)}
                                        /></td>
                                    <td><Button id="save" onClick={() => onSave(e)}>Save</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
        </div>
    );
}

export default EnrollmentsView;
