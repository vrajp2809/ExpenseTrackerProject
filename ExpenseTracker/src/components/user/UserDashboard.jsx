/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Box,
  Card,
  Button,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import "chart.js/auto";

export const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, settotalIncome] = useState(0);
  const [totalExpense, settotalExpense] = useState(0);
  const [netSaving, setnetSaving] = useState(0);
  const [expenseChartData, setExpenseChartData] = useState(null);
  const [incomeVsExpenseChartData, setIncomeVsExpenseChartData] = useState({});
  const [expenseTrendData, setExpenseTrendData] = useState(null);
  const [expenseByAccountData, setExpenseByAccountData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");

        //Fetch account data
        const accountsResponse = await axios.get(`/account/${userId}`);
        const accountList = accountsResponse.data?.data || [];
        setAccounts(accountList);

        // Calculate total balance
        const totalAccountBalance = accountList.reduce(
          (acc, account) => acc + (parseFloat(account.amount) || 0),
          0
        );
        setBalance(totalAccountBalance);

        // Fetch Total Expenses
        const expenseResponse = await axios.get(`/expense/${userId}`);
        const expenses = expenseResponse.data?.data || [];
        

        // Calculate total income
        const totalIncome = expenses
          .filter((txn) => txn.categoryId.TranTypeId.tranType === "income") // ✅ Filter income transactions
          .reduce((sum, txn) => sum + txn.amountSpent, 0); // ✅ Sum up the amounts

        settotalIncome(totalIncome);

        // Calculate total expense
        const totalExpense = expenses
          .filter((txn) => txn.categoryId.TranTypeId.tranType === "expense") // ✅ Filter income transactions
          .reduce((sum, txn) => sum + txn.amountSpent, 0); // ✅ Sum up the amounts

        settotalExpense(totalExpense);

        setnetSaving(totalIncome - totalExpense);

        //Fetch Expense without income
        const expenseOnly = expenses.filter(
          (txn) => txn.categoryId.TranTypeId.tranType === "expense"
        );

        //Group by category & sum amounts
        const expenseByCategory = {};
        expenseOnly.forEach((txn) => {
          const category = txn.categoryId.category;
          expenseByCategory[category] =
            (expenseByCategory[category] || 0) + txn.amountSpent;
        });

        // Prepare Chart Data
        const chartData = {
          labels: Object.keys(expenseByCategory), // Categories
          datasets: [
            {
              label: "Expense Breakdown",
              data: Object.values(expenseByCategory), // Amounts
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4CAF50",
                "#FF9800",
                "#9C27B0",
              ],
            },
          ],
        };

        setExpenseChartData(chartData);

        // Monthly Expense Trend (Line Chart)
        const expenseByMonth = {};
        expenses.forEach((txn) => {
          if (txn.categoryId.TranTypeId.tranType === "expense") {
            const month = new Date(txn.transactionDate).toLocaleString(
              "default",
              { month: "short" }
            );
            expenseByMonth[month] =
              (expenseByMonth[month] || 0) + txn.amountSpent;
          }
        });

        setExpenseTrendData({
          labels: Object.keys(expenseByMonth),
          datasets: [
            {
              label: "Monthly Expenses",
              data: Object.values(expenseByMonth),
              borderColor: "#FF6384",
              backgroundColor: "rgba(255,99,132,0.2)",
              tension: 0.4,
            },
          ],
        });

        // ✅ Create a Mapping of Account IDs to Names
        const accountMap = {};
        accountList.forEach((acc) => {
          accountMap[acc._id] = acc.title; // ✅ Ensure we have valid names
        });
        

        //Expense Distribution by Account (Doughnut Chart)
        const expenseByAccount = {};
        expenses.forEach((txn) => {
          if (txn.categoryId.TranTypeId.tranType === "expense") {
            const accountId = txn.accountId?._id; // Ensure accountId exists
            const accountName = accountMap[accountId] || "Unknown Account"; // Map ID to Name

            expenseByAccount[accountName] =
              (expenseByAccount[accountName] || 0) + txn.amountSpent;
          }
        });

        setExpenseByAccountData({
          labels: Object.keys(expenseByAccount),
          datasets: [
            {
              label: "Expense by Account",
              data: Object.values(expenseByAccount),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4CAF50",
                "#9C27B0",
              ],
            },
          ],
        });

        // Prepare Income vs Expense Data for Bar Chart
        const barChartData = {
          labels: ["Income", "Expense"],
          datasets: [
            {
              label: "Income",
              data: [totalIncome || 0, 0],
              backgroundColor: "#36A2EB",
            },
            {
              label: "Expense",
              data: [0, totalExpense || 0],
              backgroundColor: "#FF6384",
            },
          ],
        };

        setIncomeVsExpenseChartData(barChartData);

        // Sort by date (most recent first) and get top 5 transactions
        const sortedTransactions = expenses
          .sort(
            (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
          )
          .slice(0, 5);

        setRecentTransactions(
            sortedTransactions.map((txn) => ({
              ...txn,
              transactionType: txn.categoryId?.TranTypeId?.tranType || "Unknown", // Ensure transactionType is mapped correctly
            }))
          );

          console.log(recentTransactions);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  // Function to handle delete
    const handleDelete = async (id) => {
      try {
        await axios.delete("/deleteExpense/" + id);
        setRecentTransactions(recentTransactions.filter((expense) => expense._id !== id));
        
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    };

    // Function to open dialog with transaction details
  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    console.log("Updated Recent Transactions:", recentTransactions);
  }, [recentTransactions]); 

  const columns = [
      { field: "paidTo", headerName: "Paid To", flex: 1.2, minWidth: 130 },
      { field: "category", headerName: "Category", flex: 1.5, minWidth: 150 ,renderCell: (params) => {
        return <span>{params.row.categoryId?.category || "N/A"}</span>;
      },},
      {
        field: "amountSpent",
        headerName: "Amount (₹)",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
          const isExpense = params.row.transactionType === "expense";
          return (
            <span
              style={{
                color: isExpense ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {isExpense ? `- ₹${params.value}` : `+ ₹${params.value}`}
            </span>
          );
        },
      },
      {
        field: "transactionDate",
        headerName: "Date",
        flex: 1,
        minWidth: 130,
        renderCell: (params) => new Date(params.value).toLocaleDateString(),
      },
      {
        field: "view",
        headerName: "View",
        flex: 0.8,
        minWidth: 100,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleView(params.row)}
          >
            View
          </Button>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        flex: 0.8,
        minWidth: 100,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        ),
      },
    ];

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Fix: Ensure proper chart height consistency
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        <center>

        User Dashboard
        </center>
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Balance</Typography>
              <Typography variant="h4" color={balance >= 0 ? "green" : "red"}>
                ₹{balance?.toFixed(2) || "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography
                variant="h4"
                color={totalIncome >= 0 ? "green" : "red"}
              >
                ₹{totalIncome?.toFixed(2) || "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Expense</Typography>
              <Typography variant="h4" color={"red"}>
                ₹-{totalExpense?.toFixed(2) || "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Net Saving
                {totalIncome > 0 && (
                  <span style={{ fontSize: "0.8rem", color: "blue" }}>
                    {" "}
                    (Saving %: {((netSaving / totalIncome) * 100).toFixed(2)}%)
                  </span>
                )}
              </Typography>
              <Typography variant="h4" color={netSaving >= 0 ? "green" : "red"}>
                ₹{netSaving?.toFixed(2) || "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Card style={{ height: "400px" }}>
            <CardContent style={{ height: "100%" }}>
              <Typography variant="h6">Expense Breakdown</Typography>
              <div style={{ height: "350px", width: "350px", margin: "auto" }}>
                {expenseChartData ? (
                  <Pie data={expenseChartData} />
                ) : (
                  <Typography variant="body2">
                    No Expense Data Available
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ height: "400px" }}>
            {" "}
            {/* Set the same fixed height */}
            <CardContent style={{ height: "100%" }}>
              <Typography variant="h6">Income vs Expense</Typography>
              <div style={{ height: "350px" }}>
                {incomeVsExpenseChartData?.labels ? (
                  <Bar
                    data={incomeVsExpenseChartData}
                    options={barChartOptions}
                  />
                ) : (
                  <Typography>No Data</Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {/* Monthly Expense Trend (Line Chart) */}
        <Grid item xs={12} md={6}>
          <Card style={{ height: "400px" }}>
            <CardContent style={{ height: "100%" }}>
              <Typography variant="h6">Monthly Expense Trend</Typography>
              <div style={{ height: "350px" }}>
                {expenseTrendData ? (
                  <Line data={expenseTrendData} />
                ) : (
                  <Typography>No Data</Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Distribution by Account (Doughnut Chart) */}
        <Grid item xs={12} md={6}>
          <Card style={{ height: "400px" }}>
            <CardContent style={{ height: "100%" }}>
              <Typography variant="h6">
                Expense Distribution by Account
              </Typography>
              <div style={{ height: "350px", width: "350px", margin: "auto" }}>
                {expenseByAccountData ? (
                  <Doughnut data={expenseByAccountData} />
                ) : (
                  <Typography>No Data</Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", padding: "20px" }}>
            <center>
              <h2>Recent Transactions</h2>
            </center>
            <DataGrid
              rows={recentTransactions}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 50, 100]}
              getRowId={(row) => row._id}
              autoHeight
              disableColumnResize
              disableSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#000",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "18px",
                  borderBottom: "2px solid #ddd",
                },
                "& .MuiDataGrid-cell": {
                  fontSize: "18px",
                },
                "& .MuiButton-root": {
                  fontSize: "14px",
                },
                "& .MuiTablePagination-root": {
                  fontSize: "18px", // Increases pagination text size
                },
                "& .MuiTablePagination-caption": {
                  fontSize: "18px", // Increases "Rows per page" and "X–Y of Z" size
                },
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "18px",
                },
                "& .MuiTablePagination-select": {
                  fontSize: "18px",
                },
                "& .MuiTablePagination-actions button": {
                  fontSize: "16px",
                },
              }}
            />
      
            {/* Dialog for viewing transaction details */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogContent>
                {selectedTransaction && (
                  <Box sx={{ padding: "10px", fontSize: "16px" }}>
                    <Typography>
                      <strong>Paid To:</strong> {selectedTransaction.paidTo}
                    </Typography>
                    <Typography>
                      <strong>Category:</strong> {selectedTransaction.categoryId.category}
                    </Typography>
                    <Typography>
                      <strong>Amount:</strong> ₹{selectedTransaction.amountSpent}
                    </Typography>
                    <Typography>
                      <strong>Transaction Type:</strong>{" "}
                      {selectedTransaction.transactionType}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        selectedTransaction.transactionDate
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Notes:</strong> {selectedTransaction.notes || "N/A"}
                    </Typography>
      
                    {/* Show image if available */}
                    {selectedTransaction.attachmentURL && (
                      <Box sx={{ marginTop: "15px", textAlign: "center" }}>
                        <Typography>
                          <strong>Receipt/Image:</strong>
                        </Typography>
                        <img
                          src={selectedTransaction.attachmentURL}
                          alt="Transaction Attachment"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            borderRadius: "10px",
                            marginTop: "10px",
                            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: "10px" }}>
  <Link to="/user/viewTransaction" style={{ textDecoration: "none", fontSize: "16px", color: "#1976D2" }}>
    More Transactions
  </Link>
</Box>
    </div>
  );
};
