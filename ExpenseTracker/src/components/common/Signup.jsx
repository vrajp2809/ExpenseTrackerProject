/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/loginStyle.css";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetState } from "@mantine/hooks";
import { FaUserCircle } from "react-icons/fa";

export const Signup = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [image, setimage] = useState(null)
  const [preview, setPreview] = useState(null);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimage(file);
      setPreview(URL.createObjectURL(file)); // Create preview URL
    }
  };


  const submitHandler = async (data) => {
    try {
      data.roleId = "67c158104d349b7f6976d70e";

      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("age", data.age); // ✅ Add age
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("roleId", data.roleId);

      if(image){
        formData.append("image",image);
      }


      const res = await axios.post("/addWithProfile", formData,{
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.status === 201) {
        toast.success("✅ Signup Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
  
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle "Email already exists" error
        toast.error("⚠️ Email already exists! Try logging in.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      } else {
        // Handle general errors
        toast.error("❌ Signup Failed! Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  };
  

  return (
    <div className="background-radial-gradient d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Link to={'/'} style={{ textDecoration: "none" }}>
      <h1 className="expense-tracker-title">Expense Tracker</h1> {/* Centered above the box */}
      </Link>

      <div className="card bg-glass">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <input type="text" {...register("firstName")} className="form-control" placeholder="First name" />
              </div>
              <div className="col-md-6 mb-3">
                <input type="text" {...register("lastName")} className="form-control" placeholder="Last name" />
              </div>
            </div>
            <input type="number" {...register("age")} className="form-control mb-3" placeholder="Age" />
            <input type="email" {...register("email")} className="form-control mb-3" placeholder="Email" />
            <input type="password" {...register("password")} className="form-control mb-3" placeholder="Password" />

            <input
              
              type="file"
              className="form-control mb-3"
              accept="image/*"
              onChange={(e) => setimage(e.target.files[0])}
            />
            <input type="submit" className="btn btn-primary w-100 mb-3" value="Sign Up" />
            <p className="mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Toast Container to display toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};




{/* <Box className="background-radial-gradient" display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={3}>
      <Typography variant="h3" className="expense-tracker-title">Expense Tracker</Typography>
      <Card className="bg-glass" sx={{ maxWidth: 500, p: 3 }}>
        <Typography variant="h4" className="signup-title">Sign Up</Typography>
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Box display="flex" gap={2} mb={2}>
              <TextField {...register("firstName")} label="First Name" fullWidth variant="outlined" size="small" />
              <TextField {...register("lastName")} label="Last Name" fullWidth variant="outlined" size="small" />
            </Box>
            <TextField {...register("age")} label="Age" type="number" fullWidth variant="outlined" size="small" margin="dense" />
            <TextField {...register("email")} label="Email" type="email" fullWidth variant="outlined" size="small" margin="dense" />
            <TextField {...register("password")} label="Password" type="password" fullWidth variant="outlined" size="small" margin="dense" />
            <TextField type="file" fullWidth variant="outlined" size="small" margin="dense" inputProps={{ accept: "image/*" }} onChange={handleImageChange} />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" transition={Bounce} />
    </Box> */}