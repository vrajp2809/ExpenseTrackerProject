/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Card, Typography, Avatar, Divider, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import axios from "axios";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [role, setRole] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch User Data
        const userResponse = await axios.get(`/user/${userId}`);
        const userData = userResponse.data?.data || {};
        setUser(userData);
        

        // Fetch Role Name
        if (userData.roleId) {
          const roleResponse = await axios.get(`/roles/${userData.roleId}`);
          setRole(roleResponse.data?.data?.name || "Unknown Role");

          console.log(roleResponse);
        }

        // Fetch Accounts
        const accountsResponse = await axios.get(`/account/${userId}`);
        const accountList = accountsResponse.data?.data || [];
        setAccounts(accountList);

        // Calculate total balance
        const totalAccountBalance = accountList.reduce((acc, account) => acc + (parseFloat(account.amount) || 0), 0);
        setBalance(totalAccountBalance);

        // Fetch Total Expenses
        const expenseResponse = await axios.get(`/expense/${userId}`);
        const expenses = expenseResponse.data?.data || [];
        const totalSpent = expenses.reduce((acc, expense) => acc + (expense.amountSpent || 0), 0);
        setTotalExpenses(totalSpent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, borderRadius: "12px", boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} textAlign="center">
            <Avatar src={user.imageURL} sx={{ width: 130, height: 130, bgcolor: "primary.main" }}>
              {!user.imageURL && (user?.firstName?.charAt(0)?.toUpperCase() || "U")}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h5" fontWeight="bold">{user?.firstName} {user?.lastName}</Typography>
            <Typography variant="body1" color="text.secondary">{user?.email || "No email available"}</Typography>
            <Typography variant="body2" color="text.secondary">Role: {role}</Typography>
            <Typography variant="body2" color="text.secondary">Age: {user?.age || "N/A"}</Typography>
            <Chip label={user?.status ? "Active" : "Inactive"} color={user?.status ? "success" : "error"} sx={{ mt: 1 }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight="bold">Accounts</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <Grid item xs={12} sm={6} md={4} key={account._id}>
                <Card sx={{ p: 2, backgroundColor: "#f4f6f8" }}>
                  <AccountBalanceWalletIcon color="primary" />
                  <Typography variant="body1" fontWeight="bold">{account.title || "Unnamed Account"}</Typography>
                  <Typography variant="body2" color="text.secondary">Balance: ₹{account.amount?.toFixed(2) || "0.00"}</Typography>
                  <Typography variant="caption" color="text.secondary">{account.description}</Typography>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No accounts found.</Typography>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight="bold">Current Balance</Typography>
        <Typography variant="h4" color={balance >= 0 ? "green" : "red"}>
          ₹{balance?.toFixed(2) || "0.00"}
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight="bold">Total Transaction Amount</Typography>
        <Typography variant="h4" >
          ₹{totalExpenses?.toFixed(2) || "0.00"}
        </Typography>
      </Card>
    </Container>
  );
};
