/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

export const AdminTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tranTypes, setTranTypes] = useState([]);
  const [selectedTranType, setSelectedTranType] = useState("");
  const [selectedPaidBy, setSelectedPaidBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/expenses");
        

        const sortedTransactions = response.data.data.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );

        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        // console.log("Fetched Users:", response.data.data); // Debugging
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const fetchTranTypes = async () => {
      try {
        const response = await axios.get("/tranTypes");
        setTranTypes(response.data.data);
        
      } catch (error) {
        console.error("Error fetching transaction types:", error);
      }
    };

    fetchTranTypes();
    fetchTransactions();
    fetchCategories();
    fetchUsers();
  }, []);

  const getTransactionType = (tranTypeId) => {
    const id = typeof tranTypeId === "object" ? tranTypeId._id : tranTypeId;
    const tranType = tranTypes.find((type) => type._id === id);
    return tranType ? tranType.tranType : "Unknown";
  };
  



  useEffect(() => {
    let filteredData = transactions;
    console.log(filteredData);

    if (search) {
      filteredData = filteredData.filter(
        (txn) =>
          (txn.userId.firstName && txn.userId.firstName.toLowerCase().includes(search.toLowerCase())) ||
          (txn.userId.lastName && txn.userId.lastName.toLowerCase().includes(search.toLowerCase())) ||
          (txn.categoryId.category && txn.categoryId.category.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (startDate) {
      filteredData = filteredData.filter(
        (txn) => new Date(txn.transactionDate) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredData = filteredData.filter(
        (txn) => new Date(txn.transactionDate) <= new Date(endDate)
      );
    }
    if (selectedTranType) {
      filteredData = filteredData.filter(
        (item) => item.transactionType === selectedTranType
      );
    }
    if (selectedPaidBy) {
      filteredData = filteredData.filter(
        (txn) => txn.paidBy === selectedPaidBy
      );
    }
    if (selectedCategory) {
      filteredData = filteredData.filter(
        (txn) => txn.categoryId?.category === selectedCategory
      );
    }

    setFilteredTransactions(filteredData);
  }, [search, startDate, endDate, selectedTranType, selectedPaidBy, selectedCategory, transactions]);

  

  // Function to delete a transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete("/deleteExpense/" + id);
      setTransactions(transactions.filter((txn) => txn._id !== id));
      setFilteredTransactions(
        filteredTransactions.filter((txn) => txn._id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  

  // Open dialog to view details
  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);

  };

  

  const columns = [
    {
      field: "userId",
      headerName: "Paid By",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        const user = params.value; // this is the populated user object
        return user ? `${user.firstName} ${user.lastName}` : "Deleted User";
      },
    },
    {
      field: "TranTypeId",
      headerName: "Transaction Type",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        const tranTypeId = params.row.categoryId?.TranTypeId; // Get TranTypeId from categoryId
        const tranType = tranTypes.find((type) => type._id === tranTypeId);
        return tranType ? tranType.tranType : "Unknown";  // Make sure to use 'tranType' key
      },
    },
    {
      field: "categoryId",
      headerName: "Category",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        return params.value?.category || "Unknown";
      },
    },
    {
      field: "amountSpent",
      headerName: "Amount (₹)",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const tranTypeId = params.row.categoryId?.TranTypeId;
        const tranType = tranTypes.find((type) => type._id === tranTypeId);
        const isIncome = tranType?.tranType === "income";
        
        return (
          <span
            style={{
              color: isIncome ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {isIncome ? "+" : "-"}₹{params.value}
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
        <h2>All Transactions</h2>
      </center>



      {/* Filters */}
      {/* Filters */}
      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  }}
>
  <TextField
    label="Transaction Type"
    select
    value={selectedTranType}
    onChange={(e) => setSelectedTranType(e.target.value)}
    fullWidth
  >
    <MenuItem value="">All</MenuItem>
    <MenuItem value="income">Income</MenuItem>
    <MenuItem value="expense">Expense</MenuItem>
  </TextField>

  <TextField
    label="Search"
    variant="outlined"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by Name or Category"
    fullWidth
  />

  <TextField
    label="Start Date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    fullWidth
  />

  <TextField
    label="End Date"
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    fullWidth
  />

  <FormControl fullWidth>
    <InputLabel id="category-label">Category</InputLabel>
    <Select
      labelId="category-label"
      value={selectedCategory}
      label="Category"
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <MenuItem value="">All</MenuItem>
      {categories.map((cat) => (
        <MenuItem key={cat._id} value={cat.category}>
          {cat.category}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>



      

      {/* Transaction Table */}
      <DataGrid
        rows={filteredTransactions}
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
        }}
      />

      {/* Dialog for viewing transaction details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ padding: 2, fontSize: "16px" }}>
              {/* Transaction Section */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{ borderBottom: "2px solid #ccc", mb: 2 }}
              >
                🧾 Transaction Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Paid To:</strong> {selectedTransaction.paidTo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Typography>
              <strong>Amount:</strong>
              <span
                style={{
                  color:
                    getTransactionType(selectedTransaction.categoryId?.TranTypeId) ===
                    "income"
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {getTransactionType(selectedTransaction.categoryId?.TranTypeId) ===
                "income"
                  ? "+"
                  : "-"}
                ₹{selectedTransaction.amountSpent}
              </span>
            </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      selectedTransaction.transactionDate
                    ).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Category:</strong>{" "}
                    {selectedTransaction.categoryId?.category || "Unknown"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Transaction Type:</strong>{" "}
                    {getTransactionType(selectedTransaction.categoryId?.TranTypeId)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Notes:</strong> {selectedTransaction.notes || "—"}
                  </Typography>
                </Grid>
                {selectedTransaction.attachmentURL && (
                  <Grid item xs={12}>
                    <Typography>
                      <strong>Attachment:</strong>
                    </Typography>
                    <img
                      src={selectedTransaction.attachmentURL}
                      alt="Attachment"
                      style={{
                        maxWidth: "200px",
                        borderRadius: "10px",
                        marginTop: "8px",
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Divider */}
              <Divider sx={{ my: 3 }} />

              {/* User Section */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{ borderBottom: "2px solid #ccc", mb: 2 }}
              >
                👤 User Information
              </Typography>

              {selectedTransaction.userId ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={selectedTransaction.userId.imageURL}
                      alt="User"
                      style={{
                        width: "100%",
                        maxWidth: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Typography>
                      <strong>Name:</strong>{" "}
                      {`${selectedTransaction.userId.firstName} ${selectedTransaction.userId.lastName}`}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedTransaction.userId.email}
                    </Typography>
                    <Typography>
                      <strong>Age:</strong> {selectedTransaction.userId.age}
                    </Typography>
                    <Typography>
                      <strong>Role:</strong>{" "}
                      {selectedTransaction.userId.roleId ===
                      "67c158104d349b7f6976d70e"
                        ? "User"
                        : "Admin"}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography color="error">
                  This user has been deleted.
                </Typography>
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
