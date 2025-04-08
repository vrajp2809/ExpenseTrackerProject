/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export const UserAccount = () => {
  const { register, handleSubmit , reset} = useForm();

  const submitHandler = async (data) => {
    data.userId = localStorage.getItem("id");
    try {
      const res = await axios.post("/account", data);
      console.log(res.data.data);
      alert("Account Created Successfully!");
      reset();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="card card-primary card-outline mb-4">
        {/* Header */}
        <div className="card-header d-flex justify-content-center">
          <center>
            <div className="card-title" style={{ textAlign: "center" }}>
              <strong>Add Account</strong>
            </div>
          </center>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="card-body">
            {/* Account Type */}
            <div className="form-group">
              <label className="form-label">
                <strong>Account Type</strong>
              </label>
              <select className="form-select" {...register("title")} required>
                <option value="">Select Account Type</option>
                <option value="Wallet">Wallet</option>
                <option value="Bank">Bank</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <br />

            {/* Initial Amount */}
            <div className="input-group mb-3">
              <label htmlFor="amount" className="input-group-text">
                <strong>Initial Amount</strong>
              </label>
              <span className="input-group-text">₹</span>
              <input
                id="amount"
                type="number"
                className="form-control"
                {...register("amount")}
                required
              />
              <span className="input-group-text">.00</span>
            </div>

            <br />

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <strong>Description</strong>
              </label>
              <textarea
                className="form-control"
                {...register("description")}
                required
              />
            </div>

            <br />
          </div>

          {/* Footer */}
          <center>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </center>
        </form>
      </div>
    </div>
  );
};
