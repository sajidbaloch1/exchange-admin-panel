import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Col, Breadcrumb, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { getAllTransactionActivity, deleteCurrency } from "../accountStatementService";
import { downloadCSV } from '../../../utils/csvUtils';
import { showAlert } from '../../../utils/alertUtils';
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the SearchInput component
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { CCol } from "@coreui/react";



export default function AccountStatementList() {

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

  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => ((currentPage - 1) * perPage) + (index + 1),
      sortable: false,
    },
    {
      name: "DATE",
      selector: (row) => {
        const originalDate = new Date(row.createdAt);
        const formattedDate = originalDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
        return formattedDate;
      },
      sortable: true,
      sortField: 'date'
    },
    {
      name: "CREDIT",
      selector: (row) => [row.points],
      sortable: true,
      sortField: 'points',
      cell: (row) => (
        <div style={{ color: "green" }}>
          {row.type === "credit" ? row.points : ""}
        </div>
      ),
    },
    {
      name: "DEBIT",
      selector: (row) => [row.points],
      sortable: true,
      sortField: 'points',
      cell: (row) => (
        <div style={{ color: "red" }}>
          {row.type === "debit" ? "-" + row.points : ""}
        </div>
      ),
    },
    {
      name: "PTS",
      selector: (row) => [row.balancePoints],
      sortable: true,
      sortField: 'balancePoints',

    },
    {
      name: "REMARKS",
      selector: (row) => [row.remark],
      sortable: true,
      sortField: 'remark'
    },
    {
      name: "FROMTO",
      selector: (row) => [row.fromtoName],
      sortable: true,
      sortField: 'fromtoName'
    },
  ];

  const actionsMemo = React.useMemo(() => <Export onExport={() => handleDownload()} />, []);

  const fetchData = async (page, sortBy, direction, searchQuery) => {
    setLoading(true);
    try {
      const result = await getAllTransactionActivity({
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery,
        userId: '64c13adae05c20941879553a'
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
    await downloadCSV('currencies/getAllTransactionActivity', searchQuery, 'currency.csv');
  };

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }

  const handleSelect = (ranges) => {
    console.log(ranges);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }

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
          <h1 className="page-title">ACCOUNT STATEMENT</h1>
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
              {/* <Row>
                <CCol xs={4}>
                  <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                  />
                </CCol>
              </Row> */}
              <div className="table-responsive export-table">
                <DataTable
                  columns={columns}
                  data={data}
                  // actions={actionsMemo}
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
