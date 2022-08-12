import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginRequired() {
    const navigate = useNavigate();

    useEffect(()=>{
        if( !localStorage.getItem("token")) {
            navigate("/");
        }
    });
    
    return (
        <>
        </>
    );
}