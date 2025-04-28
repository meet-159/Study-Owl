import { useEffect, useState } from "react";
import "./notifications.css"

// Function to fetch notifications for the user
const fetchNotifications = async (setNotifications, setLoading, setError) => {
  setLoading(true);
  try {
    const response = await fetch('/api/notifications/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("notifed=",data);
    
    if (response.ok) {
      setNotifications(data);
    } else {
      setError(data.error || "Failed to fetch notifications");
    }
  } catch (error) {
    console.log(error.message);
    setError("Failed to fetch notifications due to network error");
  } finally {
    setLoading(false);
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications(setNotifications, setLoading, setError);
  }, []);

  return (
    <div className="notifications-container">
    <h2>Your Notifications</h2>
    {loading ? (
      <p>Loading notifications...</p>
    ) : error ? (
      <div>
        <p>{error}</p>
        <button onClick={() => fetchNotifications(setNotifications, setLoading, setError)}>
          Retry
        </button>
      </div>
    ) : notifications.length > 0 ? (
      <div className="notifications-list">
      {notifications.map((notification) => (
  <div key={notification._id} className="notification-box">
    {/* Header with from and to */}
    <div className="notification-header">
      {notification.type==="share" ? (<><h3>Document Shared</h3></>): (<><div className="user-info">
        <strong>From:</strong> {notification.fromUser.username} (<span className="email">{notification.fromUser.email}</span>)
      </div>
      <div className="user-info">
        <strong>To:</strong> {notification.toUser.username} (<span className="email">{notification.toUser.email}</span>)
      </div></>)}
    </div>

    {/* Metadata */}
    <div className="notification-meta">
      <span className="date">{new Date(notification.createdAt).toLocaleString()}</span>
      <span className="type">{notification.type}</span>
    </div>

    {/* Message */}
    <div className="notification-message">
      <p>{notification.message}</p>
    </div>
  </div>
))}

      </div>
    ) : (
      <p>No notifications yet</p>
    )}
  </div>
  );
};

export default Notifications;
