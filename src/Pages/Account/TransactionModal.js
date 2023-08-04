import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const TransactionModal = ({ show, onHide, handleTransactionSubmit, rowData, transactionType }) => {
  const [fromId, setfromId] = useState();
  const [userId, setUserId] = useState();

  const [parentName, setParentName] = useState();
  const [parentBalance, setParentBalance] = useState(0);
  const [parentNewBalance, setParentNewBalance] = useState(0);
  const [clickedUserName, setClickedUserName] = useState();
  const [clickedUserBalance, setClickedUserBalance] = useState(0);
  const [clickedUserNewBalance, setClickedUserNewBalance] = useState(0);
  const [clickedUserProfit, setClickedUserProfit] = useState(0);
  const [clickedUserNewProfit, setClickedUserNewProfit] = useState(0);
  const [transactionCode, setTransactionCode] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (rowData) {
      setParentName(rowData.parentUser.username);
      setClickedUserName(rowData.username);
      setClickedUserBalance(rowData.balance);
      setUserId(rowData._id);
      // Set other initial values here based on the rowData prop...
    }
    setClickedUserNewProfit(0);
    setClickedUserNewBalance(0);
    setParentNewBalance(0);
    setAmount("");
    setRemarks("");
    setTransactionCode("");
  }, [rowData, transactionType]);

  const handleAmountChange = (event) => {
    const { value } = event.target;
    const Amount = parseFloat(value) && parseFloat(value) > 0 ? parseFloat(value) : 0;
    let newParentBalance = 0;
    let clickedUserNewBalance = 0;
    let clickedUserNewProfit = 0;
    // Calculate the new parent balance and profit
    if (transactionType === "credit") {
      newParentBalance = parentBalance - Amount;
      clickedUserNewBalance = clickedUserBalance + Amount;
      clickedUserNewProfit = clickedUserProfit + Amount;
    } else {
      newParentBalance = parentBalance + Amount;
      clickedUserNewBalance = clickedUserBalance - Amount;
      clickedUserNewProfit = clickedUserProfit - Amount;
    }

    setAmount(Amount);
    setParentNewBalance(newParentBalance);
    setClickedUserNewBalance(clickedUserNewBalance);
    setClickedUserNewProfit(clickedUserNewProfit);
  };
  const modalHeaderClass = transactionType === "credit" ? "bg-success" : "bg-danger";
  const transactionText = transactionType === "credit" ? "DEPOSIT" : "WITHDRAW";
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className={`text-white ${modalHeaderClass}`}>
        <Modal.Title>{transactionText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your Withdraw form fields here */}
        <Form className="form-horizontal">
          <div className=" row mb-4">
            <Form.Label htmlFor="inputName" className="col-md-4 form-label">
              {parentName}
            </Form.Label>
            <div className="col-md-4">
              <Form.Control
                type="number"
                value={parentBalance}
                onChange={(e) => setParentBalance(e.target.value)}
                readOnly
              />
            </div>
            <div className="col-md-4">
              <Form.Control
                type="number"
                value={parentNewBalance}
                onChange={(e) => setParentNewBalance(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className=" row mb-4">
            <Form.Label htmlFor="inputName" className="col-md-4 form-label">
              {clickedUserName}
            </Form.Label>
            <div className="col-md-4">
              <Form.Control
                type="number"
                value={clickedUserBalance}
                onChange={(e) => setClickedUserBalance(e.target.value)}
                readOnly
              />
            </div>
            <div className="col-md-4">
              <Form.Control
                type="number"
                value={clickedUserNewBalance}
                onChange={(e) => setClickedUserNewBalance(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className=" row mb-4">
            <Form.Label htmlFor="inputName" className="col-md-4 form-label">
              Profit/Loss
            </Form.Label>
            <div className="col-md-4">
              <Form.Control
                type="number"
                value={clickedUserProfit}
                onChange={(e) => setClickedUserProfit(e.target.value)}
                readOnly
              />
            </div>
            <div className="col-md-4">
              <Form.Control
                type="number"
                value={clickedUserNewProfit}
                onChange={(e) => setClickedUserNewProfit(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className=" row mb-4">
            <Form.Label htmlFor="inputName" className="col-md-4 form-label">
              Amount
            </Form.Label>
            <div className="col-md-8">
              <Form.Control type="number" value={amount} onChange={handleAmountChange} />
            </div>
          </div>

          <div className=" row mb-4">
            <Form.Label htmlFor="inputName" className="col-md-4 form-label">
              Remarks
            </Form.Label>
            <div className="col-md-8">
              <Form.Control as="textarea" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
          </div>

          <div className=" row mb-4">
            <Form.Label htmlFor="inputName" className="col-md-4 form-label">
              Transaction Code
            </Form.Label>
            <div className="col-md-8">
              <Form.Control
                type="number"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
              />
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => handleTransactionSubmit(amount, remarks, transactionCode, transactionType, userId)}
        >
          {transactionText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
