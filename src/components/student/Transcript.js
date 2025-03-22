import React, {useState, useEffect} from 'react';
import {SERVER_URL} from "../../Constants";

// students gets a list of all courses taken and grades
// use the URL /transcripts?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
     const headers = ['Year', 'Semester', 'CourseId', 'SectionId', 'Title', 'Credits', 'Grade'];
     const[enrollment,setEnrollment] = useState([]);
     const [message,setMessage] = useState('');


     const fetchEnrollment = async() => {
         try {
             const studentId = 3;
             const response = await fetch(`${SERVER_URL}/transcripts?studentId=${studentId}`);
             if(response.ok)
             {
                 const courses_taken = await response.json()
                 setEnrollment(courses_taken);
             } else {
                 const json = await response.json();
                 setMessage("response error: " + json.message);
             }
         } catch (err) {
             setMessage("network error: " + err);
         }
     }

     useEffect(() => {
         fetchEnrollment();
     },[]);

    return(
        <div>
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {enrollment.map((e) => (
                    <tr key={e.enrollmentId}>
                        <td>{e.year}</td>
                        <td>{e.semester}</td>
                        <td>{e.courseId}</td>
                        <td>{e.sectionId}</td>
                        <td>{e.title}</td>
                        <td>{e.credits}</td>
                        <td>{e.grade}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transcript;
