/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "./AssignRemoveTeacher.css";

const AssignRemoveTeacher = ({ setSelectedClassId , selectedClassId}) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedClass , setSelectedClass] = useState(null);
  const [classes,setClasses] = useState([]);

  const { data: authUser } = useQuery({queryKey:["authUser"]});

  // 🔄 Fetch all teachers (optional: adjust API endpoint if needed)
  const fetchAllTeachers = async () => {
    try {
      const res = await fetch("/api/auth/getTeacherAndAdmins", {
        credentials: "include",
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Error fetching teachers");
      setTeachers(data.teachers || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  async function generateNotification(to,type,NotificationMessage){
    try {
      const res = await fetch("/api/notifications/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: to,
          type: type,
          message: NotificationMessage,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send query");
    } catch (error) {
      console.error(error);
      alert("Error sending notificaiton!");
    }
  }

  const handleAssign = async () => {
    try {
      const res = await fetch(`/api/classes/${selectedClassId}/assign-teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ teacherId: selectedTeacher }),
      });
      
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
      generateNotification(selectedTeacher,"notify",`admin assigned a new class: ${data.class.name}`);
      generateNotification(authUser._id,"notify",`Teacher Assigned to: ${data.class.name} successfully`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async () => {
    try {
      const res = await fetch(`/api/classes/${selectedClassId}/remove-teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ teacherId: selectedTeacher }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
      generateNotification(selectedTeacher,"notify",`admin un-assigned a class: ${data.class.name}`);
      generateNotification(authUser._id,"notify",`Teacher Un-Assigned from: ${data.class.name} successfully`);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAllClass = async () => {
    try {
      const res = await fetch("/api/classes/", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch assigned classes");
      }

      setClasses(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAllClass();
  }, []);


  return (!selectedClassId ? (
    <div className="assigned-classes-container">
      {classes.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <>
          <h3 style={{textAlign:"center"}}>Select a Class to Assign/Remove Faculty</h3>
          {classes.map((cls) => (
            <div
              id={cls._id}
              key={cls._id}
              className="assigned-class-box"
              onClick={() => {setSelectedClassId(cls._id);
                                setSelectedClass(cls);}}
            >
              <h2>{cls.name}</h2>
              <p><strong>Semester:</strong> {cls.sem}</p>
              <p>
                <strong>Total Students:</strong>
                <ol>
                  {cls.students && cls.students.length > 0 ? (
                    cls.students.map((f) => (
                      <li key={f._id}>
                        {f.username} ({f.email})
                      </li>
                    ))
                  ) : (
                    <p>No students joined</p>
                  )}
                </ol>
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  ) : (
    selectedClassId && (
      <div className="assign-remove-container">
        <h2>Assign or Remove Teacher</h2>
        
        <h3>{selectedClass.name}</h3>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.username} ({teacher.email})
            </option>
          ))}
        </select>
  
        <div className="buttons">
          <button onClick={handleAssign} disabled={!selectedTeacher}>
            Assign Teacher
          </button>
          <button onClick={handleRemove} disabled={!selectedTeacher}>
            Remove Teacher
          </button>
        </div>
  
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    )
  ));

};
export default AssignRemoveTeacher;