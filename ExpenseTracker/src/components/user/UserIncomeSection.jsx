/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";

export const UserIncomeSection = () => {
  const [income, setIncome] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  


  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const id = localStorage.getItem("id");
        const response = await axios.get("/expensebyid/" + id);
        
        // Filter only income transactions
        const incomeTransactions = response.data.data
          .filter((transaction) => transaction.transactionType === "income")
          .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)); // Sort by date

        setIncome(incomeTransactions);
      } catch (error) {
        console.error("Error fetching income:", error);
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

    fetchIncome();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filteredData = income;

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

    setFilteredIncome(filteredData);
  }, [category, search, startDate, endDate, income]);

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete("/deleteExpense/" + id);
      setIncome(income.filter((transaction) => transaction._id !== id));
    } catch (error) {
      console.error("Error deleting income transaction:", error);
    }
  };

  // Function to open dialog with transaction details
  const handleView = (transaction) => {
    setSelectedIncome(transaction);
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedIncome(null);
  };

  const columns = [
    { field: "paidTo", headerName: "Source", flex: 1.2, minWidth: 150 },
    { field: "category", headerName: "Category", flex: 1.5, minWidth: 150 },
    {
      field: "amountSpent",
      headerName: "Amount (₹)",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          + ₹{params.value}
        </span>
      ),
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
        <h2>Income Transactions</h2>
      </center>

      <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <DataGrid
        rows={filteredIncome}
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
            fontSize: "18px",
          },
          "& .MuiTablePagination-caption": {
            fontSize: "18px",
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

      {/* Dialog for viewing income details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Income Details</DialogTitle>
        <DialogContent>
          {selectedIncome && (
            <Box sx={{ padding: "10px", fontSize: "16px" }}>
              <Typography>
                <strong>Source:</strong> {selectedIncome.paidTo}
              </Typography>
              <Typography>
                <strong>Category:</strong> {selectedIncome.category}
              </Typography>
              <Typography>
                <strong>Amount:</strong> ₹{selectedIncome.amountSpent}
              </Typography>
              <Typography>
                <strong>Transaction Type:</strong> Income
              </Typography>
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(selectedIncome.transactionDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Notes:</strong> {selectedIncome.notes || "N/A"}
              </Typography>

              {/* Show image if available */}
              {selectedIncome.attachmentURL && (
                <Box sx={{ marginTop: "15px", textAlign: "center" }}>
                  <Typography>
                    <strong>Receipt/Image:</strong>
                  </Typography>
                  <img
                    src={selectedIncome.attachmentURL}
                    alt="Income Attachment"
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
