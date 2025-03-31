import React, {useState, useEffect} from 'react';
import { Link, useLocation } from "react-router-dom";
import {SERVER_URL} from '../../Constants';
import "../../App.css";

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {

    const headers = ['secNo', 'course id', 'sec id', 'building', 'room', 'times', '', '']; 
    
    const [sections, setSections] = useState([]);

    const [message, setMessage] = useState('');

    const location = useLocation();
    const { year, semester } = location.state;

    const fetchSections = async () => {
        try{
            const response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${year}&semester=${semester}`)
            
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
        }

        } catch(err) {
            setMessage("network error: " + err);
        }
    }; 

    useEffect(() => {
        fetchSections();
    }, [year, semester]);
     
    return(

        <div> 

            <h3> Sections</h3>
           
           { sections.length > 0 && 
                <>

                    <h3>{year} {semester} </h3>

                    <table className="Center">
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                            {sections.map((s) => (
                                <tr key={s.secNo}>
                                    <td>{s.secNo}</td>
                                    <td>{s.courseId}</td>
                                    <td>{s.secId}</td>
                                    <td>{s.building}</td>
                                    <td>{s.room}</td>
                                    <td>{s.times}</td>
                                    <td><Link to="/enrollments" id="viewEnrollments" state={s}>View Enrollments</Link></td>
                                    <td><Link to="/assignments" id="viewAssignments" state={s}>View Assignments</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>

           }
        </div>
    );
}

export default InstructorSectionsView;

