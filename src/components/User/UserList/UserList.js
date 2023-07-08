import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Col, Breadcrumb, Button, FormControl, InputGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import DebouncedTextInput from "../../../util/DeboundedTextInput";

export default function UserList() {
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
  // const dataArr = [
  //   {
  //     id: "1",
  //     SNO: 1,
  //     NAME: "Yonna",
  //     LASTNAME: "Qond",
  //     POSITION: "Financial Controller",
  //     DATE: "2012/02/21",
  //     SALARY: "$143,654",
  //     EMAIL: "i.bond@datatables.net",
  //   },
  //   {
  //     id: "2",
  //     SNO: 2,
  //     NAME: "Zonna",
  //     LASTNAME: "Jond",
  //     POSITION: "Accountant",
  //     DATE: "2012/02/21",
  //     SALARY: "$343,654",
  //     EMAIL: "a.bond@datatables.net",
  //   },
  //   {
  //     id: "3",
  //     SNO: 3,
  //     NAME: "Nonna",
  //     LASTNAME: "Tond",
  //     POSITION: "Chief Executive Officer",
  //     DATE: "2012/02/21",
  //     SALARY: "$743,654",
  //     EMAIL: "s.bond@datatables.net",
  //   },
  //   {
  //     id: "4",
  //     SNO: 4,
  //     NAME: "Bonna",
  //     LASTNAME: "Oond",
  //     POSITION: "Chief Operating Officer",
  //     DATE: "2012/02/21",
  //     SALARY: "$643,654",
  //     EMAIL: "w.bond@datatables.net",
  //   },
  //   {
  //     id: "5",
  //     SNO: 5,
  //     NAME: "Honna",
  //     LASTNAME: "Pond",
  //     POSITION: "Data Coordinator",
  //     DATE: "2012/02/21",
  //     SALARY: "$243,654",
  //     EMAIL: "e.bond@datatables.net",
  //   },
  //   {
  //     id: "6",
  //     SNO: 6,
  //     NAME: "Fonna",
  //     LASTNAME: "Nond",
  //     POSITION: "Developer",
  //     DATE: "2012/02/21",
  //     SALARY: "$543,654",
  //     EMAIL: "r.bond@datatables.net",
  //   },
  //   {
  //     id: "7",
  //     SNO: 7,
  //     NAME: "Aonna",
  //     LASTNAME: "Xond",
  //     POSITION: "Development lead",
  //     DATE: "2012/02/21",
  //     SALARY: "$843,654",
  //     EMAIL: "g.bond@datatables.net",
  //   },
  //   {
  //     id: "8",
  //     SNO: 8,
  //     NAME: "Qonna",
  //     LASTNAME: "Vond",
  //     POSITION: "Director",
  //     DATE: "2012/02/21",
  //     SALARY: "$743,654",
  //     EMAIL: "x.bond@datatables.net",
  //   },
  //   {
  //     id: "9",
  //     SNO: 9,
  //     NAME: "Jond",
  //     LASTNAME: "Zonna",
  //     POSITION: "Marketing Officer",
  //     DATE: "2012/02/21",
  //     SALARY: "$543,654",
  //     EMAIL: "k.bond@datatables.net",
  //   },
  //   {
  //     id: "10",
  //     SNO: 10,
  //     NAME: "Yonna",
  //     LASTNAME: "Qond",
  //     POSITION: "Financial Controller",
  //     DATE: "2012/02/21",
  //     SALARY: "$143,654",
  //     EMAIL: "s.bond@datatables.net",
  //   },
  //   {
  //     id: "11",
  //     SNO: 11,
  //     NAME: "Yonna",
  //     LASTNAME: "Qond",
  //     POSITION: "Financial Controller",
  //     DATE: "2012/02/21",
  //     SALARY: "$143,654",
  //     EMAIL: "b.bond@datatables.net",
  //   },
  //   {
  //     id: "12",
  //     SNO: 12,
  //     NAME: "Yonna",
  //     LASTNAME: "Qond",
  //     POSITION: "Financial Controller",
  //     DATE: "2012/02/21",
  //     SALARY: "$143,654",
  //     EMAIL: "o.bond@datatables.net",
  //   },
  //   {
  //     id: "13",
  //     SNO: 13,
  //     NAME: "Qonna",
  //     LASTNAME: "Pond",
  //     POSITION: "Data Coordinator",
  //     DATE: "2012/02/21",
  //     SALARY: "$243,654",
  //     EMAIL: "q.bond@datatables.net",
  //   },
  //   {
  //     id: "14",
  //     SNO: 14,
  //     NAME: "Yonna",
  //     LASTNAME: "Qond",
  //     POSITION: "Financial Controller",
  //     DATE: "2012/02/21",
  //     SALARY: "$143,654",
  //     EMAIL: "m.bond@datatables.net",
  //   },
  // ];
  const columns = [
    {
      name: "S.NO",
      selector: (row) => [row.id],
      sortable: true,
      sortField: 'id'
    },
    {
      name: "FIRST NAME",
      selector: (row) => [row.first_name],
      sortable: true,
      sortField: 'first_name'
    },
    {
      name: "LAST NAME",
      selector: (row) => [row.last_name],
      sortable: true,
      sortField: 'last_name'
    },
    {
      name: "EMAIL",
      selector: (row) => [row.email],
      sortable: true,
      sortField: 'email'
    },
  ];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = useState(data);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

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

  const fetchUsers = async page => {
    setLoading(true);

    const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handleSort = (column, sortDirection) => {
    // simulate server sort
    console.log(column.sortField);
    console.log(sortDirection);
    //setLoading(true);

    // instead of setTimeout this is where you would handle your API call.
    // setTimeout(() => {
    //   setData(orderBy(data, column.sortField, sortDirection));
    //   setLoading(false);
    // }, 100);
  };

  const handlePageChange = page => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`);

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    console.log('innn');
    fetchUsers(1); // fetch page 1 of users
  }, [perPage, searchQuery]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All User</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Users
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
            Add NEW USER
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
                  selectableRows
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
