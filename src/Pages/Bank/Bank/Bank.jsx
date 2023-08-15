import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Col, Breadcrumb, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { getAllTransactionActivity, deleteCurrency } from "../bankStatementService";
import { downloadCSV } from '../../../utils/csvUtils';
import { showAlert } from '../../../utils/alertUtils';
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the SearchInput component

import { getAllData } from "../../Account/accountService";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { CCol, CButton, CSpinner } from "@coreui/react";
import FormSelectWithSearch from "../../../components/Common/FormComponents/FormSelectWithSearch";
import FormInput from "../../../components/Common/FormComponents/FormInput";
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils'; // Import utility functions for exporting


export default function Bank() {

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

  const [userList, setuserList] = useState([]);
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [filters, setFilters] = useState({
    userId: "",
    starDate: "",
    endDate: "",
    // Add more filters here if needed
  });
  const [formSelectKey, setFormSelectKey] = useState(0);

  const handleAllButtonClick = (row) => {
    const updatedRow = { ...row, amount: row.client_p_n_l || 0 };
    const updatedData = data.map((rowData) =>
      rowData === row ? updatedRow : rowData
    );
    setData(updatedData);
  };

  const handleAmountChange = (row, event) => {
    const updatedData = data.map((rowData) =>
      rowData === row ? { ...rowData, amount: event.target.value } : rowData
    );
    setData(updatedData);
  };

  const handleSubmitButtonClick = async (row) => {
    const amount = row.amount || 0;

    try {
      // Call your API function here with the amount
      // Example: await yourApiFunction(row, amount);
      console.log("API call with amount:", amount);
    } catch (error) {
      console.error("Error calling API:", error);
      // Handle the error as needed
    }
  };

  const columns = [
    // {
    //   name: "SR.NO",
    //   selector: (row, index) => ((currentPage - 1) * perPage) + (index + 1),
    //   sortable: false,
    // },
    {
      name: "USERNAME",
      selector: (row) => [row.username],
      sortable: true,
      sortField: 'points',

    },
    {
      name: "CR",
      selector: (row) => [row.credit_point],
      sortable: true,
      sortField: 'points',

    },
    {
      name: "PTS",
      selector: (row) => [row.pts],
      sortable: true,
      sortField: 'pts',
    },
    {
      name: "CLIENT(P/L)",
      selector: (row) => [row.client_p_n_l],
      sortable: true,
      sortField: 'client_p_n_l',
    },
    {
      name: "EXPOSURE",
      selector: (row) => [row.exposure],
      sortable: true,
      sortField: 'exposure',

    },
    {
      name: "AVAILABLE PTS",
      selector: (row) => [row.available_pts],
      sortable: true,
      sortField: 'fromtoName',

    },
    {
      name: "ACCOUNT TYPE",
      selector: (row) => [row.fromtoName],
      sortable: true,
      sortField: 'fromtoName',
      cell: (row) => (
        <div>
          Admin
        </div>
      ),
    },
    {
      name: "ACTION",
      selector: (row) => [row.fromtoName],
      sortable: true,
      sortField: 'fromtoName',
      width: '200px',
      cell: (row) => (
        <Row className=" row-sm">

          <Col lg={4}>
            <button
              className="text-success"
              onClick={() => handleAllButtonClick(row)}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              All <i className="fe fe-arrow-right"></i>
            </button>
          </Col>
          <Col lg={8}>
            <input
              type="number"
              name="amount"
              placeholder="0"
              className="form-control form-control-sm transfer-amt"
              value={row.amount || ''}
              onChange={(e) => handleAmountChange(row, e)}
            />
          </Col>
          <button
            className="btn btn-info btn-sm mt-2"
            onClick={() => handleSubmitButtonClick(row)}
          >
            Submit
          </button>
        </Row>

      ),
    },
    {
      name: "STATUS",
      selector: (row) => [row.fromtoName],
      sortable: true,
      sortField: 'fromtoName',
      cell: (row) => (
        <div>

        </div>
      ),
    },
  ];

  const transferAmounts = async () => {
    const amountsToTransfer = data
      .filter((row) => row.amount > 0)
      .map((row) => ({ _id: row._id, amount: row.amount }));

    if (amountsToTransfer.length === 0) {
      // No amounts to transfer
      return;
    }

    try {
      // Call your API function here with the amountsToTransfer array
      // Example: await yourApiFunction(amountsToTransfer);
      console.log("API call with amounts:", amountsToTransfer);
    } catch (error) {
      console.error("Error calling API:", error);
      // Handle the error as needed
    }
  };

  const fetchData = async (page, sortBy, direction, searchQuery, filters) => {
    setLoading(true);
    try {
      const { userId, fromDate, toDate } = filters;
      const result = await getAllTransactionActivity({
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery,
        userId: userId,
        fromDate: fromDate,
        toDate: toDate
      });

      const dummyDataArray = [
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 1',
          'credit_point': 1000,
          "pts": 3000,
          "client_p_n_l": 100,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 2',
          'credit_point': 1000,
          "pts": 2000,
          "client_p_n_l": 200,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 3',
          'credit_point': 1000,
          "pts": 1000,
          "client_p_n_l": 300,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
      ];

      //setData(result.records);
      setData(dummyDataArray)
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
    fetchData(currentPage, sortBy, direction, searchQuery, filters);
    setLoading(false);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    fetchData(page, sortBy, direction, searchQuery, filters);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleExcelExport = async () => {
    try {
      //const response = await yourExcelApiCall(); // Replace with your actual API call
      // Generate and download Excel file
      const data = [
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 1',
          'credit_point': 1000,
          "pts": 3000,
          "client_p_n_l": 100,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 2',
          'credit_point': 1000,
          "pts": 2000,
          "client_p_n_l": 200,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 3',
          'credit_point': 1000,
          "pts": 1000,
          "client_p_n_l": 300,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
      ];

      const formattedData = data.map(item => ({
        "USERNAME": item.username,
        "CR": item.credit_point,
        "PTS": item.pts,
        "CLIENT(P/L)": item.client_p_n_l,
        "EXPOSURE": item.exposure,
        "AVAILABLE PTS": item.available_pts,
        "ACCOUNT TYPE": item.account_type,
      }));
      exportToExcel(formattedData, 'bank.xlsx'); // Utilize exportToExcel utility function
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handlePDFExport = async () => {
    try {
      //const response = await yourPDFApiCall(); // Replace with your actual API call
      // Generate and download PDF file

      const columns = ['USERNAME', 'CR', 'PTS', 'CLIENT(P/L)', 'EXPOSURE', 'AVAILABLE PTS', 'ACCOUNT TYPE'];
      const data = [
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 1',
          'credit_point': 1000,
          "pts": 3000,
          "client_p_n_l": 100,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 2',
          'credit_point': 1000,
          "pts": 2000,
          "client_p_n_l": 200,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
        {
          "_id": "64cdfff1284feb5a9236dc98",
          "username": 'dummy 3',
          'credit_point': 1000,
          "pts": 1000,
          "client_p_n_l": 300,
          "exposure": 200,
          "available_pts": 3000,
          "account_type": "admin",
        },
      ];

      const formattedData = data.map(item => ({
        "USERNAME": item.username,
        "CR": item.credit_point,
        "PTS": item.pts,
        "CLIENT(P/L)": item.client_p_n_l,
        "EXPOSURE": item.exposure,
        "AVAILABLE PTS": item.available_pts,
        "ACCOUNT TYPE": item.account_type,
      }));
      exportToPDF(columns, formattedData, 'filename.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  const handleFilterClick = () => {
    const newFilters = {
      userId: selectedUser,
      fromDate: startDateValue, // Replace startDateValue with the actual state value for start date
      toDate: endDateValue, // Replace endDateValue with the actual state value for end date
    };
    setFilters(newFilters);
    // Fetch data with the updated filters object
    fetchData(currentPage, sortBy, direction, searchQuery, newFilters);
  };

  const resetFilters = () => {
    // Clear the filter values
    setSelectedUser("");
    setStartDateValue("");
    setEndDateValue("");
    // Add more filter states if needed
    setFormSelectKey(formSelectKey + 1);

    // Fetch data with the updated filters object
    fetchData(currentPage, sortBy, direction, searchQuery, {
      sportId: "",
      startDate: "",
      endDate: "",
      // Add more filters here if needed
    });
  };

  const filterData = async () => {
    try {
      const userData = await getAllData();
      if (userData.records) {
        const dropdownOptions = userData.records.map(option => ({
          value: option._id,
          label: option.username,
        }));
        setuserList(dropdownOptions);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error appropriately (e.g., show an error message)
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      fetchData(currentPage, sortBy, direction, searchQuery, filters); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, '', filters); // fetch page 1 of users
    }
    filterData()
  }, [perPage, searchQuery]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">BANK</h1>
        </div>
      </div>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <FormSelectWithSearch
                key={formSelectKey} // Add the key prop here
                label="Client name"
                name="sportId"
                value={selectedUser} // Set the selectedUser as the value
                onChange={(name, selectedValue) => setSelectedUser(selectedValue)} // Update the selectedUser
                onBlur={() => { }} // Add an empty function as onBlur prop
                error=""
                width={2}
                options={userList}
              />

              <CCol xs={6}>
                <div className="d-grid gap-2 d-md-block">
                  <CButton color="primary" type="submit" onClick={handleFilterClick} className="me-3 mt-6">
                    {loading ? <CSpinner size="sm" /> : "Load"}
                  </CButton>
                  <button
                    onClick={resetFilters} // Call the resetFilters function when the "Reset" button is clicked
                    className="btn btn-danger btn-icon text-white mt-6"
                  >
                    Reset
                  </button>
                </div>
              </CCol>

              <Button variant="success" className="me-2 mt-6" onClick={handleExcelExport}><i className="fa fa-file-excel-o"></i></Button>
              <Button variant="primary" className=" mt-6" onClick={handlePDFExport}><i className="fa fa-file-pdf-o"></i></Button>
              <FormInput
                label="Transaction Code "
                name=""
                type="text"
                value={startDateValue}
                onChange={(event) => setStartDateValue(event.target.value)} // Use event.target.value to get the updated value
                onBlur={() => { }}
                width={2}
              />
              <CCol xs={3}>
                <div className="d-grid gap-2 d-md-block float-right">
                  <CButton color="primary" type="submit" onClick={transferAmounts} className="me-3 mt-6">
                    {loading ? <CSpinner size="sm" /> : "Transfer All"}
                  </CButton>
                </div>
              </CCol>

            </Card.Header>
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
