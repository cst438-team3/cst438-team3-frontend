import React, {useState, useEffect} from 'react';
import { SERVER_URL } from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcripts?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const [transcript, setTranscripts] = useState([]);
    const [message, setMessage] = useState('');


    const fetchTranscripts = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=3`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                }
            })
            if (response.ok) {
                const data = await response.json();
                setTranscripts(data);
            } else {
                setMessage('Failed to load transcripts');
            }
        } catch (error) {
            setMessage('Network error: ' + error.message);
        }
    }

    useEffect(() => {
        fetchTranscripts();
    }, []);
      

    return(
        <div style={styles.container}>
            <h3 style={styles.heading}>My Transcript</h3>
            {message && <p style={styles.message}>{message}</p>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Year</th>
                        <th style={styles.th}>Semester</th>
                        <th style={styles.th}>Course ID</th>
                        <th style={styles.th}>Section</th>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Credits</th>
                        <th style={styles.th}>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.map((entry) => (
                        <tr key={entry.enrollmentId}>
                            <td style={styles.td}>{entry.year}</td>
                            <td style={styles.td}>{entry.semester}</td>
                            <td style={styles.td}>{entry.courseId}</td>
                            <td style={styles.td}>{entry.sectionNo}</td>
                            <td style={styles.td}>{entry.title}</td>
                            <td style={styles.td}>{entry.credits}</td>
                            <td style={styles.td}>{entry.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        padding: '30px',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '30px',
    },
    table: {
        width: '80%',
        borderCollapse: 'collapse',
        margin: '0 auto',
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
    message: {
        color: 'red',
        fontWeight: 'bold',
    },
};
  
export default Transcript;
