import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import "./global.css";
import { Button, Link } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading,setIsLoading] = useState(false)

    const handleSubmit = (e) => {
      setIsLoading(true)
        e.preventDefault();
        const user = {
          email: email,
          password: password,
        };
    
        axios.post("https://dobby-lvab.onrender.com/auth/login", user)
          .then((response) => {
            console.log(response);
            console.log("data",response.data.user._id);
            console.log("User logged in successfully");
            window.alert("Login successfully")
            navigate(`/users/${response.data.user._id}`)
            setIsLoading(false)
          })
          .catch((error) => {
            
            if(error.response.status === 404){
                window.alert("Email not found Please SignUp")
            }else if(error.response.status === 400){
                window.alert("Password is Incorrect")
            }else{
                console.error(error);
                window.alert("Failed to login")
            }
            setIsLoading(false)
            
          });
      };
      if (isLoading) {
        return  <div style={{width:"100%", display:"flex",justifyContent:"center"}}><Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box></div>
      }
  return (
    <div className="Login_container">
      <form className="Login_form" onSubmit={handleSubmit}>
        <h2>Login Page</h2>
        <TextField
          id="standard-basic"
          variant="outlined"
          label="Email"
          type="email"
          size="small"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        
        />
        <TextField
          id="standard-basic"
          variant="outlined"
          label="Password"
          type="password"
          size="small"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
                />
        <div className="Login_Link">
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            navigate("/SignUp");
          }}
        >
          don't have account? Register
        </Link>

        
        </div>
        

        <Button variant="outlined" color="primary" type="submit" >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
