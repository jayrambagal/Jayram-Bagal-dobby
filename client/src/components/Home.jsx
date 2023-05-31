import React, { useEffect, useState } from "react";
import "./global.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const Home = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8002/auth/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("id", id);
  }, [userId]);

  const bufferToImageUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer.data)], {
      type: "image/jpeg",
    });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`http://localhost:8002/auth/${id}`);
      console.log(response);
      console.log(response.data[0].email);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);

  const logoutUser = async () => {
    try {
      await axios.get("http://localhost:5000/logout");
      // Assumes that your frontend and backend are running on the same host
      window.confirm("are you sure to Logout");
      navigate("/");
      // Clear the user data from localStorage or session storage if necessary
      // Redirect the user to the login page or homepage
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("userId", userId);

    fetch("http://localhost:8002/auth/uploads", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("File uploaded successfully.");
        } else {
          console.error("Error uploading file.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div
      className="Login_container"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <div
        className=""
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={handleUserIdChange}
        />
        <button onClick={handleUpload}>Upload</button>

        <Button variant="outlined" color="primary" onClick={logoutUser}>
          Logout
        </Button>
      </div>

      {/* <img src={bufferToImageUrl(image.uploadedImages)} alt="User Imag" style={{width:"170px",height:"auto"}} />  */}

      <h2>Image Gallery for User {userId}</h2>
      {images.length === 0 ? (
        <p>No images found for this user.</p>
      ) : (
        <>
          {images?.map((image, index) => (
            <div className="card" >
            
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={bufferToImageUrl(image.uploadedImages)}
              />
              <h3>name</h3>
              
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Home;
