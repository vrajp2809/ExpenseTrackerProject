/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Avatar, Grid, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/users")
      .then(response => {
        setUsers(response.data.data); // Assuming API response format
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
         User List
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <Grid container spacing={3}>
          {users.map(user => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  p: 2, 
                  cursor: "pointer",
                  height: "120px", // Ensures all cards have the same height
                }}
                onClick={() => navigate(`/admin/users/${user._id}`)} 
              >
                <Avatar 
                  src={user.imageURL || "https://via.placeholder.com/150"} 
                  alt={user.firstName} 
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" noWrap>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {user.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
