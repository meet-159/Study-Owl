// FacultyAdminDocuments.jsx
import { useEffect, useState } from "react";
import "./facultyAdminDocuments.css"; 
const FacultyAdminDocuments = () => {
  const [facultyDocs, setFacultyDocs] = useState([]);
  const [adminDocs, setAdminDocs] = useState([]);
  const [joinedClassIds, setJoinedClassIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch joined classes first
  const fetchJoinedClasses = async () => {
    try {
      const res = await fetch("/api/classes/joined", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch joined classes");
      }

      const classIds = (data.joinedClasses || []).map((cls) => cls._id);
      setJoinedClassIds(classIds);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/database/getFacultyAndAdminDocs", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
console.log(data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch documents");
      }

      setFacultyDocs(data.facultyDocs || []);
      setAdminDocs(data.adminDocs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchJoinedClasses();
      await fetchDocuments();
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
console.log(facultyDocs);

  const filteredFacultyDocs = facultyDocs.filter(doc => {
     if (!doc.userId || doc.userId.userType !== "faculty") return false;
  
    const enrolledClasses = doc.userId.enrolledClasses || [];
  
    // Check if any of the enrolledClasses matches joinedClassIds
    return enrolledClasses.some(classId => joinedClassIds.includes(classId.toString()));
  });


  

  const filteredAdminDocs = adminDocs.filter(doc => {
    return doc.userId && doc.userId.userType === "admin";
  });
  console.log(filteredAdminDocs);
  const filteredDocuments = [...filteredAdminDocs, ...filteredFacultyDocs];

  return (
  <div style={{maxHeight:"100vh",}}>
  <h2>Documents Uploaded By Faculty and Admin</h2>
<div className="document-grid" >
  {filteredDocuments.map((doc) => (
    <div key={doc._id} className="document-card">
      <h3>{doc.docObj.name || "Untitled"}</h3>
      <h4><span>By~</span>{doc.userId.username}</h4>
      <p>{doc.docObj.description || "No description"}</p>
      {doc.docObj.url && (
        <a href={doc.docObj.url} target="_blank" rel="noopener noreferrer">
          View Document
        </a>
      )}
    </div>
  ))}
</div>
</div>
  );
};

export default FacultyAdminDocuments;
