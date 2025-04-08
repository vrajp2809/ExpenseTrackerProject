/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const horizontalBarOptions = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const AdminDashboard = () => {
  const theme = useTheme();

  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalTransaction, settotalTransaction] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [monthlyTxnData, setMonthlyTxnData] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [topUsersData, setTopUsersData] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await axios.get("/users");
        const allUsers = usersRes.data.data || [];
        setTotalUsers(allUsers.length);
        setActiveUsers(allUsers.filter((user) => user.status).length);

        const expensesRes = await axios.get("/expenses");
        const transactions = expensesRes.data.data || [];

        const expenses = transactions.filter(
          (txn) => txn.transactionType === "expense"
        );
        const income = transactions.filter(
          (txn) => txn.transactionType === "income"
        );

        setTotalExpense(
          expenses.reduce((sum, txn) => sum + txn.amountSpent, 0)
        );
        setTotalIncome(income.reduce((sum, txn) => sum + txn.amountSpent, 0));
        settotalTransaction(transactions.length);

        const accountsRes = await axios.get("/accounts");
        const accounts = accountsRes.data.data || [];
        const validAccounts = accounts.filter(
          (account) => account.userId !== null
        );
        setNetBalance(validAccounts.reduce((sum, acc) => sum + acc.amount, 0));

        const monthlyCounts = Array(12).fill(0);
        transactions.forEach((txn) => {
          const month = dayjs(txn.transactionDate).month();
          monthlyCounts[month]++;
        });
        setMonthlyTxnData(monthlyCounts);

        const categoryTotals = {};
        expenses.forEach((txn) => {
          const category = txn.category || "Others";
          categoryTotals[category] =
            (categoryTotals[category] || 0) + txn.amountSpent;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        setPieChartData({
          labels,
          datasets: [
            {
              label: "Expense Category",
              data,
              backgroundColor: [
                "#3f51b5",
                "#e91e63",
                "#4caf50",
                "#ff9800",
                "#9c27b0",
                "#00acc1",
                "#8bc34a",
                "#ff5722",
                "#cddc39",
                "#9e9e9e",
              ],
            },
          ],
        });

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

        setTopUsersData({
          labels: sortedUsers.map((u) => u.name),
          datasets: [
            {
              label: "Total Spent (₹)",
              data: sortedUsers.map((u) => u.total),
              backgroundColor: "#1976d2",
            },
          ],
        });

        const monthlyUserCounts = Array(12).fill(0);
        allUsers.forEach((user) => {
          const month = dayjs(user.createdAt).month();
          monthlyUserCounts[month]++;
        });
        setUserGrowthData(monthlyUserCounts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const dynamicLineChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Transactions",
        data: monthlyTxnData,
        fill: false,
        borderColor: "#3f51b5",
        tension: 0.4,
      },
    ],
  };

  const dynamicUserGrowthChart = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: userGrowthData,
        backgroundColor: "#1976d2",
      },
    ],
  };

  const cardData = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <PeopleIcon />,
      color: "primary.main",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: (
        <Avatar src="https://cdn-icons-png.flaticon.com/512/219/219986.png" />
      ),
      color: "success.main",
    },
    {
      title: "Total Income",
      value: `₹ ${totalIncome.toLocaleString()}`,
      icon: <TrendingUpIcon />,
      color: "success.dark",
    },
    {
      title: "Total Expense",
      value: `₹ ${totalExpense.toLocaleString()}`,
      icon: <TrendingDownIcon />,
      color: "error.main",
    },
    {
      title: "Net Balance",
      value: `₹ ${netBalance.toLocaleString()}`,
      icon: <AccountBalanceWalletIcon />,
      color: "info.main",
    },
    {
      title: "Total Transactions",
      value: totalTransaction,
      icon: <EqualizerIcon />,
      color: "secondary.main",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                boxShadow: 4,
                borderRadius: 3,
              }}
            >
              <Avatar sx={{ bgcolor: card.color, mr: 2 }}>{card.icon}</Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {card.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Monthly Transaction Volume
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={dynamicLineChartData}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Expense Distribution by Category
            </Typography>
            <Box sx={{ height: 300 }}>
              {pieChartData && (
                <Pie
                  data={pieChartData}
                  options={{ maintainAspectRatio: false }}
                />
              )}
            </Box>
          </Card>
        </Grid>
        {topUsersData && (
  <>
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          User Growth Over Time
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar
            data={dynamicUserGrowthChart}
            options={{ maintainAspectRatio: false }}
          />
        </Box>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Top 5 Users by Spending
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar
            data={topUsersData}
            options={{
              ...horizontalBarOptions,
              maintainAspectRatio: false,
            }}
          />
        </Box>
      </Card>
    </Grid>
  </>
)}

      </Grid>
    </Container>
  );
};
