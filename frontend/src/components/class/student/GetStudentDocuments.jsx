import { useEffect, useState } from "react";

const GetStudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const fetchStudentDocuments = async () => {
    try {
      const res = await fetch("/api/database/student-documents", {
        method: "POST",
      });

      const data = await res.json();
     
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch documents");
      }
      
      setDocuments(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStudentDocuments();
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (documents.length === 0) return <div>No documents uploaded yet.</div>;

  const handleDocumentClick = async (id) => {
    try {
      const response = await fetch(`/api/database/getDoc/${id}`);
      console.log("Document Details:", await response.json());
    } catch (error) {
      console.error("Error fetching document details:", error);
    }
  };

  return (
    <div className="p-4" style={{maxHeight:"100vh",}}>
      <h2 className="text-2xl font-bold mb-4">Student Documents</h2>

      <div className="document-grid">
        {documents.map((doc,index) => (
          
            <div
              key={index}
              className="document-card"
              onClick={() => handleDocumentClick(doc._id)}
            >
              <h3 className="text-lg font-semibold">Uploaded by: {doc.userId.username || "Unknown Student"}</h3>
              <span>({doc.userId.email})</span>
              <p>sem: {doc.userId.sem}</p>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>{doc.docObj.name}</p>
              <p style={{ fontSize: "14px", color: "#666" }}>{doc.uploadedAt}</p>
              <a
                target="_blank" rel="noopener noreferrer"
                href={doc.docObj.url}
              >
                 View Document
              </a>
            </div>

        ))}
        </div>

    </div>
  );
};

export default GetStudentDocuments;
