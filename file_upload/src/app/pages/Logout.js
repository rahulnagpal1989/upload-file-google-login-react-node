import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    
    if(localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
    
    useEffect(() => {
        navigate("/");
    });
    
    return (
        <>
        </>
    );
}