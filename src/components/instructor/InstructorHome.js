import React, {useState } from 'react';
import {Link} from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';

const InstructorHome = () => {

    const [term, setTerm] = useState({year:'', semester:''});

    const onChange = (event) => {
    setTerm({...term, [event.target.name]:event.target.value});
    }

    return (
        <div>
            <h1>Instructor Home</h1>
            <p>View the sections you are teaching this term.</p>
            <p>Create and manage assignments.</p>
            <p>View enrollments and student lists.</p>
            <p>Enter or update student grades.</p>
        </div>
    );
};

export default InstructorHome;
