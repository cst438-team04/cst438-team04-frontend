import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

// complete the code.
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = ({secNo, onClose, onAssignmentAdded})  => {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const section = location.state;

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    const handleSave = async () => {
        if (!title || !dueDate) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    dueDate: dueDate,
                    secNo: secNo
                })
            });

            if (!response.ok) {
                const err = await response.json();
                setError("Error: " + err.message);
            } else {
                setError('');
                if (onAssignmentAdded) onAssignmentAdded();
                if (onClose) onClose();
            }

        } catch (err) {
            setError("Network error: " + err.message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    id="atitle"
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField
                    id="adueDate"
                    margin="dense"
                    label="Due Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </DialogContent>
            <DialogActions>
                <Button id="cancelAssignment" onClick={handleClose}>Cancel</Button>
                <Button id="saveAssignment" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};
export default AssignmentAdd;
