import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Col, Breadcrumb, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { getAllSport, deleteSport, changeStatus } from "../sportService";
import { downloadCSV } from '../../../utils/csvUtils';
import { showAlert } from '../../../utils/alertUtils';
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the SearchInput component

export default function SportList() {

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

  const toggleHighlight = async (id, isActive) => {
    setLoading(true);
    try {
      const newStatus = !isActive; // Toggle the isActive status
      const request = { _id: id, status: newStatus.toString() };
      const success = await changeStatus(request);
      if (success) {
        fetchData(currentPage, sortBy, direction, searchQuery);
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

  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => ((currentPage - 1) * perPage) + (index + 1),
      sortable: false,
    },
    {
      name: "NAME",
      selector: (row) => [row.name],
      sortable: true,
      sortField: 'name'
    },
    {
      name: "API CODE",
      selector: (row) => [row.apiSportId],
      sortable: true,
      sortField: 'apiSportId'
    },
    {
      name: "TOTAL BET CATEGORY",
      selector: (row) => [row.betCategoryCount],
      sortable: false,
      cell: row => (
        <span className="ms-2"> {row.betCategoryCount}</span>
      ),
    },
    {
      name: "STATUS",
      selector: (row) => [row.betCategory],
      sortable: false,
      cell: row => (
        <div className="material-switch mt-4">
          <input
            id={`highlightSwitch_${row._id}`}
            name={`notes[${row._id}].highlight`}
            onChange={() => toggleHighlight(row._id, row.isActive)}
            checked={row.isActive}
            type="checkbox"
          />
          <label
            htmlFor={`highlightSwitch_${row._id}`}
            className="label-primary"
          ></label>
        </div>

      ),
    },
    {
      name: 'ACTION',
      cell: row => (
        <div>
          <Link to={`${process.env.PUBLIC_URL}/sport-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
          {/* <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button> */}
          <Link
            to={{
              pathname: `${process.env.PUBLIC_URL}/bet-category-list`,
            }}
            // Pass the sportId as state
            state={{ sportId: row._id }}
            className="btn btn-info btn-lg ms-2"
          >
            <i className="fa fa-file"></i>
          </Link>
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
  }, []);

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

  const fetchData = async (page, sortBy, direction, searchQuery) => {
    setLoading(true);
    try {
      const result = await getAllSport(page, perPage, sortBy, direction, searchQuery);
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
      const success = await deleteSport(id);
      if (success) {
        fetchData(currentPage, sortBy, direction, searchQuery);
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
    fetchData(currentPage, sortBy, direction, searchQuery);
    setLoading(false);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    fetchData(page, sortBy, direction, searchQuery);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleDownload = async () => {
    await downloadCSV('sport/getAllSport', searchQuery, 'sports.csv');
  };

  const handleDelete = (id) => {
    showAlert(id, removeRow);
  };

  useEffect(() => {
    if (searchQuery !== '') {
      fetchData(currentPage, sortBy, direction, searchQuery); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, ''); // fetch page 1 of users
    }
  }, [perPage, searchQuery]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">ALL SPORTS</h1>
          {/* <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Category
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-item active breadcrumds" aria-current="page">
              List
            </Breadcrumb.Item>
          </Breadcrumb> */}
        </div>
        <div className="ms-auto pageheader-btn">
          <Link to={`${process.env.PUBLIC_URL}/sport-form`} className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            CREATE SPORT
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
                  // actions={actionsMemo}
                  // contextActions={contextActions}
                  // onSelectedRowsChange={handleRowSelected}
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
