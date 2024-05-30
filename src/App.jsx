/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
import Navbar from "./Componenetes/Navbar";
import './app.css'
import React, { useEffect, useState } from 'react';
import Home from "./pages/Home"
import Post from "./pages/Post";
import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";

const App = () => {
    const [user,setUser] = useState(null)

    useEffect(()=>{
        const getUser = async ()=>{
            
        fetch("http://localhost:5000/auth/login/success", {
                method:"GET",
                credentials: "include",
                headers:{
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            }).then(reponse=>{
                if(reponse.status === 200) return reponse.json();
                throw new Error("authentication has been failed!")
            }).then(resObject=>{
              setUser(resObject.user);
            })
            .catch((err) => {
                console.log(err);
            });
        };
        getUser();
    },[]);

    console.log(user)

    return (
        <BrowserRouter>
    <div>
        <Navbar user={user}/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route 
            path="/login" 
            element={user ? <Navigate to= "/"/> : <Login />}
             />
            <Route
             path="/post/:id"
             element={user ? <Post/> : <Navigate to ="/login" />} />
        </Routes>
    </div>
    </BrowserRouter>
    );
};

export default App;