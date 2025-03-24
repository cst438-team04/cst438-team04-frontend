import React from 'react';
import {Outlet, Link, NavLink} from "react-router-dom";

const InstructorLayout = () => {

    return (
        <div className="instructor-layout">
            <nav className="instructor-nav">
                <h1 className="nav-title">Instructor Portal</h1>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/sections" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Sections
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <main className="instructor-main">
                <Outlet />
            </main>
        </div>
    );
};


export default InstructorLayout;
