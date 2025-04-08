/* eslint-disable no-unused-vars */
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import "../../assets/LandingPage.css";

export default function LandingPage() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,hsl(218, 81%, 95%) 0%,hsl(218, 81%, 75%) 100%)",
        overflowX: "hidden",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(135deg, #ffffff 0%,hsla(197, 84.20%, 92.50%, 0.81) 100%)",
          boxShadow: 2,
          width: "100%",
          borderRadius: 0, // Remove border-radius for full width
          px: 4,
          py: 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "72px",
          }}
        >
    <Typography 
  variant="h4" 
  sx={{ 
    color: "#2c3e50", 
    fontWeight: "900", 
    fontFamily: "'Bebas Neue', sans-serif", 
    letterSpacing: "2px"
  }}
>
  ExpenseTracker
</Typography>

          <Box>
            <Button
              href="/login"
              sx={{
                color: "#34495e",
                fontWeight: 600,
                mx: 1,
                "&:hover": { color: "#1a252f" },
              }}
            >
              Login
            </Button>
            <Button
              href="/signup"
              variant="contained"
              sx={{
                bgcolor: "#3498db",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                "&:hover": { bgcolor: "#5dade2" },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: "center", py: 12, mt: 2 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1a252f" }}
        >
          Take Control of Your Finances
        </Typography>
        <Typography variant="h6" sx={{ color: "#5a6b7b" }} paragraph>
          Track your expenses, manage your budget, and achieve your financial
          goals with ExpenseTracker - your personal finance companion.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            href="/signup"
            variant="contained"
            sx={{
              bgcolor: "#3498db",
              mx: 1,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: 3,
              "&:hover": { bgcolor: "#5dade2" },
            }}
          >
            Get Started Free
          </Button>
          <Button
            href="/login"
            variant="outlined"
            sx={{
              color: "#1a252f",
              borderColor: "#1a252f",
              mx: 1,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: 3,
              "&:hover": { borderColor: "#34495e", color: "#34495e" },
            }}
          >
            Login Now
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Easy Tracking",
              desc: "Log your expenses in seconds with our intuitive interface",
            },
            {
              title: "Smart Budgeting",
              desc: "Set budgets and get real-time spending insights",
            },
            {
              title: "Secure Data",
              desc: "Your financial data is protected with top-tier security",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.95)",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#2c3e50" }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#5a6b7b" }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
