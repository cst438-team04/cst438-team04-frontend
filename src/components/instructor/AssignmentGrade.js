import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {GRADEBOOK_URL, SERVER_URL} from '../../Constants';
import { Button } from '@mui/material';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignments/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 

const AssignmentGrade = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignment } = location.state || {};
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');


    useEffect(() => {
        if (assignment && assignment.id) {
            fetchGrades();
        }
    }, []);

    console.log('Grading assignment ID:', assignment.id);

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignment.id}/grades`);
            if (response.ok) {
                const data = await response.json();
                setGrades(data);
            } else {
                const err = await response.json();
                setMessage(`Error: ${err.message}`);
            }
        } catch (err) {
            setMessage(`Network error: ${err.message}`);
        }
    };

    const handleChange = (e, index) => {
        const updatedGrades = [...grades];
        updatedGrades[index].score = e.target.value;
        setGrades(updatedGrades);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${GRADEBOOK_URL}/grades`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grades),
            });

            if (!response.ok) {
                const err = await response.json();
                setMessage(`Error: ${err.message}`);
            } else {
                setMessage('Grades saved successfully.');
            }
        } catch (err) {
            setMessage(`Network error: ${err.message}`);
        }
    };

    return (
        <div>
            <h3>Grades for: {assignment.title}</h3>
            <p>{message}</p>
            <table className="Center">
                <thead>
                <tr>
                    <th>Grade ID</th>
                    <th>Student Name</th>
                    <th>Student Email</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {grades.map((g, idx) => (
                    <tr key={g.gradeId}>
                        <td>{g.gradeId}</td>
                        <td>{g.studentName}</td>
                        <td>{g.studentEmail}</td>
                        <td>
                            <input
                                type="text"
                                name="score"
                                value={g.score || ''}
                                onChange={(e) => handleChange(e, idx)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} style={{ marginLeft: '1rem' }}>
                Save Grades
            </Button>
        </div>
    );
};

export default AssignmentGrade;
