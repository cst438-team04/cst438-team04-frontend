import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

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
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');


    const fetchSections = async () => {
        try {
            const year = 2025;
            const semester = 'Spring';
            const email = 'dwisneski@csumb.edu'; // This will be replaced with logged-in user in assignment 7

            const response = await fetch(
                `${SERVER_URL}/sections?email=${email}&year=${year}&semester=${semester}`
            );

            if (!response.ok) {
                const json = await response.json();
                setMessage('Error: ' + json.message);
            } else {
                const data = await response.json();
                setSections(data);
            }
        } catch (err) {
            setMessage('Network error: ' + err.message);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    return (
        <div>
            <h3>My Sections</h3>
            {message && <p style={{ color: 'red' }}>{message}</p>}

            <table className="Center">
                <thead>
                <tr>
                    <th>Section No</th>
                    <th>Course Id</th>
                    <th>Section Id</th>
                    <th>Building</th>
                    <th>Room</th>
                    <th>Times</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sections.map((section) => (
                    <tr key={section.secNo}>
                        <td>{section.secNo}</td>
                        <td>{section.courseId}</td>
                        <td>{section.secId}</td>
                        <td>{section.building}</td>
                        <td>{section.room}</td>
                        <td>{section.times}</td>
                        <td>
                            <Link to="/assignments" state={section}>View Assignments</Link> |{' '}
                            <Link to="/enrollments" state={section}>View Enrollments</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InstructorSectionsView;

