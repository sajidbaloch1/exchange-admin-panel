import { CSpinner } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import SearchInput from "../../../components/Common/FormComponents/SearchInput";
import { decryptUserPermissions, getAllData, user } from "../accountService";


const generateTableColumns = (moduleList) => {
  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "100px",
      style: { position: "sticky", left: 0, zIndex: 1, backgroundColor: "#f9f9f9" },
    },
    {
      name: "USERNAME",
      selector: (row) => [row.username],
      sortable: true,
      sortField: "username",
      width: "100px",
      style: { position: "sticky", left: 0, zIndex: 1, backgroundColor: "#f9f9f9" },
    },
    {
      name: "FULL NAME",
      selector: (row) => [row.fullName],
      sortable: true,
      sortField: "fullName",
      width: "100px",
      style: { position: "sticky", left: 0, zIndex: 1, backgroundColor: "#f9f9f9" },
    },
  ];

  moduleList.forEach((detail) => {
    columns.push({
      name: detail.name.toUpperCase(),
      selector: (row) => [row[detail.key]],
      sortable: true,
      sortField: detail.key,
      cell: (row) => (
        <div className="h4 mb-0">{row[detail.key] ? <i className="fa fa-check-circle text-success" /> : null}</div>
      ),
    });
  });

  columns.push({
    name: "ACTION",
    cell: (row) => (
      <div>
        <Link to={`${process.env.PUBLIC_URL}/multi-login`} state={{ id: row._id }} className="btn btn-primary btn-lg">
          <i className="fa fa-edit"></i>
        </Link>
        {/* <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button> */}
      </div>
    ),
    width: "150px",
  });

  return columns;
};

function MultiLoginListing({ id, moduleList = [] }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clonedUsers, setClonedUsers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");

  const tableColumns = generateTableColumns(moduleList);

  const handleSort = (column, sortDirection) => {
    setSortBy(column.sortField);
    setDirection(sortDirection);
    setCurrentPage(1);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setLoading(true);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      const result = await getAllData({
        page: currentPage,
        perPage,
        sortBy,
        direction,
        searchQuery,
        cloneParentId: user._id,
        withPermissions: true,
      });

      if (result) {
        const users = result.records.map((user) => {
          const clonedUser = { ...user };
          const decryptedModules = decryptUserPermissions(user.permissions);
          moduleList.forEach((module) => {
            const modulePermission = decryptedModules.find((permission) => permission === module.key);
            clonedUser[module.key] = modulePermission;
          });
          return clonedUser;
        });
        setClonedUsers(users);
        setTotalRows(result.totalRecords);
      }
      setLoading(false);
    };

    fetchAllUsers();
  }, [id, currentPage, perPage, sortBy, direction, searchQuery, moduleList]);

  return (
    <Card>
      <Card.Header>
        <h3 className="card-title">ALL MULTI LOGIN</h3>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <CSpinner size="sm" />
        ) : (
          <>
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} />
            <div className="table-responsive export-table">
              <DataTable
                columns={tableColumns}
                data={clonedUsers}
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
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default MultiLoginListing;
