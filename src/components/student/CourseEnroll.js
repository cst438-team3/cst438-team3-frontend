import React, {useState, useEffect} from 'react';
import { REGISTRAR_URL } from '../../Constants';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = () => {
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSections = async () => {
        try {
            const response = await fetch(`${REGISTRAR_URL}/sections/open`);
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                setMessage("Failed to fetch sections.");
            }
        } catch (error) {
            setMessage("Network error: " + error.message);
        }
    };
    
    const enrollInSection = async (secNo) => {
        try {
            const response = await fetch(`${REGISTRAR_URL}/enrollments/sections/${secNo}?studentId=3`, {
                method: 'POST',
            });
            if (response.ok) {
                setMessage(`Successfully enrolled in section ${secNo}`);
            } else {
                const error = await response.text();
                setMessage(`Enrollment failed: ${error}`);
            }
        } catch (error) {
            setMessage("Network error: " + error.message);
        }
    };
    
    useEffect(() => {
        fetchSections();
    }, []);
     
 
    return(
        <div style={styles.container}>
            <h3 style={styles.heading}>Enroll in a Section</h3>
            {message && <p id="message" style={styles.message}>{message}</p>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Section Number</th>
                        <th style={styles.th}>Course</th>
                        <th style={styles.th}>Times</th>
                        <th style={styles.th}>Instructor</th>
                        <th style={styles.th}>Enroll</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section) => (
                        <tr key={section.secNo}>
                            <td id="secNo" style={styles.td}>{section.secNo}</td>
                            <td id="title" style={styles.td}>{section.title}</td>
                            <td style={styles.td}>{section.times}</td>
                            <td style={styles.td}>{section.instructorName}</td>
                            <td style={styles.td}>
                                <button id="enroll" style={styles.button} onClick={() => enrollInSection(section.secNo)}>Enroll</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 30
    },
    heading: {
        marginBottom: '30px',
    },
    table: {
        borderCollapse: 'collapse',
        width: '80%',
        margin: '0 auto',
    },
    th: {
        border: '1px solid #DDDDDD',
        padding: '12px',
        backgroundColor: '#F2F2F2',
        fontWeight: 'bold'
    },
    td: {
        border: '1px solid #CCCCCC',
        padding: '10px 15px',
        textAlign: 'center'
    },
    button: {
        padding: '5px 10px',
        backgroundColor: '#007BFF',
        border: 'none',
        color: '#FFFFFF',
        borderRadius: 5,
        cursor: 'pointer'
    },
    message: {
        color: 'red',
        fontWeight: 'bold',
    },
};

export default CourseEnroll;
  