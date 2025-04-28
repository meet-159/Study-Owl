import { useEffect, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { useQuery } from "@tanstack/react-query";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPicker, setOpenPicker] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);
  
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

      alert(NotificationMessage);
    } catch (error) {
      console.error(error);
      alert("Error sending notificaiton!");
    }
  }


  const handleOpenPicker = () => {
    openPicker({
      clientId:"YOUR_CLIENT_ID",
      developerKey: "YOUR_DEVELOPER_KEY",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.docs) {
          console.log(data.docs[0]);
          setSelectedFiles(data.docs);
        }
      },
    });
  };

  const saveFileData = async (file) => {
    try {
      const res = await fetch("/api/database/addDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docObj: file }),
      });
      const data = await res.json();
      console.log(data);
      generateNotification(authUser._id,"share","You shared a Document");//notify to yourself that you uploaded a document
    } catch (error) {
      console.log("error in saving data : ", error);
    }
  };

  useEffect(() => {}, [selectedFiles]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => saveFileData(file));
      setSelectedFiles([]);
    }
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/database/getAll", {
          method: "GET",
        });
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedFiles]);

  const handleDocumentUpload = async () => {
    try {
      const response = await fetch("/api/database/getAll", {
        method: "GET",
      });
      const data = await response.json();
      console.log("response is : ", data);
      setDocuments(data);
    } catch (error) {
      console.error("Error updating document list:", error);
    }
  };

  const handleDocumentClick = async (id) => {
    try {
      const response = await fetch(`/api/database/getDoc/${id}`);
      console.log("Document Details:", await response.json());
    } catch (error) {
      console.error("Error fetching document details:", error);
    }
  };

  
  return (
    <>
  <h2>Document List Section</h2>
  <div style={{textAlign:"center"}}>
    <button
      onClick={handleOpenPicker}
      style={{
        margin:'20px 10px',
        width:"30%",
      }}
    >
      📂 ADD Docs
    </button>
    <button
      onClick={handleDocumentUpload}
      style={{
        margin:'20px 10px',
        width:"30%",
      }}
    >
      🔄 Refresh List
    </button>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="document-grid"
      >
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          documents.map((doc, index) => (
            <div
              key={index} 
              className="document-card"
              onClick={() => handleDocumentClick(doc._id)}
            >
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>{doc.docObj.name}</p>
              <p style={{ fontSize: "14px", color: "#666" }}>{doc.uploadedAt}</p>
              <a
                target="_blank" rel="noopener noreferrer"
                href={doc.docObj.url}
              >
                View Document
              </a>
            </div>
          ))
        )}
      </div>
    )}
  </div>


</>
  );
};

export default DocumentList;

