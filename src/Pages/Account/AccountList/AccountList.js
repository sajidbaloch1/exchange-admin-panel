import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Row, Card, Col, Button, Dropdown, Modal, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { getAllData, deleteData } from "../accountService";
import { downloadCSV } from '../../../utils/csvUtils';
import { showAlert } from '../../../utils//alertUtils';
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the FormInput component

export default function AccountList() {
  const location = useLocation();
  let login_user_id = '';
  const user = JSON.parse(localStorage.getItem('user_info'));
  if (user.role !== 'system_owner') {
    login_user_id = user._id;
  }
  const { id } = useParams();
  const initialParentId = id ? id : login_user_id;
  const [parentId, setParentId] = useState(initialParentId);
  const Export = ({ onExport }) => (
    <Button className="btn btn-secondary" onClick={(e) => onExport(e.target.value)}>Export</Button>
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawRemarks, setWithdrawRemarks] = useState('');

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositRemarks, setDepositRemarks] = useState('');


  const [selectedUserIdStack, setSelectedUserIdStack] = useState([]);
  const { creditPoints, role, rate, _id } = JSON.parse(localStorage.getItem('user_info')) || {};
  const roleHierarchy = {

    super_admin: ['admin', 'super_master', 'master', 'agent'],
    admin: ['super_master', 'master', 'agent'],
    super_master: ['master', 'agent'],
    master: ['agent'],
  };

  const allowedRoles = roleHierarchy[role] || [];

  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => ((currentPage - 1) * perPage) + (index + 1),
      sortable: false,
    },
    {
      name: "USERNAME",
      selector: (row) => [row.username],
      sortable: true,
      sortField: 'username',
      cell: (row) => (
        row.hasChild ? (
          <div>
            {/* <Link to={`${process.env.PUBLIC_URL}/account-list/`} state={{ parentId: row._id }} >{row.username}</Link> */}
            <Link
              to={`${process.env.PUBLIC_URL}/account-list/` + row._id} target="_blank"
            >
              {row.username}
            </Link>
          </div>
        ) : (
          <span>{row.username}</span>
        )
      ),
    },
    {
      name: "FULL NAME",
      selector: (row) => [row.fullName],
      sortable: true,
      sortField: 'fullName'
    },
    {
      name: "MOBILE NUMBER",
      selector: (row) => [row.mobileNumber],
      sortable: true,
      sortField: 'mobileNumber'
    },
    {
      name: "RATE",
      selector: (row) => [row.rate],
      sortable: true,
      sortField: 'rate'
    },
    {
      name: "BALANCE",
      selector: (row) => [row.balance],
      sortable: true,
      sortField: 'balance'
    },
    {
      name: "ACCOUNT TYPE",
      selector: (row) => [row.role],
      sortable: true,
      sortField: 'role'
    },
    {
      name: "CITY",
      selector: (row) => [row.city],
      sortable: true,
      sortField: 'city'
    },
    {
      name: 'ACTION',
      width: '200px',
      cell: row => (
        <div>
          {row.role === 'super_admin' &&
            <Link to={`${process.env.PUBLIC_URL}/super-admin-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          }
          {row.role === 'admin' &&
            <Link to={`${process.env.PUBLIC_URL}/admin-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          }
          {row.role === 'super_master' &&
            <Link to={`${process.env.PUBLIC_URL}/super-master-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          }
          {row.role === 'master' &&
            <Link to={`${process.env.PUBLIC_URL}/master-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          }
          {row.role === 'agent' &&
            <Link to={`${process.env.PUBLIC_URL}/agent-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          }

          <Button variant="success" onClick={() => handleDepositClick(row)} className="btn btn-lg ms-2">
            D
          </Button>
          <Button variant="danger" onClick={() => handleWithdrawClick(row)} className="btn btn-lg ms-2">
            W
          </Button>

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

      const result = await getAllData(page, perPage, sortBy, direction, searchQuery, parentId);

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

  const handlePageChange = page => {
    setCurrentPage(page);
    fetchData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleDownload = async () => {
    await downloadCSV('users/getAllUsers', searchQuery, 'account.csv');
  };

  const handleDelete = (id) => {
    showAlert(id, removeRow);
  };

  const WithdrawModal = () => {
    const handleWithdrawSubmit = () => {
      // Handle Withdraw form submission here, using withdrawAmount and withdrawRemarks
      // Close the modal after handling the submission
      setShowWithdrawModal(false);
    };

    return (
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your Withdraw form fields here */}
          <Form className="form-horizontal">
            <div className=" row mb-4">

              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Creator Name</Form.Label>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className=" row mb-4">

              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Current Click User</Form.Label>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className=" row mb-4">

              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Profit/Loss</Form.Label>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Amount</Form.Label>
              <div className="col-md-8">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Remarks</Form.Label>
              <div className="col-md-8">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={withdrawRemarks}
                  onChange={(e) => setWithdrawRemarks(e.target.value)}
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Transaction Code</Form.Label>
              <div className="col-md-8">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
            </div>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleWithdrawSubmit}>
            Withdraw
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };


  const DepositModal = () => {
    const handleDepositSubmit = () => {
      // Handle Deposit form submission here, using depositAmount and depositRemarks
      // Close the modal after handling the submission
      setShowDepositModal(false);
    };

    return (
      <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your Deposit form fields here */}

          <Form className="form-horizontal">
            <div className=" row mb-4">

              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Creator Name</Form.Label>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Current Click User</Form.Label>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className=" row mb-4">

              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Profit/Loss</Form.Label>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Amount</Form.Label>
              <div className="col-md-8">
                <Form.Control
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Remarks</Form.Label>
              <div className="col-md-8">
                <Form.Control
                  as="textarea"
                  value={depositRemarks}
                  onChange={(e) => setDepositRemarks(e.target.value)}
                />
              </div>
            </div>

            <div className=" row mb-4">
              <Form.Label htmlFor="inputName" className="col-md-4 form-label">Transaction Code</Form.Label>
              <div className="col-md-8">
                <Form.Control
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
            </div>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepositModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDepositSubmit}>
            Deposit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleDepositClick = (row) => {
    // Set initial values for the Deposit modal based on the row data
    setDepositAmount('');
    setDepositRemarks('');
    setSelectedUserIdStack([row._id]);
    setShowDepositModal(true);
  };

  const handleWithdrawClick = (row) => {
    // Set initial values for the Withdraw modal based on the row data
    setWithdrawAmount('');
    setWithdrawRemarks('');
    setSelectedUserIdStack([row._id]);
    setShowWithdrawModal(true);
  };

  useEffect(() => {

    setData([])
    if (searchQuery !== '') {
      fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
    }
    return () => {
      setData([])
    }
  }, [perPage, searchQuery, parentId]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">ALL ACCOUNT</h1>

        </div>
        <div className="ms-auto pageheader-btn">
          {role === 'system_owner' &&
            <Link to={`${process.env.PUBLIC_URL}/super-admin-form`} className="btn btn-primary btn-icon text-white me-3">
              <span>
                <i className="fe fe-plus"></i>&nbsp;
              </span>
              CREATE ACCOUNT
            </Link>
          }
          {role !== 'system_owner' &&
            <Dropdown className="dropdown btn-group">
              <Dropdown.Toggle
                variant=""
                type="button"
                className="btn btn-primary dropdown-toggle"
              >
                <i className="fe fe-plus"></i>&nbsp;CREATE ACCOUNT
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                {allowedRoles.includes('admin') &&
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/admin-form`}>Admin</Link>
                  </Dropdown.Item>
                }

                {allowedRoles.includes('super_master') &&
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/super-master-form`}>Super Master</Link>
                  </Dropdown.Item>
                }

                {allowedRoles.includes('master') &&
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/master-form`}>Master</Link>
                  </Dropdown.Item>
                }

                {allowedRoles.includes('agent') &&
                  <Dropdown.Item className="dropdown-item">
                    <Link to={`${process.env.PUBLIC_URL}/agent-form`}>Agent</Link>
                  </Dropdown.Item>
                }
              </Dropdown.Menu>
            </Dropdown>
          }
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

            <Card.Body>
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loading={loading}
              />
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

      <WithdrawModal />
      <DepositModal />
    </div>
  );
}
