import React, { useEffect, useState } from "react";
import "./global.css";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const Home = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputNameSearch, setInputNameSearch] = useState("")
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`https://dobby-lvab.onrender.com/auth/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("id", id);
  }, [user]);

  const bufferToImageUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer.data)], {
      type: "image/jpeg",
    });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`https://dobby-lvab.onrender.com/auth/${id}`);
      console.log(response);
      console.log(response.data[0].email);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);

  function handleLogout() {
    // Get all cookies
    const cookies = document.cookie.split(';');
  
    // Iterate through cookies and delete each one
    cookies.forEach((cookie) => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  
    // Redirect the user to the login page or any other desired page
    window.location.href = '/login'; // Replace '/login' with the desired URL
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleUpload = () => {
    setUser(false)
    const formData = new FormData();
    formData.append("name", inputName);
    formData.append("userId", id);
    formData.append("image", selectedFile);
    

    fetch("https://dobby-lvab.onrender.com/auth/uploads", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("File uploaded successfully.");
        } else {
          console.error("Error uploading file.");
          
        }
        setUser(true)
      })
      .catch((error) => {
        console.error("Error:", error);
        setUser(true)
      });
  };
  

  if (!user) {
    return  <div style={{width:"100%", display:"flex",justifyContent:"center"}}><Box sx={{ display: 'flex' }}>
    <CircularProgress />
  </Box></div>
  }

 

  
  return (
    <div
      className="Login_container"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
    <h2>Upload Your Images</h2>
      <div
        className=""
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input type="file" placeholder="Select you image" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter Image Name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <button onClick={handleUpload}>Upload</button>

        <Button variant="outlined" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      {/* <img src={bufferToImageUrl(image.uploadedImages)} alt="User Imag" style={{width:"170px",height:"auto"}} />  */}

      <h2>Image Gallery for User </h2>
      <input
          type="text"
          placeholder="search by name"
          value={inputNameSearch}
          onChange={(e)=>setInputNameSearch(e.target.value)}
        />
        {/* <button onClick={(e) => handleSearch(e)}>Search</button> */}
      {images.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <>
          {
            
            images.filter((imgObj) => imgObj.name.toLowerCase().includes(inputNameSearch.toLowerCase())).map((image, index) => (
            <div className="card" >
            
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={bufferToImageUrl(image.uploadedImages)}
              />
              <h3>{image.name}</h3>
              
            </div>
          ))
          
          }
        </>
      )}
    </div>
  );
};

export default Home;
