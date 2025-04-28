/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useDrivePicker from "react-google-drive-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, faBell, faSearch, faPlus, 
  faQuestionCircle, faChartBar, faSignOutAlt, 
  faUser, faAngleLeft, faAngleRight 
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({
  setStudentDocumentsUpload,
  setDocumentUpLoad,
  setGenerateQuery,
  setSeeNotifications,
  setSelectedClassId,
  setOpenFacultyAdminDocuments,
  setIsCollapsed,
  isCollapsed,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openPicker, setOpenPicker] = useDrivePicker();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const logoutFunction = () => {
    logout();
  };

  const handleOpenPicker = () => {
    openPicker({
      clientId: "YOUR_CLIENT_ID",
      developerKey: "YOUR_DEVELOPER_KEY",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.docs) setSelectedFiles(data.docs);
      }
    });
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => saveFileData(file));
      setSelectedFiles([]);
    }
  }, [selectedFiles]);

  const saveFileData = async (file) => {
    try {
      const res = await fetch("/api/database/addDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docObj: file }),
      });
      await res.json();
    } catch (error) {
      console.error("Error in saving data:", error);
    }
  };

  // Style Objects
  const sidebarStyle = {
    width: isCollapsed ? "70px" : "250px",
    background: "#1e293b",
    color: "#fff",
    minHeight: "100vh",
    transition: "width 0.3s",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    paddingTop: "20px",
    zIndex: 1000,
  };

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.2s",
  };

  const iconStyle = {
    marginRight: isCollapsed ? "0" : "12px",
    fontSize: "20px",
  };

  const toggleButtonStyle = {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    padding: "10px 20px",
    textAlign: "left",
    width: "100%",
  };

  const userSectionStyle = {
    marginBottom: "30px",
    padding: "0 20px",
    textAlign: isCollapsed ? "center" : "left",
  };

  const userNameStyle = {
    fontWeight: "bold",
    fontSize: "18px",
    marginTop: "8px",
    display: isCollapsed ? "none" : "block",
  };

  const userEmailStyle = {
    fontSize: "14px",
    color: "#cbd5e1",
    marginTop: "4px",
    display: isCollapsed ? "none" : "block",
  };

  return (
    <div style={sidebarStyle}>
      {/* Toggle button */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} style={toggleButtonStyle}>
        <FontAwesomeIcon icon={isCollapsed ? faAngleRight : faAngleLeft} />
      </button>

      {/* User Section */}
      {authUser && (
        <div style={userSectionStyle}>
          <FontAwesomeIcon icon={faUser} style={{ fontSize: "32px" }} />
          <div style={userNameStyle}>{authUser.username}</div>
          <div style={userEmailStyle}>{authUser.email}</div>
        </div>
      )}

      {/* Menu Items */}
      <div onClick={() => {
        navigate("/");
        setStudentDocumentsUpload(false);
        setDocumentUpLoad(false);
        setGenerateQuery(false);
        setSeeNotifications(false);
        setSelectedClassId(null);
        setOpenFacultyAdminDocuments(false);
      }} style={menuItemStyle}>
        <FontAwesomeIcon icon={faHome} style={{ ...iconStyle, color: "#38bdf8" }} />
        {!isCollapsed && "Home"}
      </div>

      <div onClick={() => {
        setSeeNotifications(true);
        setStudentDocumentsUpload(false);
        setDocumentUpLoad(false);
        setGenerateQuery(false);
        setSelectedClassId(null);
        setOpenFacultyAdminDocuments(false);
      }} style={menuItemStyle}>
        <FontAwesomeIcon icon={faBell} style={{ ...iconStyle, color: "#facc15" }} />
        {!isCollapsed && "Notifications"}
      </div>

      <div onClick={() => {
        setStudentDocumentsUpload(true);
        setDocumentUpLoad(false);
        setGenerateQuery(false);
        setSeeNotifications(false);
        setSelectedClassId(null);
        setOpenFacultyAdminDocuments(false);
      }} style={menuItemStyle}>
        <FontAwesomeIcon icon={faSearch} style={{ ...iconStyle, color: "#4ade80" }} />
        {!isCollapsed && "Student-Community"}
      </div>

      <div onClick={handleOpenPicker} style={menuItemStyle}>
        <FontAwesomeIcon icon={faPlus} style={{ ...iconStyle, color: "#f472b6" }} />
        {!isCollapsed && "Add Document"}
      </div>

      <div onClick={() => {
        setGenerateQuery(true);
        setStudentDocumentsUpload(false);
        setDocumentUpLoad(false);
        setSeeNotifications(false);
        setSelectedClassId(null);
        setOpenFacultyAdminDocuments(false);
      }} style={menuItemStyle}>
        <FontAwesomeIcon icon={faQuestionCircle} style={{ ...iconStyle, color: "#60a5fa" }} />
        {!isCollapsed && "Query"}
      </div>

      <div onClick={() => {
        setOpenFacultyAdminDocuments(true);
        setStudentDocumentsUpload(false);
        setDocumentUpLoad(false);
        setGenerateQuery(false);
        setSeeNotifications(false);
        setSelectedClassId(null);
      }} style={menuItemStyle}>
        <FontAwesomeIcon icon={faChartBar} style={{ ...iconStyle, color: "#34d399" }} />
        {!isCollapsed && "Result"}
      </div>

      <div onClick={logoutFunction} style={menuItemStyle}>
        <FontAwesomeIcon icon={faSignOutAlt} style={{ ...iconStyle, color: "#f87171" }} />
        {!isCollapsed && "Logout"}
      </div>
    </div>
  );
};

export default Sidebar;
