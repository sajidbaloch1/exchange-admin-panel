import React, { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Row, Tooltip, OverlayTrigger } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the FormInput component
import { showAlert } from "../../../utils/alertUtils";
import { deleteThemeUser, getAllThemeUsers } from "../themeUserService";
import { Notify } from "../../../utils/notify";

export default function ThemeUserList() {
  const location = useLocation();
  let login_user_id = "";
  const user = JSON.parse(localStorage.getItem("user_info"));
  if (user.role !== "system_owner") {
    login_user_id = user._id;
  }

  const { id } = useParams();
  const initialParentId = id ? id : login_user_id;
  const [parentId, setParentId] = useState(initialParentId);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");

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
    },
    {
      name: "NAME",
      selector: (row) => [row.name],
      sortable: true,
      sortField: "name",
    },
    {
      name: "ACTION",
      width: "200px",
      cell: (row) => (
        <div className="d-flex justify-content-end align-items-center">
          <OverlayTrigger placement="top" overlay={<Tooltip > Click here to edit</Tooltip>}>
            <Link
              to={`${process.env.PUBLIC_URL}/theme-user-form`}
              state={{ id: row._id }}
              className="btn btn-primary btn-lg"
            >
              <i className="fa fa-edit"></i>
            </Link>
          </OverlayTrigger>
          {/* <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button> */}
        </div>
      ),
    },
  ];

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const result = await getAllThemeUsers({
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery,
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
      const success = await deleteThemeUser(id);
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

  const handleDelete = (id) => {
    showAlert(id, removeRow);
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
          <h1 className="page-title">ALL THEME USERS</h1>
        </div>
        <div className="ms-auto pageheader-btn">

          <Link
            to={`${process.env.PUBLIC_URL}/theme-user-form`}
            className="btn btn-primary btn-icon text-white me-3"
          >
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
              <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} />
              <div className="table-responsive export-table">
                <DataTable
                  columns={columns}
                  data={data}
                  //actions={actionsMemo}
                  //contextActions={contextActions}
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

    </div>
  );
}
