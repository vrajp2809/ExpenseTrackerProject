/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";

export const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
const [expenses, setExpenses] = useState([]);
const [role, setRole] = useState("");

  useEffect(() => {
    axios
      .get(`/user/${id}`)
      .then((res) => {
        console.log("User Data Response:", res.data); // Debugging Response
        setUser(res.data.data); // Adjust based on API response
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user details", err);
        setLoading(false);
      });
  }, [id]);

  // Fetch user-related data for export
useEffect(() => {
  const fetchExtraDetails = async () => {
    try {
      if (!id) return;

      const [accountRes, expenseRes] = await Promise.all([
        axios.get(`/account/${id}`),
        axios.get(`/expense/${id}`),
      ]);

      setAccounts(accountRes.data?.data || []);
      setExpenses(expenseRes.data?.data || []);

      if (user?.roleId) {
        const roleRes = await axios.get(`/roles/${user.roleId}`);
        setRole(roleRes.data?.data?.name || "Unknown Role");
      }
    } catch (error) {
      console.error("Failed to fetch export data", error);
    }
  };

  fetchExtraDetails();
}, [id, user]);


// Download function
const downloadUserReport = () => {
  if (!user) return;

  const balance = accounts.reduce((acc, a) => acc + (parseFloat(a.amount) || 0), 0);

  const income = expenses
    .filter((txn) => txn.categoryId.TranTypeId.tranType === "income")
    .reduce((sum, txn) => sum + txn.amountSpent, 0);

  const expense = expenses
    .filter((txn) => txn.categoryId.TranTypeId.tranType === "expense")
    .reduce((sum, txn) => sum + txn.amountSpent, 0);

  const netSaving = income - expense;

  const expenseByAccount = {};
  const accountMap = {};
  accounts.forEach((acc) => (accountMap[acc._id] = acc.title));

  expenses.forEach((txn) => {
    if (txn.categoryId.TranTypeId.tranType === "expense") {
      const accName = accountMap[txn.accountId?._id] || "Unknown";
      expenseByAccount[accName] = (expenseByAccount[accName] || 0) + txn.amountSpent;
    }
  });

  const expenseByCategory = {};
  expenses
    .filter((txn) => txn.categoryId.TranTypeId.tranType === "expense")
    .forEach((txn) => {
      const cat = txn.categoryId.category || "Uncategorized";
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + txn.amountSpent;
    });

  const headers = [
    "Date",
    "Amount",
    "Paid To",
    "Transaction Type",
    "Category",
    "Account",
    "Notes",
  ];

  const rows = expenses.map((exp) => [
    new Date(exp.transactionDate).toLocaleDateString(),
    exp.amountSpent,
    exp.paidTo,
    exp.categoryId?.TranTypeId?.tranType || "N/A",
    exp.categoryId?.category || "N/A",
    exp.accountId?.title || "N/A",
    exp.notes || "",
  ]);

  const csvContent = [
    ["User Details"],
    ["Full Name", `${user.firstName} ${user.lastName}`],
    ["Email", user.email],
    ["Age", user.age || "N/A"],
    ["Status", user.status ? "Active" : "Inactive"],
    ["Role", role || "User"],
    [],

    ["Account Balances"],
    ["Account", "Balance"],
    ...accounts.map((acc) => [acc.title, acc.amount]),
    [],

    ["Summary"],
    ["Current Balance", balance],
    ["Total Income", income],
    ["Total Expense", expense],
    ["Net Saving", netSaving],
    [],

    ["Expense Breakdown by Category"],
    ["Category", "Amount"],
    ...Object.entries(expenseByCategory),
    [],

    ["Expense Distribution by Account"],
    ["Account", "Amount"],
    ...Object.entries(expenseByAccount),
    [],

    ["Transactions"],
    headers,
    ...rows,
  ]
    .map((e) => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${user.firstName}_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      console.log("Deleting user with ID:", id);
      const response = await axios.delete(`/user/${id}`);
      console.log("Delete Response:", response);

      alert("User deleted successfully");
      navigate("/admin/users"); // Redirect after deletion
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <CircularProgress
        style={{ display: "block", margin: "auto", marginTop: "20%" }}
      />
    );
  }

  if (!user) {
    return (
      <Typography variant="h5" align="center" mt={5}>
        User not found
      </Typography>
    );
  }

  const toggleUserStatus = async () => {
    const action = user.status ? "deactivate" : "activate"; // Determine action
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    if (!confirmAction) return;

    try {
      const response = await axios.patch(`/user/${id}/${action}`);
      console.log(`${action} Response:`, response);

      setUser((prevUser) => ({
        ...prevUser,
        status: !prevUser.status, // Toggle status in UI
      }));

      alert(`User ${action}d successfully`);
    } catch (err) {
      console.error(`Error ${action}ing user:`, err.response?.data || err);
      alert(`Failed to ${action} user`);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 5, px: 2 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Card
          sx={{
            p: 5,
            borderRadius: 6,
            boxShadow: 5,
            textAlign: "center",
            background: "linear-gradient(to right, #E3F2FD, #BBDEFB)", // Light blue theme
            color: "#333",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={user.imageURL || "https://via.placeholder.com/150"}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid #1976d2",
                boxShadow: "0px 0px 12px rgba(0, 0, 255, 0.3)",
              }}
            />
            <Typography variant="h4" fontWeight="bold" mt={3}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {user.email}
            </Typography>
          </Box>

          <CardContent sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Age: {user.age || "N/A"}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: user.status ? "#4CAF50" : "#FF5722" }}
            >
              Status: {user.status ? "Active" : "Inactive"}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Role:{" "}
              {user.roleId === "67c1582d4d349b7f6976d710" ? "Admin" : "User"}
            </Typography>
          </CardContent>

          <Grid container spacing={3} justifyContent="center" mt={3}>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                sx={{ fontSize: "1.2rem", px: 3, py: 1 }}
                onClick={() => navigate(`/admin/users/${id}/edit`)}
              >
                Edit
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                sx={{ fontSize: "1.2rem", px: 3, py: 1 }}
                onClick={handleDelete} // Updated delete function
              >
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color={user.status ? "warning" : "success"}
                sx={{ fontSize: "1.2rem", px: 3, py: 1 }}
                onClick={toggleUserStatus}
              >
                {user.status ? "Deactivate" : "Activate"}
              </Button>
            </Grid>
            <Grid item>
  <Button
    variant="contained"
    color="primary"
    startIcon={<DownloadIcon />}
    sx={{ fontSize: "1.2rem", px: 3, py: 1 }}
    onClick={downloadUserReport}
  >
    Download Report
  </Button>
</Grid>

            ;
          </Grid>

          <Button
            variant="outlined"
            sx={{
              mt: 4,
              color: "#1976d2",
              borderColor: "#1976d2",
              fontSize: "1.2rem",
              px: 4,
              py: 1,
            }}
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};
