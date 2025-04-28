/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./AssignedClassToTeacher.css";

const AssignedClassToTeacher = ({setSelectedClassId}) => {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [error, setError] = useState(null);

  const fetchAssignedClasses = async () => {
    try {
      const res = await fetch("/api/classes/assigned", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch assigned classes");
      }

      setAssignedClasses(data.assignedClasses || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAssignedClasses();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="assigned-classes-container">
    <h2>Assigned Classes</h2>
      {assignedClasses.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        assignedClasses.map((cls) => (
          <div
            id={cls._id}
            key={cls._id}
            className="assigned-class-box"
            onClick={()=>setSelectedClassId(cls._id)} // ✅
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
        ))
      )}
    </div>
  );
};

export default AssignedClassToTeacher;
