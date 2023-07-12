import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Col, Breadcrumb, Button, FormControl, InputGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import DebouncedTextInput from "../../../utils/DeboundedTextInput";
import { postData } from '../../../utils/fetch-services';

export default function MasterList() {
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const Export = ({ onExport }) => (
    <Button className="btn btn-secondary" onClick={(e) => onExport(e.target.value)}>Export</Button>
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = useState(data);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => ((currentPage - 1) * perPage) + (index + 1),
      sortable: false,
    },
    {
      name: "USER NAME",
      selector: (row) => [row.username],
      sortable: true,
      sortField: 'username'
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
      name: 'ACTION',
      cell: row => (
        <div>
          <Link to={`${process.env.PUBLIC_URL}/user-edit/` + row._id}><i className="fa fa-edit"></i></Link>
          <Link className="mx-auto mr-2" to={`${process.env.PUBLIC_URL}/user-edit/` + row._id}><i className="fa fa-trash"></i></Link>
        </div>
      ),
    },
  ];

  const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);
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

  const fetchUsers = async (page, sortBy, direction, searchQuery) => {
    setLoading(true);
    const result = await postData('users/getAllUsers', {
      page: page,
      perPage: perPage,
      sortBy: sortBy,
      direction: direction,
      searchQuery: searchQuery
    });
    if (result.success) {
      setData(result.data.records);
      setTotalRows(result.data.totalRecords);
      setLoading(false);
    } else {
      setData([]);
    }
  };

  const handleSort = (column, sortDirection) => {
    // simulate server sort
    setSortBy(column.sortField);
    setDirection(sortDirection);
    setCurrentPage(1);
    fetchUsers(currentPage, sortBy, direction, searchQuery);
    setLoading(false);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    fetchUsers(page, sortBy, direction, searchQuery);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery != '') {
      fetchUsers(currentPage, sortBy, direction, searchQuery); // fetch page 1 of users
    } else {
      fetchUsers(currentPage, sortBy, direction, ''); // fetch page 1 of users
    }
  }, [perPage, searchQuery]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All User</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Masters
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-item active breadcrumds" aria-current="page">
              List
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Link to={`${process.env.PUBLIC_URL}/user-add`} className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add NEW MASTER
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
            <Card.Header>
              <h3 className="card-title">All User</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={9}></Col>
                <Col lg={3}>
                  <DebouncedTextInput
                    disabled={loading}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    label="Search transaction"
                    duration={500}
                  />
                </Col>
              </Row>
              <div className="table-responsive export-table">
                {/* <DataTableExtensions {...tableDatas}>
                <DataTable
                  columns={columns}
                  data={data}
                  actions={actionsMemo}
                  contextActions={contextActions}
                  onSelectedRowsChange={handleRowSelected}
                  clearSelectedRows={toggleCleared}
                  selectableRows
                  pagination
                />
              </DataTableExtensions> */}
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
