const accountModel = require("../models/AccountsModel");

const getAllAccounts = async (req, res) => {
  try {
    const foundAccounts = await accountModel.find().populate("userId");

    // Filter out accounts where the user no longer exists
    const validAccounts = foundAccounts.filter((acc) => acc.userId !== null);

    res.status(200).json({
      message: "All accounts found",
      data: validAccounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error finding accounts",
      error: error.message,
    });
  }
};

const createAccount = async (req, res) => {
  try {
    const createdAccount = await accountModel.create(req.body);

    res.status(201).json({
      message: "Account created successfully",
      data: createdAccount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in creating account",
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await accountModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Account Deleted successfully",
      data: deletedAccount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in deleting account",
      error: error.message,
    });
  }
};

const getAccountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundAccount = await accountModel.find({ userId });

    res.status(200).json({
      message: "Account fetched successfully",
      data: foundAccount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching account",
      error: error.message,
    });
  }
};

module.exports = {
  getAccountByUserId,
  deleteAccount,
  createAccount,
  getAllAccounts,
};
