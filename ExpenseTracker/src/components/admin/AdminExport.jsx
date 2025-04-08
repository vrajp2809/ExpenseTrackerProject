/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export const AdminExport = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [topUsersData, setTopUsersData] = useState(null);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState("");
  const [transactions, setTransactions] = useState([]);

  const adminId = localStorage.getItem("id");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await axios.get("/users");
        const allUsers = usersRes.data.data || [];
        setTotalUsers(allUsers.length);
        setActiveUsers(allUsers.filter((user) => user.status).length);

        const userResponse = await axios.get(`/user/${adminId}`);
        const adminData = userResponse.data?.data || {};
        setAdmin(adminData);

        if (adminData.roleId) {
          const roleResponse = await axios.get(`/roles/${adminData.roleId}`);
          setRole(roleResponse.data?.data?.name || "Unknown Role");
        }

        const expensesRes = await axios.get("/expenses");
        const allTransactions = expensesRes.data.data || [];

        const expenses = allTransactions.filter(
          (txn) => txn.transactionType === "expense"
        );
        const income = allTransactions.filter(
          (txn) => txn.transactionType === "income"
        );

        setTotalExpense(expenses.reduce((sum, txn) => sum + txn.amountSpent, 0));
        setTotalIncome(income.reduce((sum, txn) => sum + txn.amountSpent, 0));
        setTotalTransaction(allTransactions.length);

        const accountsRes = await axios.get("/accounts");
        const accounts = accountsRes.data.data || [];
        const validAccounts = accounts.filter((account) => account.userId !== null);
        setNetBalance(validAccounts.reduce((sum, acc) => sum + acc.amount, 0));

        const categoryMap = {};
        expenses.forEach((txn) => {
          const category = txn.category || "Others";
          categoryMap[category] = (categoryMap[category] || 0) + txn.amountSpent;
        });
        setCategoryTotals(categoryMap);

        const userExpenseMap = {};
        expenses.forEach((txn) => {
          const userId = txn.userId?._id || txn.userId;
          const userName = txn.userId?.firstName || "Unknown User";

          if (!userExpenseMap[userId]) {
            userExpenseMap[userId] = { name: userName, total: 0 };
          }
          userExpenseMap[userId].total += txn.amountSpent;
        });

        const sortedUsers = Object.values(userExpenseMap)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        setTopUsersData(sortedUsers);

        const sortedTxns = [...allTransactions].sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );
        setTransactions(sortedTxns); 
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const exportAdminDataToCSV = () => {
    const csvRows = [];

    // Report title
    csvRows.push(["Admin Dashboard Report"]);
    csvRows.push([]);

    // Admin Details
    if (admin) {
      csvRows.push(["Admin Info"]);
      csvRows.push(["Name", `${admin.firstName || ""} ${admin.lastName || ""}`]);
      csvRows.push(["Email", admin.email || ""]);
      csvRows.push(["Age", admin.age || ""]);
      csvRows.push(["Status", admin.status ? "Active" : "Inactive"]);
      csvRows.push(["Role", role]);
      csvRows.push([]);
    }

    // Dashboard Metrics
    csvRows.push(["Dashboard Metrics"]);
    csvRows.push(["Metric", "Value"]);
    csvRows.push(["Total Users", totalUsers]);
    csvRows.push(["Active Users", activeUsers]);
    csvRows.push(["Total Income", totalIncome]);
    csvRows.push(["Total Expenses", totalExpense]);
    csvRows.push(["Total Transactions", totalTransaction]);
    csvRows.push(["Net Balance", netBalance]);
    csvRows.push([]);

    // Top 5 Users by Expense
    if (topUsersData?.length > 0) {
      csvRows.push(["Top 5 Users by Expense"]);
      csvRows.push(["User Name", "Total Expense"]);
      topUsersData.forEach((user) => {
        csvRows.push([user.name, user.total]);
      });
      csvRows.push([]);
    }

    // Category Breakdown
    csvRows.push(["Expense Breakdown by Category"]);
    csvRows.push(["Category", "Total Expense"]);
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      csvRows.push([cat, val]);
    });
    csvRows.push([]);

    // Recent Transactions
    if (transactions.length > 0) {
      csvRows.push(["Recent 5 Transactions"]);
      csvRows.push([
        "User",
        "Category",
        "Transaction Type",
        "Paid By",
        "Amount",
        "Date",
        "Notes",
      ]);
      transactions.forEach((txn) => {
        csvRows.push([
          `${txn.userId?.firstName || "Unknown"} ${txn.userId?.lastName || ""}`,
          txn.categoryId?.category || "N/A",
          txn.transactionType,
          txn.paidBy,
          txn.amountSpent,
          new Date(txn.transactionDate).toLocaleDateString(),
          txn.notes || "-",
        ]);
      });
    }

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "admin_dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        bgcolor: "#f3f4f6",
        p: 2,
        pt: 10,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="600" color="text.primary" mb={2}>
          Export Admin Dashboard Report
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Download dashboard metrics, admin info, and recent activity as a CSV file.
        </Typography>

        <Stack direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={exportAdminDataToCSV}
            startIcon={<DownloadIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              boxShadow: 3,
              ":hover": {
                transform: "scale(1.05)",
                boxShadow: 5,
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Download CSV
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
