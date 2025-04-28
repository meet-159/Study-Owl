/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./suggestedClasses.css";

const SuggestClasses = ({ refreshTrigger, triggerRefresh }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: authUser } = useQuery({queryKey:["authUser"]});

  const fetchSuggestedClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/classes/suggest", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch classes");

      setClasses(data.suggestedClasses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchSuggestedClasses();
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

  const handleJoin = async (classId) => {
    try {
      const res = await fetch(`/api/classes/joinClass/${classId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join class");

     triggerRefresh();
     generateNotification(authUser._id,"notify",`${data.message}: ${data.class.name}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (classes.length === 0) return <p></p>;

  return (
    <div className="suggest-classes-container" style={{maxHeight:"100vh"}}>
      <h2>Suggested Classes</h2>
      {classes.map((cls) => (
        <div key={cls._id} className="class-box">
          <h2 className="class-title">{cls.name}</h2>
          <p><strong>Semester:</strong> {cls.sem}</p>
          <p><strong>Teacher:</strong> {cls.faculty || "Not assigned"}</p>
          <div className="button-group" style={{ textAlign: "right" }}>
            <button className="join-btn" onClick={() => handleJoin(cls._id)}>Join Class</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestClasses;
