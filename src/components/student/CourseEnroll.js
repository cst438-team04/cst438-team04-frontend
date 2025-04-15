import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button'
import {GRADEBOOK_URL, SERVER_URL} from "../../Constants";

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
     const [openCourses, setOpenCourses] = useState([]);
     const headers = ['Year', 'Semester', 'CourseId','Title','Building','Room','Times','Instructor Name', 'Enroll']
     const[message,setMessage] = useState('');

     const fetchOpenCourses = async () => {
         try {
             const response = await fetch(`${SERVER_URL}/sections/open`);
             if(response.ok) {
                 const courses = await response.json();
                 setOpenCourses(courses);
             } else {
                 const json = await response.json();
                 setMessage("response error: " + json.message);
             }
         } catch (err) {
                 setMessage("network error: " + err);
             }
         };

     useEffect(()=> {
         fetchOpenCourses();
         }, []);

     const enrollInCourse = async (secNo) => {
         try {
             const response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' }
             });
             const contentType = response.headers.get("content-type");
             if(response.ok) {
                 setMessage(`Successfully enrolled in section ${secNo}`);
                 fetchOpenCourses();
             } else {
                 if(contentType && contentType.includes("application/json"))
                 {
                     const json = await response.json();
                     setMessage("Error enrolling: " + json.message);
                 } else {
                     const text = await response.text();
                     setMessage("Error enrolling" + text);
                 }

             }
         } catch (err) {
             setMessage("network error " + err)
         }
     }
 
    return(
        <div>
            <h3>Open Courses</h3>
            <h4 id="enrollMessage">{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {openCourses.map((o) => (
                    <tr key={o.secNo}>
                        <td>{o.year}</td>
                        <td>{o.semester}</td>
                        <td>{o.courseId}</td>
                        <td>{o.title}</td>
                        <td>{o.building}</td>
                        <td>{o.room}</td>
                        <td>{o.times}</td>
                        <td>{o.instructorName}</td>
                        <td>
                            <Button
                                id={`enrollBtn-${o.secNo}`}
                                variant="contained"
                                color="primary"
                                onClick={() => enrollInCourse(o.secNo)}
                            >Enroll</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;
