const ExpenseModel = require("../models/ExpenseModel");
const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const TransactionCategoryModel = require("../models/TransactionCategoryModel");
const tranTypeModel = require("../models/TransactionTypeModel");
const AccountModel = require("../models/AccountsModel");
const fs = require("fs");
const path = require("path");

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("attachmentURL");

const expensedatabyid = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Fetch all expenses of the logged-in user
    const expenses = await ExpenseModel.find({ userId });

    // 2️⃣ Fetch category and transaction type separately
    const detailedExpenses = await Promise.all(
      expenses.map(async (expense) => {
        // Fetch category details
        const category = await TransactionCategoryModel.findById(
          expense.categoryId
        );

        // Fetch transaction type details
        const transactionType = category
          ? await tranTypeModel.findById(category.TranTypeId)
          : null;

        return {
          ...expense.toObject(),
          category: category ? category.category : "N/A",
          transactionType: transactionType ? transactionType.tranType : "N/A",
        };
      })
    );

    res.status(200).json({
      message: "Expenses fetched successfully by id",
      data: detailedExpenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching expenses",
      error: error.message,
    });
  }
};

const getAllExpensesByLoggedinUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const expenses = await ExpenseModel.find({ userId })
      .populate("accountId", "title") // ✅ Get account details
      .populate({
        path: "categoryId",
        select: "category TranTypeId", // ✅ Get category name & TranTypeId
        populate: {
          path: "TranTypeId",
          select: "tranType", // ✅ Get transaction type (income/expense)
        },
      })
      .exec();

    res.status(200).json({
      message: "expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching expenses of loggedin user",
      error: error.message,
    });
  }
};

// ✅ Get All Expenses
const getAllExpenses = async (req, res) => {
  try {
    // Fetch all expenses
    const expenses = await ExpenseModel.find().populate("userId").populate("categoryId");

    // Filter out expenses where user is null (deleted user)
    const validExpenses = expenses.filter((e) => e.userId !== null);

    // Fetch category and transaction type details for each expense
    const detailedExpenses = await Promise.all(
      validExpenses.map(async (expense) => {
        const category = await TransactionCategoryModel.findById(expense.categoryId);
        const transactionType = category
          ? await tranTypeModel.findById(category.TranTypeId)
          : null;

        return {
          ...expense.toObject(),
          category: category ? category.category : "N/A",
          transactionType: transactionType ? transactionType.tranType : "N/A",
        };
      })
    );

    res.status(200).json({
      message: "All Expenses fetched successfully",
      data: detailedExpenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};


// ✅ Add Expense Without Attachment
const addExpense = async (req, res) => {
  try {
    const newExpense = await ExpenseModel.create(req.body);
    res.status(200).json({
      message: "Expense added successfully",
      data: newExpense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding expense",
      error: error.message,
    });
  }
};

const clearUploadsFolder = () => {
  const uploadDir = path.join(__dirname, "../uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${file}:`, err);
        } else {
          console.log(`Deleted: ${file}`);
        }
      });
    });
  });
};

// ✅ Add Expense With Attachment (Image Upload)
const addExpenseWithAttachment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        message: "Multer upload error",
        error: err.message,
      });
    }

    try {
      let attachmentURL = null;
      const uploadedFilePath = req.file ? req.file.path : null;

      // Upload to Cloudinary if a file is present
      if (req.file) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
          req.file
        );
        attachmentURL = cloudinaryResponse.secure_url;
      }

      //Retrieve the category
      const category = await TransactionCategoryModel.findById(
        req.body.categoryId
      );
      if (!category) {
        return res.status(400).json({
          message: "Invalid category id",
        });
      }

      //Get the transaction type
      const transactionType = await tranTypeModel.findById(category.TranTypeId);
      if (!transactionType) {
        return res.status(400).json({ message: "invalid transaction type " });
      }

      //fetching the user's account
      const account = await AccountModel.findById(req.body.accountId);
      if (!account) {
        return res.status(400).json({ message: "invalid account ID" });
      }

      const amountSpent = Number(req.body.amountSpent); // Ensure it's a number

      console.log(
        "🚀 Amount Spent (Converted to Number):",
        amountSpent,
        typeof amountSpent
      );
      console.log(
        "💰 Current Account Balance:",
        account.amount,
        typeof account.amount
      );

      if (transactionType.tranType === "expense") {
        account.amount -= amountSpent;
      } else if (transactionType.tranType === "income") {
        account.amount += amountSpent;
      }

      console.log(
        "✅ Updated Account Balance:",
        account.amount,
        typeof account.amount
      );

      await account.save();

      // Create new expense with Cloudinary URL
      const newExpense = await ExpenseModel.create({
        ...req.body,
        attachmentURL: attachmentURL,
      });

      if (uploadedFilePath) {
        fs.unlink(uploadedFilePath, (err) => {
          if (err) {
            console.error("Error deleting uploaded file:", err);
          } else {
            console.log("Uploaded file deleted:", uploadedFilePath);
          }
        });
      }

      res.status(201).json({
        message: "Expense added successfully",
        data: newExpense,
      });

      setTimeout(() => {
        clearUploadsFolder();
      }, 500);
    } catch (error) {
      res.status(500).json({
        message: "Error adding expense",
        error: error.message,
      });
    }
  });
};

const deleteExpenseById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedExpense = await ExpenseModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Expense Delted Successfully",
      data: deletedExpense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Expense  ",
      error: error.message,
    });
  }
};



const getDashboardData = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all expenses of the user
    const expenses = await ExpenseModel.find({ userId });
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amountSpent, 0);

    // Fetch all income transactions
    const incomeTransactions = await ExpenseModel.find({ userId }).populate({
      path: "categoryId",
      select: "category TranTypeId",
      populate: { path: "TranTypeId", select: "tranType" },
    });

    const totalIncome = incomeTransactions
      .filter((txn) => txn.categoryId.TranTypeId.tranType === "income")
      .reduce((sum, txn) => sum + txn.amountSpent, 0);

    // Calculate balance & net savings
    const totalBalance = totalIncome - totalExpense;
    const netSaving = totalIncome - totalExpense;

    // Find top expense category
    const categoryMap = {};
    expenses.forEach((exp) => {
      categoryMap[exp.categoryId] =
        (categoryMap[exp.categoryId] || 0) + exp.amountSpent;
    });

    const topExpenseCategoryId = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b
    );

    const topExpenseCategory = await TransactionCategoryModel.findById(
      topExpenseCategoryId
    );

    // Prepare response
    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpense,
      netSaving,
      topExpenseCategory: topExpenseCategory ? topExpenseCategory.category : "N/A",
      expenseBreakdown: {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            data: Object.values(categoryMap),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      incomeVsExpense: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: [totalIncome, totalExpense],
            backgroundColor: ["#4CAF50", "#F44336"],
          },
        ],
      },
      recentTransactions: expenses.slice(-5).reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

module.exports = {
  getAllExpensesByLoggedinUser,
  getAllExpenses,
  addExpense,
  addExpenseWithAttachment,
  expensedatabyid,
  deleteExpenseById,
  getDashboardData,
};
