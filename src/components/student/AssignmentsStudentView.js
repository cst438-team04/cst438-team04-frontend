import React, {useEffect, useState} from 'react';
import {SERVER_URL} from "../../Constants";
import CourseUpdate from "../admin/CourseUpdate";
import Button from "@mui/material/Button";
import CourseAdd from "../admin/CourseAdd";

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {
    const headers = ['CourseId','Assignment Title', 'DueDate', 'Score'];
    const [assignments, setAssignments] = useState([]);
    const [message,setMessage] = useState('');

    const[semester, setSemester] = useState('')
    const[year, setYear] = useState('')

    const fetchAssignments = async () => {
        try {
            //login will be added later, for now I will utilize studentId 3 to simulate that student being logged in
            const studentId = 3;
            //year and semester inputs will be filled out later through text fields
            const response = await fetch(`${SERVER_URL}/assignments?studentId=${studentId}&year=${year}&semester=${semester}`);
            if (response.ok) {
                const assignments = await response.json();
                setAssignments(assignments)
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }


    useEffect(() => {
        //this if prevents an error message being thrown since on load the semester and year are "" so it tries to cast a String to int for year
        if(semester && year)
        {fetchAssignments();}
    },[]);
     
    return(
        <div>
            <h3>Assignments</h3>
            <h4>{message}</h4>
            <div>
                {/*Inputs for student to search by semester and year*/}
                <label>Semester: </label>
                <input
                    type = "text"
                    value = {semester}
                    onChange={(e)=>setSemester(e.target.value)}
                    placeholder="e.g., Spring"
                    />
                <label>Year</label>
                <input
                    type = "text"
                    value ={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2025"
                    />
                {/*sets the onclick to the fetchAssignments method to load the assignments pertaining to userinput, sets url for year and semester to api*/}
                <button onClick={fetchAssignments}>Fetch Assignments</button>
            </div>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a) => (
                    <tr key={a.id}>
                        <td>{a.courseId}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td>{a.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AssignmentsStudentView;