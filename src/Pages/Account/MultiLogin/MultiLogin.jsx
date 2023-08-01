import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { useFormik } from 'formik';
import { getDetailByID, addData, updateData, getAppModuleListing } from "../accountService";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { getAllData, deleteData } from "../accountService";
import { downloadCSV } from '../../../utils/csvUtils';
import { showAlert } from '../../../utils/alertUtils';
import FormInput from "../../../components/Common/FormComponents/FormInput"; // Import the FormInput component
import SearchInput from "../../../components/Common/FormComponents/SearchInput"; // Import the FormInput component
import * as Yup from 'yup';
import {
  CForm,
  CCol,
  CButton,
  CFormLabel,
  CSpinner
} from "@coreui/react";

export default function MultiLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  //id get from state
  const id = location.state ? location.state.id : '';
  //id get from url
  //const { id } = useParams();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [moduleList, setmoduleList] = useState([]);
  const { creditPoints, role, rate, _id } = JSON.parse(localStorage.getItem('user_info')) || {};
  const [serverError, setServerError] = useState(null); // State to hold the server error message

  const details = [
    {
      "_id": "64be4e3218a6ad4e7b85b1cb",
      "name": "User Password Change"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1c9",
      "name": "User List"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1c8",
      "name": "User"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1cc",
      "name": "Insert User"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1ca",
      "name": "User Lock"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1cf",
      "name": "Dashboard"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1d0",
      "name": "Currency"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1cd",
      "name": "User History"
    },
    {
      "_id": "64be4e3218a6ad4e7b85b1ce",
      "name": "User Info"
    },

  ]
  const formik = useFormik({
    initialValues: {
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',

    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .test("no-spaces", "Spaces are not allowed in the username", (value) => {
          if (value) {
            return !/\s/.test(value); // Check if there are no spaces in the username
          }
          return true;
        }),
      fullName: Yup.string().required('Full name is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),

    }),
    onSubmit: async (values) => {
      // Perform form submission logic
      setServerError(null); // Reset server error state
      setLoading(true); // Set loading state to true
      try {
        if (id !== '' && id !== undefined) {
          const response = await updateData({
            _id: id,
            ...values,
          });


        } else {
          const response = await addData({
            ...values,
          });


        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false); // Set loading state to false
      }
      //console.log('Form submitted successfully:', values);
    }
  });

  useEffect(() => {
    const fetchDataForm = async () => {
      if (id) {
        const result = await getDetailByID(id);

        formik.setValues((prevValues) => ({

          ...prevValues,
          username: result.username || '',
          fullName: result.fullName || '',
          password: result.password || '',
        }));

      }
      // const result = await getAppModuleListing(id);
      // console.log('innn')
      // console.log(result)
    };
    fetchDataForm();
  }, [id, getDetailByID]);

  // const columns = [
  //   {
  //     name: "SR.NO",
  //     selector: (row, index) => ((currentPage - 1) * perPage) + (index + 1),
  //     sortable: false,
  //   },
  //   {
  //     name: "USERNAME",
  //     selector: (row) => [row.username],
  //     sortable: true,
  //     sortField: 'username',
  //   },
  //   {
  //     name: "FULL NAME",
  //     selector: (row) => [row.fullName],
  //     sortable: true,
  //     sortField: 'fullName'
  //   },

  //   {
  //     name: 'ACTION',
  //     cell: row => (
  //       <div>
  //         <Link to={`${process.env.PUBLIC_URL}/agent-form`} state={{ id: row._id }} className="btn btn-primary btn-lg"><i className="fa fa-edit"></i></Link>
  //         {/* <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button> */}
  //       </div>
  //     ),
  //   },
  // ];



  const columns = [
    {
      name: "SR.NO",
      selector: (row, index) => (index + 1),
      sortable: false,
      width: "100px",
      style: { position: "sticky", left: 0, zIndex: 1, backgroundColor: "#f9f9f9" }, // Add inline style for sticky behavior
    },
    {
      name: "USERNAME",
      selector: (row) => [row.username],
      sortable: true,
      sortField: 'username',
      width: "100px",
      style: { position: "sticky", left: 0, zIndex: 1, backgroundColor: "#f9f9f9" }, // Add inline style for sticky behavior
    },
    {
      name: "FULL NAME",
      selector: (row) => [row.fullName],
      sortable: true,
      sortField: 'fullName',
      width: "100px",
      style: { position: "sticky", left: 0, zIndex: 1, backgroundColor: "#f9f9f9" }, // Add inline style for sticky behavior
    },
  ];

  details.forEach((detail) => {
    columns.push({
      name: detail.name.toUpperCase(),
      selector: (row) => [row[detail._id]],
      sortable: true,
      sortField: detail._id,
    });
  });

  columns.push({
    name: "ACTION",
    cell: (row) => (
      <div>
        <Link
          to={`${process.env.PUBLIC_URL}/agent-form`}
          state={{ id: row._id }}
          className="btn btn-primary btn-lg"
        >
          <i className="fa fa-edit"></i>
        </Link>
        {/* <button onClick={(e) => handleDelete(row._id)} className="btn btn-danger btn-lg ms-2"><i className="fa fa-trash"></i></button> */}
      </div>
    ),
    width: "150px", // Set a fixed width for the ACTION column
  });
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  let selectdata = [];

  const fetchData = async (page) => {
    setLoading(true);
    try {

      const result = await getAllData(page, perPage, sortBy, direction, searchQuery);

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

    setData([])
    if (searchQuery !== '') {
      fetchData(currentPage, sortBy, direction, searchQuery); // fetch page 1 of users
    } else {
      fetchData(currentPage, sortBy, direction, searchQuery); // fetch page 1 of users
    }
    return () => {
      setData([])
    }
  }, [perPage, searchQuery]);

  const formTitle = id ? "UPDATE MULTI LOGIN" : "CREATE MULTI LOGIN";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title"> {formTitle}</h1>
        </div>
      </div>

      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">General Information</h3>
            </Card.Header>
            <Card.Body>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={formik.handleSubmit}
              >
                {serverError && <p className="text-red">{serverError}</p>}
                <FormInput
                  label="Username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && formik.errors.username}
                  isRequired="true"
                  width={3}
                />

                <FormInput
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && formik.errors.fullName}
                  isRequired="true"
                  width={3}
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && formik.errors.password}
                  isRequired="true"
                  width={3}
                />

                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  isRequired="true"
                  width={3}
                />

                <Row>
                  <CCol xs={12} md={6} lg={12}>
                    <CFormLabel >Privileges</CFormLabel>
                  </CCol>
                </Row>

                <Row>
                  {details.map((detail, key) => (
                    <CCol xs={12} md={6} lg={3} key={key}>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={detail._id}
                          name={detail._id}
                          checked={formik.values[detail._id] || false}
                          onChange={(e) =>
                            formik.setFieldValue(detail._id, e.target.checked)
                          }
                        />
                        <CFormLabel className="form-check-label" htmlFor={detail._id}>
                          {detail.name}
                        </CFormLabel>
                      </div>
                    </CCol>
                  ))}
                </Row>

                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      {loading ? <CSpinner size="sm" /> : "Save"}
                    </CButton>
                    <Link to={`${process.env.PUBLIC_URL}/account-list`} className="btn btn-danger btn-icon text-white ">
                      Reset
                    </Link>
                  </div>
                </CCol>
              </CForm>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">ALL MULTI LOGIN</h3>
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
    </div >
  );
}
