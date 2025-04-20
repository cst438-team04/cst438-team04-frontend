import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GradeIcon from '@mui/icons-material/Grade';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {confirmAlert} from "react-confirm-alert";



// instructor views assignments for their section
// use location to get the section value
//
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const {secNo, courseId, secId} = location.state;

    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const fetchAssignments = async () => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`, {
                headers: {'Authorization':jwt,}
            });
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                const err = await response.json();
                setMessage(`Error: ${err.message}`);
            }
        } catch (err) {
            setMessage(`Network error: ${err.message}`);
        }
    };
    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleAdd = () => {
        navigate('/assignmentAdd', { state: { secNo } });
    };

    const handleEdit = (assignment) => {
        setSelectedAssignment(assignment);
        setShowEditDialog(true);
    };

    const deleteAlert = (event) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDelete(event)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const handleDelete = async (assignmentId) => {

        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
                method: 'DELETE',
                headers: {'Authorization':jwt,}
            });
            if (response.ok) {
                await fetchAssignments();
            } else {
                const err = await response.json();
                setMessage(`Error: ${err.message}`);
            }
        } catch (err) {
            setMessage(`Network error: ${err.message}`);
        }
    };

    const handleGrade = (assignment) => {
        navigate('/assignmentGrade', { state: { assignment } });
    };

    return (
        <div>
            <h3>Assignments for Section {secNo}</h3>
            <Button variant="contained" onClick={() => setShowAddDialog(true)}>Add Assignment</Button>
            <p>{message}</p>
            <table className="Center">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {assignments.map(a => (
                    <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td>
                            <Tooltip title="Grade">
                                <IconButton id={`grade-assignment-${a.id}`} onClick={() => handleGrade(a)}>
                                    <GradeIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton id={`edit-assignment-${a.id}`} onClick={() => handleEdit(a)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton id={`delete-assignment-${a.id}`} onClick={() => deleteAlert(a.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showAddDialog && (
                <AssignmentAdd
                    secNo={secNo}
                    onClose={() => setShowAddDialog(false)}
                    onAssignmentAdded={fetchAssignments}
                />
            )}
            {showEditDialog && selectedAssignment && (
                <AssignmentUpdate
                    assignment={selectedAssignment}
                    onClose={() => setShowEditDialog(false)}
                    onAssignmentUpdated={fetchAssignments}
                />
            )}
        </div>
    );
}

export default AssignmentsView;
