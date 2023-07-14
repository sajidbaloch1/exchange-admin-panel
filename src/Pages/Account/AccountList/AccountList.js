import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Col, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { getAllData, deleteData } from "../accountService";
import { downloadCSV } from '../../../utils/csvUtils';
import { showAlert } from '../../../utils//alertUtils';
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the FormInput component

export default function AccountList() {

  let login_user_id = '';
  const user = JSON.parse(localStorage.getItem('user_info'));
  if (user.role !== 'system_owner') {
    login_user_id = user._id;
  }

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

  const [parentId, setParentId] = useState(login_user_id);
  const [selectedUserIdStack, setSelectedUserIdStack] = useState([]);

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
            <Link to={`${process.env.PUBLIC_URL}/account-list/`} onClick={() => handleClick(row._id)}>{row.username}</Link>
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
      cell: row => (
        <div>
          <Link to={`${process.env.PUBLIC_URL}/account-edit/` + row._id} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button>
        </div>
      ),
    },
  ];

  const actionsMemo = React.useMemo(() => <Export onExport={() => handleDownload()} />, []);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  let selectdata = [];
  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
    const selectedUser = state.selectedRows[0]; // Assuming only one user can be selected at a time
    if (selectedUser) {
      setParentId(selectedUser._id);
    }
  }, []);

  const handleClick = (_id) => {
    const newSelectedUserIdStack = [...selectedUserIdStack, _id];
    setSelectedUserIdStack(newSelectedUserIdStack);

    //const lastValue = newSelectedUserIdStack[newSelectedUserIdStack.length - 1];
    setParentId(_id);
  };

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

  useEffect(() => {

    if (searchQuery !== '') {
      fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, searchQuery, parentId); // fetch page 1 of users
    }
  }, [perPage, searchQuery, parentId]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">ALL ACCOUNT</h1>

        </div>
        <div className="ms-auto pageheader-btn">
          <Link to={`${process.env.PUBLIC_URL}/account-add`} className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            CREATE ACCOUNT
          </Link>
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
                  onSelectedRowsChange={handleRowSelected}
                  clearSelectedRows={toggleCleared}
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
    </div>
  );
}
