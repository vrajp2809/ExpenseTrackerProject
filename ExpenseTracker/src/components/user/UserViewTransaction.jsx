/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserViewTransaction = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [transactionType, setTransactionType] = useState(""); // "income" or "expense"
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const id = localStorage.getItem("id");
        const response = await axios.get("/expensebyid/" + id);

        // Sort transactions by transactionDate (most recent first)
        const sortedExpenses = response.data.data.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );

        setExpenses(sortedExpenses);
        setFilteredExpenses(sortedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/tranCategories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchExpenses();
    fetchCategories();
  }, []);

  // Handle category filter
  const handleFilterChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);

    if (selected === "") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter((exp) => exp.category === selected));
    }
  };

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete("/deleteExpense/" + id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      setFilteredExpenses(
        filteredExpenses.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Function to filter transactions
  useEffect(() => {
    let filteredData = expenses;

    if (transactionType) {
      filteredData = filteredData.filter(
        (item) => item.transactionType === transactionType
      );
    }
    if (category) {
      filteredData = filteredData.filter((item) => item.category === category);
    }
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.paidTo.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (startDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.transactionDate) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.transactionDate) <= new Date(endDate)
      );
    }

    setFilteredExpenses(filteredData);
  }, [transactionType, category,startDate, endDate, search, expenses]);

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

  const columns = [
    { field: "paidTo", headerName: "Paid To", flex: 1.2, minWidth: 130 },
    { field: "category", headerName: "Category", flex: 1.5, minWidth: 150 },
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

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <center>
        <h2>Transactions</h2>
      </center>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label="Transaction Type"
          select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          sx={{ minWidth: "150px" }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>

        <TextField
          label="Category"
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: "150px" }}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat.category}>
              {cat.category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Paid To / Category"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: "150px" }}
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: "150px" }}
        />
      </Box>

      {/* transaction table */}
      <DataGrid
        rows={filteredExpenses}
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
                <strong>Category:</strong> {selectedTransaction.category}
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
  );
};
