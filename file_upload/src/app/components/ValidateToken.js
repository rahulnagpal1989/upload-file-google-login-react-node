import { useEffect } from "react";
import axios from "axios";

export default function ValidateToken() {
    const validate = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/validateToken`, {}, 
              {headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem("token") }})
              .then(function (response) {
                if(response.data.tokenExpired === true) {
                    localStorage.removeItem("token");
                } else if(response.data.refreshRequired === true) {
                    localStorage.setItem("token", response.data.access_token);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
    };
    useEffect(()=>{
        if(localStorage.getItem("token")) {
            validate();
        }
    }, []);
    
    return (
        <>
        </>
    );
}