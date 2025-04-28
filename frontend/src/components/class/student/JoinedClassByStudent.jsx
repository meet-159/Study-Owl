/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./JoinedClassByStudent.css";

const JoinedClassByStudent = ({ setSelectedClassId, refreshTrigger, triggerRefresh  }) => {
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: authUser } = useQuery({queryKey:["authUser"]});

  const fetchJoinedClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/classes/joined", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch joined classes");

      setJoinedClasses(data.joinedClasses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJoinedClasses();
  }, [refreshTrigger]);

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

      alert(NotificationMessage);
    } catch (error) {
      console.error(error);
      alert("Error sending notificaiton!");
    }
  }

  const handleLeave = async (classId) => {
    try {
      const res = await fetch(`/api/classes/leaveClass/${classId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to leave class");

      triggerRefresh(); 
      generateNotification(authUser._id,"notify",`${data.message}: ${data.class.name}`)
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading joined classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="joined-classes-container" style={{maxHeight:"100vh"}}>
      <h2>Joined Classes</h2>
      {joinedClasses.length === 0 ? (
        <p>You have not joined any classes yet.</p>
      ) : (
        joinedClasses.map((cls) => (
          <div
            key={cls._id}
            className="joined-class-box"
            onClick={() => setSelectedClassId(cls._id)}
          >
            <h2>{cls.name}</h2>
            <p><strong>Semester:</strong> {cls.sem}</p>
            <div>
              <strong>Faculty:</strong>
              {cls.teacher && cls.teacher.length > 0 ? (
                <ol>
                  {cls.teacher.map((f) => (
                    <li key={f._id}>{f.username} ({f.email})</li>
                  ))}
                </ol>
              ) : (
                <p>No faculty assigned</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                style={{ width: "30%" }}
                className="leave-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering class selection
                  handleLeave(cls._id);
                }}
              >
                Leave Class
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JoinedClassByStudent;
