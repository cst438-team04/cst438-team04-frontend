import React, {useState } from 'react';
import {Link} from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';

const InstructorHome = () => {

    const [term, setTerm] = useState({year:'', semester:''});

    const onChange = (event) => {
    setTerm({...term, [event.target.name]:event.target.value});
    }

    return (
        <Container maxWidth="sm" className="instructor-home-container">
            <Paper elevation={3} className="instructor-home-card">
                <Typography variant="h4" gutterBottom>
                    Welcome, Instructor
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Select a term to view your course sections.
                </Typography>
                <Box component="form" noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Year"
                        name="year"
                        value={term.year}
                        onChange={onChange}
                        fullWidth
                    />
                    <TextField
                        label="Semester"
                        name="semester"
                        value={term.semester}
                        onChange={onChange}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        component={Link}
                        to="/sections"
                        state={term}
                        sx={{ mt: 1 }}
                    >
                        Show Sections
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default InstructorHome;
