import React, {useEffect, useState} from 'react';
import {GRADEBOOK_URL, SERVER_URL} from "../../Constants";
import Button from '@mui/material/Button'
import 'react-confirm-alert/src/react-confirm-alert.css';
import {confirmAlert} from "react-confirm-alert";

// student can view schedule of sections 
// use the URL /enrollments?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollments/{enrollmentId}

const ScheduleView = (props) => {
    const headers = [ 'Grade','Student Id', 'Course Id', 'Title', 'Section Id','Building', 'Room','Times', 'Credits','Action']
    const[scheduleEnrollment, setScheduleEnrollments] = useState([]);
    const[message,setMessage] = useState('');
    const[semester, setSemester] = useState('')
    const[year, setYear] = useState('')

    const deleteAlert = (event) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => doDelete(event)
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    const doDelete = async (event)  =>  {
        try {


        const row_index = event.target.parentNode.parentNode.rowIndex-1;
        const enrollmentToDelete = scheduleEnrollment[row_index];
        if(!enrollmentToDelete) {
            setMessage("error: Enrollment not found.");
            return;
        }

        const enrollmentId = enrollmentToDelete.enrollmentId;
        const response = await fetch(`${SERVER_URL}/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
        if(response.ok) {
            const scheduleEnrollment_copy = scheduleEnrollment.filter((se) => se.enrollmentId !== enrollmentId);
            setScheduleEnrollments(scheduleEnrollment_copy);
            setMessage("Enrollment: " + enrollmentId + " dropped succesfully");
        } else {
            const json = await response.json()
            setMessage("Error dropping enrollment: " + json.message);
        }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    }
    const fetchScheduleEnrollments = async() => {
        try {
            const studentId = 3;
            const response = await fetch(`${SERVER_URL}/enrollments?studentId=${studentId}&year=${year}&semester=${semester}`);
            if (response.ok) {
                const enrollments = await response.json();
                setScheduleEnrollments(enrollments);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect(() => {
        if(semester && year)
        {
            fetchScheduleEnrollments()
        }
    },[]);
   
    return(
        <div>
            <h3>Schedule</h3>
            <h4>{message}</h4>
            <div>
                {/*Inputs for student to search by semester and year*/}
                <label>Semester: </label>
                <input
                    id = "semester"
                    type = "text"
                    value = {semester}
                    onChange={(e)=>setSemester(e.target.value)}
                    placeholder="e.g., Spring"
                />
                <label>Year</label>
                <input
                    id = "year"
                    type = "text"
                    value ={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2025"
                />
                {/*sets the onclick to the fetchScheduleEnrollments method to load the assignments pertaining to userinput, sets url for year and semester to api*/}
                <button id="searchSchedule" onClick={fetchScheduleEnrollments}>Fetch Schedule</button>
            </div>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {scheduleEnrollment.map((se) => (
                    <tr key={se.enrollmentId}>
                        <td>{se.grade}</td>
                        <td>{se.studentId}</td>
                        <td>{se.courseId}</td>
                        <td>{se.title}</td>
                        <td>{se.sectionId}</td>
                        <td>{se.building}</td>
                        <td>{se.room}</td>
                        <td>{se.times}</td>
                        <td>{se.credits}</td>
                        <td><Button id={`deleteBtn-${se.enrollmentId}`} onClick = {deleteAlert}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}

export default ScheduleView;
