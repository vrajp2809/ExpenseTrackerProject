/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";


const transTypeModel = {
  income:"67d96f293d792b771aa6c4b0",
  expense:"67d96f403d792b771aa6c4b3",
}

export const AddTransaction = () => {
  const {register, handleSubmit,reset} = useForm();

  const [transactionType, settransactionType] = useState("expense")
  const [categories, setcategories] = useState([]);
  const [accounts, setaccounts] = useState([]);
  



  

  const handleTransactionTypeChange = (e)=>{
    
    settransactionType(e.target.value);
  }


  useEffect(()=>{
    const fetchCategory = async ()=>{
      try{
        //fetching transaction category
        const selectTypeId = transTypeModel[transactionType];
        const response = await axios.get('/getTranCatByTranType/'+selectTypeId);
        setcategories(response.data.data);


        //fetching payment/account types
        const userId = localStorage.getItem("id");
        const response1 = await axios.get('/account/'+userId);
        setaccounts(response1.data.data);

        
      }catch(error)
      {
        console.log("error :",error);
      }
    };
    fetchCategory();
  },[transactionType])




  const submitHandler = async (data)=>{
    try{
      const formData =new FormData();
      formData.append("userId",localStorage.getItem("id"));
      formData.append("amountSpent",data.amount);
      formData.append("paidTo",data.party);
      formData.append("transactionDate",data.date);
      formData.append("accountId",data.type);
      formData.append("categoryId",data.category);
      formData.append("notes",data.notes);
      formData.append("attachmentURL",data.attachment[0]);

      const res = await axios.post("/expense",formData);
      console.log(res.data);

      
      alert("Transaction added successfully!");
      reset();

    }catch(error)
    {
      console.log("Error adding expense : ",error);
      alert("Failed to add expense.");
    }


  }


  return (
    <div>
      <div className="card card-primary card-outline mb-4">
        {/*begin::Header*/}
        <div className="card-header d-flex justify-content-center">
          <center>
            <div className="card-title" style={{ textAlign: "center" }}>
            <strong>
                 New Transaction
            </strong>
            </div>
          </center>
        </div>
        {/*end::Header*/}
        {/*begin::Form*/}
        <form onSubmit={handleSubmit(submitHandler)}>
          {/*begin::Body*/}
          <div className="card-body">
            {/* begin::Transaction Category */}
            <div
              id="transactionCategory"
              className="form-group"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="transactionCategory"
                  id="expense"
                  value="expense"
                  defaultValue="expense"
                  checked={transactionType === "expense"}
                  onChange={handleTransactionTypeChange}
                />
                <label className="form-check-label" htmlFor="gridRadios1">
                  {" "}
                  Expense{" "}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="transactionCategory"
                  id="income"
                  value="income"
                  checked={transactionType === "income"}
                  defaultValue="income"
                  onChange={handleTransactionTypeChange}
                />
                <label className="form-check-label" htmlFor="gridRadios2">
                  {" "}
                  Income{" "}
                </label>
              </div>
             
            </div>
            {/* end::Transaction Category */}

            {/* begin::Transaction Data */}
                <br />
            <div className="form-group">
                <label className="form-label">
                    <strong>
                        Date & Time
                    </strong>
                </label>
                <div className="d-flex gap-2">
                    <input type="date" id="date" className="form-control" {...register("date")} required />
                    {/* <input type="time" id="time" className="form-control" required /> */}
                </div>
            </div>
                <br />
            <div className="form-group">
              <label htmlFor="party" className="form-label">
                <strong>
                    Party Name
                </strong>
              </label>
              <input type="text" id="party" className="form-control" {...register("party")} required />
            </div>

                <br />
            <div className="form-group">
              <label htmlFor="type" className="form-label">
                <strong>
                    Payment Type
                </strong>
              </label>
              <select className="form-select" id="type" {...register("type")} >
                <option value="">Select Type</option>
                {
                  accounts.map((account)=>(
                    <option key={account._id} value={account._id} >
                      {account.title}
                    </option>
                  ))
                }
              </select>
              
            </div>

            <br />
            <div>
              <label htmlFor="category" className="form-label">
                <strong>
                    Category
                </strong>
              </label>
              <select className="form-select" id="category" {...register("category")} >
                <option value="">Select Category</option>
                {
                  categories.map((category)=>(
                    <option key={category._id} value={category._id} >
                      {category.category}
                    </option>
                  ))
                }
              </select>
            </div>


                <br />
            <div className="input-group mb-3" style={{ marginTop: "1rem" }}>
              <label htmlFor="amount" className="input-group-text">
                <strong>
                    Amount
                </strong>
              </label>
              <span className="input-group-text">₹</span>
              <input
                id="amount"
                type="number"
                className="form-control"
                aria-label="Amount (to the nearest rupee)"
                {...register("amount")}
                required
              />
              <span className="input-group-text">.00</span>
            </div>

            <br />
            {/* begin::Notes */}
            <div className="form-group">
              <label htmlFor="validationCustom01" className="form-label">
                <strong>
                    Notes
                </strong>
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustom01"
                {...register("notes")}
              />
              <div className="valid-feedback">Looks good!</div>
            </div>
            {/* end::Notes */}
            {/* begin::Upload */}


                <br />
            <div className="form-group">
              <label htmlFor="inputGroupFile02">
                <strong>
                    Attach reciept or bill
                </strong>
              </label>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  id="inputGroupFile02"
                  {...register("attachment")}
                />
                <label className="input-group-text" htmlFor="inputGroupFile02">
                  Upload
                </label>
              </div>
            </div>
            {/* end::Upload */}
          </div>
          {/*end::Body*/}
          {/*begin::Footer*/}
          <center>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </center>
          {/*end::Footer*/}
        </form>
        {/*end::Form*/}
      </div>
    </div>
  );
};
