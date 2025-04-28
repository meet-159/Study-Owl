import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./raiseQuery.css"

const RaiseQueryForm = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [teacherAdminData, setTeacherAdminData] = useState({ teachers: [], admins: [] });
  const [userType, setUserType] = useState(""); // faculty or admin
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: authUser } = useQuery({queryKey:["authUser"]});

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

  // Fetch teachers and admins when component mounts
  useEffect(() => {
    const getTeacherAndAdmins = async () => {
      try {
        const res = await fetch("/api/auth/getTeacherAndAdmins", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });

        const data = await res.json();
        setTeacherAdminData(data);
      } catch (error) {
        console.error(error);
      }
    };

    getTeacherAndAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUserId) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/notifications/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: selectedUserId,
          type: "query",
          message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send query");

      generateNotification(authUser._id,"query",`query sent to ${userType} \nquery: ${message}`)
      alert("Query sent successfully!");
      setMessage("");
      setUserType("");
      setSelectedUserId("");
    } catch (error) {
      console.error(error);
      alert("Error sending query!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="raise-query-form-container">
  <div className="raise-query-form">
    <h2 className="form-title">Raise a Query</h2>

    {/* User Type Selection */}
    <div className="form-group">
      <label className="form-label">Query for Admin/Faculty</label>
      <select
        value={userType}
        onChange={(e) => {
          setUserType(e.target.value);
          setSelectedUserId("");
        }}
        className="form-input"
        required
      >
        <option value="">-- Select --</option>
        <option value="faculty">Faculty</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    {/* Specific User Selection */}
    {userType && (
      <div className="form-group">
        <label className="form-label">
          Select {userType === "faculty" ? "Faculty" : "Admin"}:
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="form-input"
          required
        >
          <option value="">-- Select --</option>
          {(userType === "faculty"
            ? teacherAdminData.teachers
            : teacherAdminData.admins
          )?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Message TextArea */}
    <div className="form-group">
      <label className="form-label">Message:</label>
      <textarea
        className="form-textarea"
        placeholder="Write your query here..."
        rows="5"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="submit-button"
    >
      {loading ? "Sending..." : "Send Query"}
    </button>
  </div>
</form>

  );
};

export default RaiseQueryForm;
