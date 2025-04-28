import {Routes,Route, Navigate} from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import "./App.css"
import Login from "./pages/auth/login/LogIn.jsx"
import SignUp from "./pages/auth/signUp/SignUp.jsx";
import Home from "./pages/home/Home.jsx";
import { useState } from "react";

function App() {
  const [userType, setUserType]=useState("student");
  const {data:authUser, isLoading}=useQuery({
    queryKey:["authUser"],
    queryFn: async()=>{
      try {
        const res = await fetch("/api/auth/getMe");
        const data = await res.json();
        if(data.error){
          return null;
        }
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
          
        }
        setUserType(data.userType);
        
        return(data);
      } catch (error) {
        throw new Error(error);
      }
    },
    retry:false,
  });

  if(isLoading){
    return(
      <div >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border
        border-green-400"></div>
      </div>
    )
  }
  return (
      <Routes>
      <Route path="/" element={authUser?<Home userType={userType} />:<Navigate to="/login"/> } />
      <Route path="/signUp" element={!authUser ? <SignUp />:<Navigate to ="/" />} />
      <Route path="/login" element={!authUser? <Login /> : <Navigate to="/" />} />
      
      </Routes>

  );
}

export default App;
