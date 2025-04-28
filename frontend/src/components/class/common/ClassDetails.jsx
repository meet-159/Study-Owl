/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import "./classDetails.css";

function ClassDetails(props){
    const classId = props.classId;
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (classId === null) return;
  
      const fetchClassDetails = async () => {
        try {
          const response = await fetch(`/api/classes/${classId}`);
          const data = await response.json();
  
          if (response.ok) {
            setClassData(data);
          } else {
            console.error(data.message || "Failed to fetch class details");
          }
          console.log(data);
          
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchClassDetails();
    }, [classId]);
  
    if (loading) return <div>Loading...</div>;
    if (!classData) return <div>Class not found</div>;
  
    return (
      <div className="class-details-container">
        <h2>Class Details</h2>
        <p><strong>Course:</strong> {classData.name}</p>
        <p><strong>Semester:</strong> {classData.sem}</p>
        <div>
          <strong>Faculty:</strong>
          <ul>
            {classData.teacher?.length ? (
              classData.teacher.map((fac) => (
                <li key={fac._id}>{fac.username} ({fac.email})</li>
              ))
            ) : (
              <li>No faculty assigned</li>
            )}
          </ul>
        </div>
        <div>
          <strong>Students:</strong>
          <ul>
            {classData.students?.length ? (
              classData.students.map((s) => (
                <li key={s._id}>{s.username} ({s.email})</li>
              ))
            ) : (
              <li>No Student joined</li>
            )}
          </ul>
        </div>
      </div>
    );
  };
  

export default ClassDetails;
