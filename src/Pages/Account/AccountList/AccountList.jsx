import React, { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the FormInput component
import { showAlert } from "../../../utils/alertUtils";
import { downloadCSV } from "../../../utils/csvUtils";
import TransactionModal from "../TransactionModal";
import { createTransaction, deleteData, getAllData } from "../accountService";

export default function AccountList() {
  const location = useLocation();
  let login_user_id = "";
  const user = JSON.parse(localStorage.getItem("user_info"));
  if (user.role !== "system_owner") {
    login_user_id = user._id;
  }

  const { id } = useParams();
  const initialParentId = id ? id : login_user_id;
  const [parentId, setParentId] = useState(initialParentId);
  const Export = ({ onExport }) => (
    <Button className="btn btn-secondary" onClick={(e) => onExport(e.target.value)}>
      Export
    </Button>
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [serverError, setServerError] = useState(null);

  // popup fields
  const [rowData, setRowData] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const { creditPoints, role, rate, _id } = JSON.parse(localStorage.getItem("user_info")) || {};
  const [selectedRole, setSelectedRole] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    // Add more filters here if needed
  });
  const roleHierarchy = {
    system_owner: ["super_admin"],
    super_admin: ["admin", "super_master", "master", "agent"],
    admin: ["super_master", "master", "agent"],
    super_master: ["master", "agent"],
    master: ["agent"],
  };

  const allowedRoles = roleHierarchy[role] || [];

  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => (currentPage - 1) * perPage + (index + 1),
      sortable: false,
    },
    {
      name: "USERNAME",
      selector: (row) => [row.username],
      sortable: true,
      sortField: "username",
      cell: (row) =>
        row.hasChild ? (
          <div>
            {/* <Link to={`${process.env.PUBLIC_URL}/account-list/`} state={{ parentId: row._id }} >{row.username}</Link> */}
            <Link to={`${process.env.PUBLIC_URL}/account-list/` + row._id} target="_blank">
              {row.username}
            </Link>
          </div>
        ) : (
          <span>{row.username}</span>
        ),
    },
    {
      name: "FULL NAME",
      selector: (row) => [row.fullName],
      sortable: true,
      sortField: "fullName",
    },
    {
      name: "MOBILE NUMBER",
      selector: (row) => [row.mobileNumber],
      sortable: true,
      sortField: "mobileNumber",
    },
    {
      name: "RATE",
      selector: (row) => [row.rate],
      sortable: true,
      sortField: "rate",
    },
    {
      name: "BALANCE",
      selector: (row) => [row.balance],
      sortable: true,
      sortField: "balance",
    },
    {
      name: "ACCOUNT TYPE",
      selector: (row) => [row.role],
      sortable: true,
      sortField: "role",
    },
    {
      name: "ACTION",
      width: "200px",
      cell: (row) => (
        <div className="d-flex justify-content-end align-items-center">
          <Button variant="success" onClick={() => handleDepositClick(row)} className="btn btn-lg ">
            D
          </Button>
          <Button variant="danger" onClick={() => handleWithdrawClick(row)} className="btn btn-lg ms-2 me-2">
            W
          </Button>
          {row.role === "super_admin" && (
            <Link
              to={`${process.env.PUBLIC_URL}/super-admin-form`}
              state={{ id: row._id }}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-edit"></i>
            </Link>
          )}
          {row.role === "admin" && (
            <Link
              to={`${process.env.PUBLIC_URL}/admin-form`}
              state={{ id: row._id }}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-edit"></i>
            </Link>
          )}
          {row.role === "super_master" && (
            <Link
              to={`${process.env.PUBLIC_URL}/super-master-form`}
              state={{ id: row._id }}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-edit"></i>
            </Link>
          )}
          {row.role === "master" && (
            <Link
              to={`${process.env.PUBLIC_URL}/master-form`}
              state={{ id: row._id }}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-edit"></i>
            </Link>
          )}
          {row.role === "agent" && (
            <Link
              to={`${process.env.PUBLIC_URL}/agent-form`}
              state={{ id: row._id }}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-edit"></i>
            </Link>
          )}
          {/* <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button> */}
        </div>
      ),
    },
  ];

  const actionsMemo = React.useMemo(() => <Export onExport={() => handleDownload()} />, []);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  let selectdata = [];
  // const handleRowSelected = React.useCallback((state) => {
  //   setSelectedRows(state.selectedRows);
  //   const selectedUser = state.selectedRows[0]; // Assuming only one user can be selected at a time
  //   if (selectedUser) {
  //     setParentId(selectedUser._id);
  //   }
  // }, []);

  const contextActions = React.useMemo(() => {
    const Selectdata = () => {
      if (window.confirm(`download:\r ${selectedRows.map((r) => r.SNO)}?`)) {
        setToggleCleared(!toggleCleared);
        data.map((e) => {
          selectedRows.map((sr) => {
            if (e.id === sr.id) {
              selectdata.push(e);
            }
          });
        });
        downloadCSV(selectdata);
      }
    };

    return <Export onExport={() => Selectdata()} icon="true" />;
  }, [data, selectdata, selectedRows]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const result = await getAllData({
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery,
        parentId: parentId,
        role: allowedRoles,
      });

      setData(result.records);
      setTotalRows(result.totalRecords);
      setLoading(false);
    } catch (error) {
      // Handle error
      console.error("Error fetching :", error);
      // Display error message or show notification to the user
      // Set the state to indicate the error condition
      setLoading(false);
    }
  };

  const removeRow = async (id) => {
    setLoading(true);
    try {
      const success = await deleteData(id);
      if (success) {
        fetchData(currentPage);
        setLoading(false);
      }
    } catch (error) {
      // Handle error
      console.error("Error removing :", error);
      // Display error message or show notification to the user
      // Set the state to indicate the error condition
      setLoading(false);
    }
  };

  const handleSort = (column, sortDirection) => {
    // simulate server sort
    setSortBy(column.sortField);
    setDirection(sortDirection);
    setCurrentPage(1);
    fetchData(currentPage);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleDownload = async () => {
    await downloadCSV("users/getAllUsers", searchQuery, "account.csv");
  };

  const handleDelete = (id) => {
    showAlert(id, removeRow);
  };

  const handleTransactionSubmit = async (amount, remarks, transactionCode, transactionType, userId) => {
    try {
      const result = await createTransaction({
        userId: login_user_id,
        fromId: userId,
        points: amount,
        type: transactionType,
        remark: remarks,
        transactionCode: transactionCode,
      });
      if (!result.success) {
        setServerError(result.message);
      } else {
        setShowTransactionModal(false);
        fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
      }
      // Close the modal after handling the submission
    } catch (error) {
      // Handle any errors that occurred during the transaction submission
      console.error("Error submitting transaction:", error);
      // Optionally, set a state to show an error message to the user
    }
    // Handle Deposit form submission here, using depositAmount and depositRemarks
    // Close the modal after handling the submission
    //setShowTransactionModal(false);
  };

  const handleDepositClick = (row) => {
    // Set initial values for the Deposit modal based on the row data
    setShowTransactionModal(true);
    setRowData(row);
    setTransactionType("credit");
  };

  const handleWithdrawClick = (row) => {
    // Set initial values for the Withdraw modal based on the row data
    setShowTransactionModal(true);
    setRowData(row);
    setTransactionType("debit");
  };

  const handleFilterClick = () => {
    const newFilters = {
      role: selectedRole !== "" ? selectedRole : null,
    };
    setFilters(newFilters);
    // Fetch data with the updated filters object
    fetchData(currentPage, sortBy, direction, searchQuery, newFilters);
  };

  const resetFilters = () => {
    // Clear the filter values
    setSelectedRole("");

    // Add more filter states if needed

    // Fetch data with the updated filters object
    fetchData(currentPage, sortBy, direction, searchQuery, {
      role: "",
      // Add more filters here if needed
    });
  };

  useEffect(() => {
    setData([]);
    if (searchQuery !== "") {
      fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
    }
    return () => {
      setData([]);
    };
  }, [perPage, searchQuery, parentId]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">ALL ACCOUNTS</h1>
        </div>
        <div className="ms-auto pageheader-btn">
          {role === "system_owner" && (
            <Link
              to={`${process.env.PUBLIC_URL}/super-admin-form`}
              className="btn btn-primary btn-icon text-white me-3"
            >
              <span>
                <i className="fe fe-plus"></i>&nbsp;
              </span>
              CREATE ACCOUNT
            </Link>
          )}
          {role !== "system_owner" && (
            <Dropdown className="dropdown btn-group">
              <Dropdown.Toggle variant="" type="button" className="btn btn-primary dropdown-toggle">
                <i className="fe fe-plus"></i>&nbsp;CREATE ACCOUNT
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                {allowedRoles.includes("admin") && (
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/admin-form`}>Admin</Link>
                  </Dropdown.Item>
                )}

                {allowedRoles.includes("super_master") && (
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/super-master-form`}>Super Master</Link>
                  </Dropdown.Item>
                )}

                {allowedRoles.includes("master") && (
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/master-form`}>Master</Link>
                  </Dropdown.Item>
                )}

                {allowedRoles.includes("agent") && (
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/agent-form`}>Agent</Link>
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
          {/* <Link to="#" className="btn btn-success btn-icon text-white">
            <span>
              <i className="fe fe-log-in"></i>&nbsp;
            </span>
            Export
          </Link> */}
        </div>
      </div>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            {/* <Card.Header>

              <FormSelect
                label="Role"
                name="sportId"
                value={selectedRole} // Set the selectedRole as the value
                onChange={(name, selectedValue) => setSelectedRole(selectedValue)} // Update the selectedSport
                onBlur={() => { }} // Add an empty function as onBlur prop
                error=""
                width={2}
                options={allowedRoles}
              />

              <CCol xs={12}>
                <div className="d-grid gap-2 d-md-block">
                  <CButton color="primary" type="submit" onClick={handleFilterClick} className="me-3 mt-6">
                    {loading ? <CSpinner size="sm" /> : "Filter"}
                  </CButton>
                  <button
                    onClick={resetFilters} // Call the resetFilters function when the "Reset" button is clicked
                    className="btn btn-danger btn-icon text-white mt-6"
                  >
                    Reset
                  </button>
                </div>
              </CCol>
            </Card.Header> */}
            <Card.Body>
              <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} />
              <div className="table-responsive export-table">
                <DataTable
                  columns={columns}
                  data={data}
                  actions={actionsMemo}
                  contextActions={contextActions}
                  // onSelectedRowsChange={handleRowSelected}
                  // clearSelectedRows={toggleCleared}
                  //selectableRows
                  pagination
                  highlightOnHover
                  progressPending={loading}
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  sortServer
                  onSort={handleSort}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <TransactionModal
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        handleTransactionSubmit={handleTransactionSubmit}
        rowData={rowData}
        transactionType={transactionType}
      />
    </div>
  );
}
