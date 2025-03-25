import React, {useState, useEffect} from 'react';
import { SERVER_URL } from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollments?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollments/{enrollmentId}

const ScheduleView = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSchedule = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=2024&semester=Fall`);
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            } else {
                setMessage('Failed to load schedule');
            }
        } catch (error) {
            setMessage('Network error: ' + error.message);
        }
    };

    const dropEnrollment = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage(`Successfully dropped enrollment ${enrollmentId}`);
                fetchSchedule();
            } else {
                const errorText = await response.text();
                setMessage('Drop failed: ' + errorText);
            }
        } catch (error) {
            setMessage('Network error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    
   
    return(
        <div style={styles.container}>
            <h3 style={styles.heading}>My Class Schedule</h3>
            {message && <p style={styles.message}>{message}</p>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Course</th>
                        <th style={styles.th}>Section</th>
                        <th style={styles.th}>Times</th>
                        <th style={styles.th}>Room</th>
                        <th style={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((e) => (
                        <tr key={e.enrollmentId}>
                            <td style={styles.td}>{e.title}</td>
                            <td style={styles.td}>{e.sectionNo}</td>
                            <td style={styles.td}>{e.times}</td>
                            <td style={styles.td}>{e.building} {e.room}</td>
                            <td style={styles.td}>
                                <button style={styles.button} onClick={() => dropEnrollment(e.enrollmentId)}>Drop</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '30px',
    },
    message: {
        color: 'red',
        fontWeight: 'bold',
    },
    table: {
        margin: '0 auto',
        borderCollapse: 'collapse',
        width: '80%',
    },
    th: {
        border: '1px solid #DDDDDD',
        padding: '12px',
        backgroundColor: '#F2F2F2',
        fontWeight: 'bold',
    },
    td: {
        border: '1px solid #CCCCCC',
        padding: '12px',
    },
    button: {
        padding: '6px 12px',
        backgroundColor: '#007BFF',
        color: '#FFFFFF',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
    },
};

export default ScheduleView;
