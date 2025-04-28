import {  useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

const SignUp = () => {
  const queryClient = useQueryClient();
  const [formData,setFormData] =useState({
    username:"",
    email:"",
    password:"",
    userType:"student"
  })

  const {mutate} = useMutation({
    mutationFn:async({email,username,password,userType})=>{
      try {
        const res = await fetch("/api/auth/Signup",{
          method:"POST",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify({email,username,password,userType})
        });
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Failed to sign up");
        }
        console.log(res);
        
      } catch (error) {
        console.log(error);
        throw error;
        
        
      }
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["authUser"]});
      alert("SIgnUp Successfull");
    },
    onError:(error)=>{
      alert(error.message);
    }
  })

  const handleInputChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
    
  }

  const handleFormData=(e)=>{
    e.preventDefault();
    mutate(formData);
    console.log(formData);
    
    
  }

  return (
    <div className="container">
    <div className='login-box'>
    <h1>Study Owl</h1>
      <form onSubmit={handleFormData}>
        <input name="username" type="text" placeholder="username" onChange={handleInputChange} value={formData.username}/>
        <input name='email' type="text" placeholder="email" onChange={handleInputChange} value={formData.email} />
        <input name='password' type="password" placeholder="Password" onChange={handleInputChange}  value={formData.password}/>
        {/*<input name='userType' type="text" placeholder="userType" onChange={handleInputChange} value={formData.userType} />*/}
         <select name='userType' onChange={handleInputChange} value={formData.userType}>
        <option >student</option>
        <option >faculty</option>
        <option >admin</option>
    </select> 
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </div>
  )
}

export default SignUp