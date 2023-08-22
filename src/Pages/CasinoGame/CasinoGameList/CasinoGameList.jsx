import { CSpinner } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the FormInput component
import { showAlert } from "../../../utils/alertUtils";
import { downloadCSV } from "../../../utils/csvUtils";
import { Notify } from "../../../utils/notify";
import { deleteCasinoGame, getAllCasinoGame, changeStatus } from "../casinoGameService";
import { permission } from "../../../lib/user-permissions";

export default function CasinoGameList() {
  const location = useLocation();

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
  const [visibleStatus, setVisibleStatus] = useState({});
  const [favouriteStatus, setFavouriteStatus] = useState({});

  const changeStatus = async (type, id, key, value) => {
    if (type === "bet") {
      setFavouriteStatus((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    } else {
      setVisibleStatus((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    }
  };

  const toggleStatus = async (type, id, toggleValue) => {
    changeStatus(type, id, "loading", true);
    const fieldName = type === "favourite" ? "isFavourite" : "isVisible";
    try {
      const status = type === "favourite" ? !favouriteStatus[id]?.isFavourite : !visibleStatus[id]?.isVisible;
      const request = { _id: id, fieldName, status: status };
      console.log(request);
      const result = await changeStatus(request);
      if (result.success) {
        Notify.success(
          type === "favourite" ? "Favourite status changed successfully" : "visible status updated successfully"
        );
        changeStatus(type, id, fieldName, result.data.details[fieldName]);
      }
    } catch (error) {
      Notify.error(type === "favourite" ? "Error updating favourite status" : "Error updating visible status");
      console.error("Error removing :", error);
    }
    changeStatus(type, id, "loading", false);
  };

  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => (currentPage - 1) * perPage + (index + 1),
      sortable: false,
    },
    {
      name: "NAME",
      selector: (row) => [row.name],
      sortable: true,
      sortField: "name",
    },

    {
      name: "CASINO",
      selector: (row) => [row.casinoName],
      sortable: true,
      sortField: "casinoName",
    },
    permission.USER_MODULE.USER_BET_UPDATE && {
      name: "FAVOURITE",
      selector: (row) => [row.betCategory],
      sortable: false,
      cell: (row) => (
        <div className="material-switch mt-4 d-flex align-items-center" key={row._id}>
          <input
            id={`betSwitch_${row._id}`}
            name={`notes[${row._id}].isFavourite`}
            onChange={() => toggleStatus("favourite", row._id, row.isFavourite)}
            checked={favouriteStatus[row._id]?.isFavourite || false}
            type="checkbox"
            disabled={!permission.USER_MODULE.USER_BET_UPDATE}
          />
          <label htmlFor={`betSwitch_${row._id}`} className="label-primary"></label>
          {favouriteStatus[row._id]?.loading ? (
            <div className="pb-2 ps-4">
              <CSpinner size="sm" />
            </div>
          ) : null}
        </div>
      ),
    },
    permission.USER_MODULE.USER_STATUS_UPDATE && {
      name: "VISIBLE",
      selector: (row) => [row.isVisible],
      sortable: false,
      cell: (row) => (
        <div className="material-switch mt-4 d-flex align-items-center" key={row._id}>
          <input
            id={`userSwitch_${row._id}`}
            name={`notes[${row._id}].isVisible`}
            onChange={() => toggleStatus("user", row._id, row.isVisible)}
            checked={visibleStatus[row._id]?.isVisible || false}
            type="checkbox"
            disabled={!permission.USER_MODULE.USER_STATUS_UPDATE}
          />
          <label htmlFor={`userSwitch_${row._id}`} className="label-primary"></label>
          {visibleStatus[row._id]?.loading ? (
            <div className="pb-2 ps-4">
              <CSpinner size="sm" />
            </div>
          ) : null}
        </div>
      ),
    },
    permission.USER_MODULE.UPDATE && {
      name: "ACTION",
      cell: (row) => (
        <div>
          <OverlayTrigger placement="top" overlay={<Tooltip> Click here to edit</Tooltip>}>
            <Link
              to={`${process.env.PUBLIC_URL}/casino-game-form/`}
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
  ].filter(Boolean);

  // const handleRowSelected = React.useCallback((state) => {
  //   setSelectedRows(state.selectedRows);
  //   const selectedUser = state.selectedRows[0]; // Assuming only one user can be selected at a time
  //   if (selectedUser) {
  //     setParentId(selectedUser._id);
  //   }
  // }, []);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const result = await getAllCasinoGame({
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery,
      });

      setData(result.records);
      setTotalRows(result.totalRecords);
      result.records.forEach((casinoGame) => {
        visibleStatus[casinoGame._id] = { loading: false, isVisible: casinoGame.isVisible };
        favouriteStatus[casinoGame._id] = { loading: false, isFavourite: casinoGame.isFavourite };
      });
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
      const success = await deleteCasinoGame(id);
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

  useEffect(() => {
    setData([]);
    if (searchQuery !== "") {
      fetchData(currentPage, sortBy, direction, searchQuery); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, searchQuery); // fetch page 1 of users
    }
    return () => {
      setData([]);
    };
  }, [perPage, searchQuery]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">ALL CASINO GAME</h1>
        </div>
        <div className="ms-auto pageheader-btn">
          {permission.USER_MODULE.CREATE && (
            <Link
              to={`${process.env.PUBLIC_URL}/casino-game-form`}
              className="btn btn-primary btn-icon text-white me-3"
            >
              <span>
                <i className="fe fe-plus"></i>&nbsp;
              </span>
              CREATE CASINO GAME
            </Link>
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
