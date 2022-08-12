import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

//Google Login: https://www.youtube.com/watch?v=roxC8SMs7HU

export default function Login() {
    const navigate = useNavigate();
    const[signupFlag, setSignupFlag] = useState(false);
    const[validateFlag, setValidateFlag] = useState(true);
    const[loadingFlag, setLoadingFlag] = useState(false);
    const[fullName, setFullName] = useState('');
    const[emailId, setEmailId] = useState('');
    const[emailVerified, setEmailVerified] = useState('');

  const signup = () => {
    setSignupFlag(false);
    setLoadingFlag(true);
    axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
      full_name: fullName,
      email_id: emailId,
      email_verify: emailVerified
    }, {headers: { 'Content-Type': 'application/json' }})
    .then(function (response) {
        if(response.data.access_token!=='') {
            localStorage.setItem("token", response.data.access_token);
        }
        setLoadingFlag(false);
        navigate("/");
        return response;
    })
    .catch(function (error) {
        setLoadingFlag(false);
        return error;
    });
  };

  useEffect(() => {
    if(signupFlag) {
      signup();
    }
    if(validateFlag) {
        redirectToPage('/');
    }
  });
  
  const redirectToPage = (page) => {
    setValidateFlag(false);
    if(localStorage.getItem("token")) {
        navigate(page);
    }
  };

  return (
    <div align="center">
        <Navbar loadingFlag={loadingFlag} />
        Login with Google!
        <br/>
      {localStorage.getItem("token") ? '' : (
        <>
            <div style={{display:'inline-block'}}>
                <GoogleOAuthProvider clientId="251664673944-6d2uf98h16vir1iq9t7cdauvgt63rm29.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                      var userObject = jwt_decode(credentialResponse.credential);
                      setFullName(userObject.name);
                      setEmailId(userObject.email);
                      setEmailVerified(userObject.email_verified);
                      setSignupFlag(true);
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                />
                </GoogleOAuthProvider>
            </div>
            <br/>
        </>
      )}
    </div>
  );
}
