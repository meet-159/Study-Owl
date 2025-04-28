import React, { useState , useEffect} from "react";
import useDrivePicker from "react-google-drive-picker";

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPicker, setOpenPicker] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleOpenPicker = () => {
    openPicker({
      clientId:"100795202056-qcufv9p0uouef0l8fjhkta7p46g3jlk6.apps.googleusercontent.com",
      developerKey: "AIzaSyCJ_jqw20SrnO4Eq_Llmpml4kWzU-0Quv0",
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
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button onClick={handleOpenPicker} style={{ marginBottom: "20px" }}>
        Open Picker
      </button>

     
    </div>
  );
}
export default App.handleOpenPicker;