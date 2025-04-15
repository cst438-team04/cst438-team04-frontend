import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {GRADEBOOK_URL, SERVER_URL} from '../../Constants';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = ({ assignment, onClose, onAssignmentUpdated })  => {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState(assignment.title);
    const [dueDate, setDueDate] = useState(assignment.dueDate);
    const [error, setError] = useState('');

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleSave = async () => {
        if (!title || !dueDate) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: assignment.id,
                    title: title,
                    dueDate: dueDate,
                    sectionNo: assignment.secNo
                })
            });

            if (!response.ok) {
                const err = await response.json();
                setError("Error: " + err.message);
            } else {
                if (onAssignmentUpdated) onAssignmentUpdated();
                handleClose();
            }
        } catch (err) {
            setError("Network error: " + err.message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AssignmentUpdate;
