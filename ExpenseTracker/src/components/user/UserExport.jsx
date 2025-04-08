/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
export const UserExport = () => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, settotalIncome] = useState(0);
  const [totalExpense, settotalExpense] = useState(0);
  const [netSaving, setnetSaving] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseByAccount, setExpenseByAccount] = useState({});
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");

        const accountsResponse = await axios.get(`/account/${userId}`);
        const accountList = accountsResponse.data?.data || [];
        setAccounts(accountList);

        const totalAccountBalance = accountList.reduce(
          (acc, account) => acc + (parseFloat(account.amount) || 0),
          0
        );
        setBalance(totalAccountBalance);

        const expenseResponse = await axios.get(`/expense/${userId}`);
        const expenses = expenseResponse.data?.data || [];
        setExpenses(expenses);

        const income = expenses
          .filter((txn) => txn.categoryId.TranTypeId.tranType === "income")
          .reduce((sum, txn) => sum + txn.amountSpent, 0);
        settotalIncome(income);

        const expense = expenses
          .filter((txn) => txn.categoryId.TranTypeId.tranType === "expense")
          .reduce((sum, txn) => sum + txn.amountSpent, 0);
        settotalExpense(expense);

        setnetSaving(income - expense);

        const accountMap = {};
        accountList.forEach((acc) => {
          accountMap[acc._id] = acc.title;
        });

        const expenseByAccount = {};
        expenses.forEach((txn) => {
          if (txn.categoryId.TranTypeId.tranType === "expense") {
            const accountId = txn.accountId?._id;
            const accountName = accountMap[accountId] || "Unknown Account";
            expenseByAccount[accountName] =
              (expenseByAccount[accountName] || 0) + txn.amountSpent;
          }
        });
        setExpenseByAccount(expenseByAccount);

        const userResponse = await axios.get(`/user/${userId}`);
        const userData = userResponse.data?.data || {};
        setUser(userData);

        if (userData.roleId) {
          const roleResponse = await axios.get(`/roles/${userData.roleId}`);
          setRole(roleResponse.data?.data?.name || "Unknown Role");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const exportExpensesToCSV = () => {
    const expenseOnly = expenses.filter(
      (txn) => txn.categoryId.TranTypeId.tranType === "expense"
    );

    const expenseByCategory = {};
    expenseOnly.forEach((txn) => {
      const category = txn.categoryId.category;
      expenseByCategory[category] =
        (expenseByCategory[category] || 0) + txn.amountSpent;
    });

    const expenseBreakdown = [
      ["Expense Breakdown by Category"],
      ["Category", "Amount"],
      ...Object.entries(expenseByCategory),
      [],
    ];

    const expenseAccountBreakdown = [
      ["Expense Distribution by Account"],
      ["Account", "Amount"],
      ...Object.entries(expenseByAccount),
      [],
    ];

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
      exp.notes,
    ]);

    const userDetails = user
      ? [
          ["User Details"],
          ["Full Name", `${user.firstName} ${user.lastName}`],
          ["Email", user.email],
          ["Age", user.age],
          ["Status", user.status],
          ["Role", role],
          [],
        ]
      : [];

    const accountDetails = accounts.length
      ? [
          ["Account Balances"],
          ["Account", "Balance"],
          ...accounts.map((acc) => [acc.title, acc.amount]),
          [],
        ]
      : [];

    const summary = [
      ["Summary"],
      ["Current Balance", balance],
      ["Total Income", totalIncome],
      ["Total Expense", totalExpense],
      ["Net Saving", netSaving],
      [],
    ];

    const csvContent = [
      ...userDetails,
      ...accountDetails,
      ...summary,
      ...expenseBreakdown,
      ...expenseAccountBreakdown,
      ["Expenses"],
      headers,
      ...rows,
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "user_expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start", // align to top
    justifyContent: "center",
    bgcolor: "#f3f4f6",
    p: 2,
    pt: 10, // Padding Top for spacing
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
        Export Your Expense Data
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Download your complete expense breakdown, income, accounts, and user details as a CSV.
      </Typography>

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={exportExpensesToCSV}
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
