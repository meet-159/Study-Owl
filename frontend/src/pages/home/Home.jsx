/* eslint-disable react/prop-types */
import { useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import SuggestClasses from "../../components/class/student/suggestClasses/SuggestClasses.jsx";
import JoinedClassByStudent from "../../components/class/student/JoinedClassByStudent.jsx";
import HomeDocView from "../../components/homeDocView/homeDocView.jsx";
import AssignedClassToTeacher from "../../components/class/teacher/AssignedClassToTeacher.jsx";
import AssignRemoveTeacher from "../../components/class/admin/AssignRemoveTeacher.jsx";
import ClassDetails from "../../components/class/common/ClassDetails.jsx";
import GetStudentDocuments from "../../components/class/student/GetStudentDocuments.jsx";
import RaiseQueryForm from "../../components/query/RaiseQueryForm.jsx";
import Notifications from "../../components/Notifications/Notifications.jsx";
import FacultyAdminDocuments from '../../components/homeDocView/FacultyAdminDocuments.jsx';

const Home = ({ userType }) => {
  const [documentUpload, setDocumentUpload] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [studentDocumentsUpload, setStudentDocumentsUpload] = useState(false);
  const [generateQuery, setGenerateQuery] = useState(false);
  const [seeNotifications, setSeeNotifications] = useState(false);
  const [openFacultyAdminDocuments, setOpenFacultyAdminDocuments] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const renderMainContent = () => {
    if (seeNotifications) return <Notifications />;
    if (generateQuery) return <RaiseQueryForm />;
    if (studentDocumentsUpload) return <GetStudentDocuments />;
    if (openFacultyAdminDocuments) return <FacultyAdminDocuments />;

    return (
      <>
        {userType === "student" && !documentUpload && (
          <>
            <SuggestClasses refreshTrigger={refreshTrigger} triggerRefresh={triggerRefresh} />
            <JoinedClassByStudent setSelectedClassId={setSelectedClassId} refreshTrigger={refreshTrigger} triggerRefresh={triggerRefresh} />
          </>
        )}
        {userType === "faculty" && !documentUpload && (
          <AssignedClassToTeacher setSelectedClassId={setSelectedClassId} />
        )}
        {userType === "admin" && !documentUpload && (
          <AssignRemoveTeacher setSelectedClassId={setSelectedClassId} selectedClassId={selectedClassId} />
        )}
        {!documentUpload && (
          <button
            onClick={() => setDocumentUpload(true)}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50"
          >
            Upload Documents
          </button>
        )}
        {documentUpload && <HomeDocView />}
      </>
    );
  };

// Styles
const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
  background: "#f8fafc",
};

const sidebarStyle = {
  flexShrink: 0,
  width: isSidebarCollapsed ? "70px" : "250px",
  transition: "width 0.3s",
  // background: "#1e293b",
  color: "white",
};

const mainContentStyle = {
  flexShrink: 0,
  flexBasis:selectedClassId ? (isSidebarCollapsed  ? "70%" : "50%"):(isSidebarCollapsed  ? "90%" : "70%"),  
  padding: "20px",
  overflowY: "auto",
  transition: "all 0.3s",
};

const rightPanelStyle = {
  flexShrink: 0,
  width: isSidebarCollapsed ? "25%" : "30%", 
  
  padding: "20px",
  display: window.innerWidth < 768 ? "none" : "block",
  transition: "all 0.3s",
};


  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle} >
        <Sidebar
          setStudentDocumentsUpload={setStudentDocumentsUpload}
          setDocumentUpLoad={setDocumentUpload}
          setGenerateQuery={setGenerateQuery}
          setSeeNotifications={setSeeNotifications}
          setSelectedClassId={setSelectedClassId}
          setOpenFacultyAdminDocuments={setOpenFacultyAdminDocuments}
          setIsCollapsed={setIsSidebarCollapsed} 
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {renderMainContent()}
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        {selectedClassId && (
          <div style={{ background: "#f1f5f9",}}>
            <ClassDetails classId={selectedClassId} />
            <div style={{ textAlign: "center", marginTop: "10px" ,}}>
              <button 
                onClick={() => setSelectedClassId(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Ok
              </button>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
};

export default Home;
