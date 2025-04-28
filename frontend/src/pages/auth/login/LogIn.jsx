import React, { useState } from 'react';
import "./Login.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from 'react-router-dom';

const Login = () => { 
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: ""
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ usernameOrEmail, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usernameOrEmail, password })
        });

        const data = await res.json();
        console.log(data);
        
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Login Success");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();
    mutate(formData);  
    console.log("FORM SUBMITTED", formData);
  };

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Study Owl</h1>
        <form onSubmit={handleSubmitForm}>
          <input 
            type="text"
            placeholder="Username or email" 
            name="usernameOrEmail" 
            value={formData.usernameOrEmail} 
            onChange={handleFormData} 
            required 
            autoComplete="off" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={formData.password} 
            onChange={handleFormData} 
            required  
            autoComplete="off" 
          />
          <button type="submit">{isPending ? "Loading..." : "Log In"}</button>
        </form>

        <div className="divider"><span>OR</span></div>
        <br />
        <a href="/" className="forgot-password">Forgot password?</a>
        <div className="signup" >
          <p>Don't have an account? 
          <Link to="/signup">
            Sign Up
          </Link>
          </p>
        </div>

        {isError && <p className="error">{error.message || "Something went wrong"}</p>}
      </div>
    </div>
  );
};

export default Login;
