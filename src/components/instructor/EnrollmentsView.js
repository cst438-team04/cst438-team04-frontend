import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from '@mui/material/Button';

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

function EnrollmentsView() {
    const headers = ['Enrollment ID', 'Student ID', 'Name', 'Email', 'Grade', ''];
    const location = useLocation();
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const [sectionInfo, setSectionInfo] = useState({
        secNo: '',
        courseId: '',
        secId: ''
    });

    useEffect(() => {
        if (location.state?.secNo) {
            setSectionInfo({
                secNo: location.state.secNo,
                courseId: location.state.courseId || '',
                secId: location.state.secId || ''
            });
            fetchEnrollments(location.state.secNo);
        } else {
            setMessage('Error: No section selected');
        }
    }, [location.state]);

    const fetchEnrollments = async (sectionNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${sectionNo}/enrollments`);
            
            if (response.status === 404) {
                setEnrollments([]);
                setMessage('No students enrolled in this section');
                return;
            }
            
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }
            
            const data = await response.json();
            setEnrollments(data);
            setMessage('');
        } catch (err) {
            console.error('Fetch failed:', err);
            setMessage(err.message.includes('Failed to fetch') 
                ? 'Network error: Could not connect to server'
                : `Error: ${err.message}`);
        }
    };

    const handleGradeChange = (index, value) => {
        const updated = [...enrollments];
        updated[index].grade = value;
        setEnrollments(updated);
    };

    const saveGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollments.map(e => ({
                    enrollmentId: e.enrollmentId,
                    grade: e.grade || ''
                })))
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            setMessage('Grades saved successfully');
            fetchEnrollments(sectionInfo.secNo);
        } catch (err) {
            console.error('Save failed:', err);
            setMessage(`Save failed: ${err.message}`);
        }
    };

    const deleteEnrollment = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            setMessage('Enrollment deleted');
            fetchEnrollments(sectionInfo.secNo);
        } catch (err) {
            console.error('Delete failed:', err);
            setMessage(`Delete failed: ${err.message}`);
        }
    };

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const enrollmentId = enrollments[row_idx].enrollmentId;
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete this enrollment?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteEnrollment(enrollmentId)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    if (!location.state?.secNo) {
        return (
            <div>
                <h3>Error</h3>
                <h4>{message}</h4>
            </div>
        );
    }

    return (
        <div>
            <h3>Enrollments for Section {sectionInfo.secNo}</h3>
            <h4>{message}</h4>
            
            <table className="Center">
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((e, index) => (
                        <tr key={e.enrollmentId}>
                            <td>{e.enrollmentId}</td>
                            <td>{e.studentId}</td>
                            <td>{e.studentName}</td>
                            <td>{e.studentEmail}</td>
                            <td>
                                <input
                                    type="text"
                                    value={e.grade || ''}
                                    onChange={(evt) => handleGradeChange(index, evt.target.value)}
                                />
                            </td>
                            <td><Button onClick={onDelete}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Button 
                variant="contained"
                onClick={saveGrades}
                disabled={!enrollments.length}
                style={{ marginTop: '20px' }}
            >
                Save Grades
            </Button>
        </div>
    );
}

export default EnrollmentsView;
