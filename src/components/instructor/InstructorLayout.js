import React from 'react';
import {Outlet, Link} from "react-router-dom";

const InstructorLayout = () => {

    return (
        <>
            <nav>
                <Link to="/">Home</Link> &nbsp;|&nbsp;
                <Link to="/sections">View Sections</Link> &nbsp;|&nbsp;
                <Link to="/enrollments">View Enrollments</Link>
            </nav>

            <Outlet />
        </>
    );
};


export default InstructorLayout;
