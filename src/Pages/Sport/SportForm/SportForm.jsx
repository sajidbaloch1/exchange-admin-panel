import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Card, Row, Col, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { getSportDetailByID, addSport, updateSport } from "../sportService";
import { getAllBetCategory } from '../../BetCategory/betcategoryService'
import FormInput from "../../../components/Common/FormComponents/FormInput";
import FormMultiSelect from "../../../components/Common/FormComponents/FormMultiSelect";
import * as Yup from "yup";
import { CForm, CCol, CFormLabel, CButton, CSpinner } from "@coreui/react";

export default function SportForm() {
  const navigate = useNavigate();
  const location = useLocation();
  //id get from state
  const id = location.state ? location.state.id : '';
  //id get from url
  //const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // State to hold the server error message
  const [betCategoryList, setBetCategoryList] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      apiSportId: "",
      betCategory: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      apiSportId: Yup.number().required("SPORT API ID is required"),
      betCategory: Yup.array()
        .min(1, "At least one option must be selected")
        .required("At least one option must be selected"),
    }),
    onSubmit: async (values) => {
      // Perform form submission logic
      setServerError(null); // Reset server error state
      setLoading(true); // Set loading state to true
      try {
        let response = null;
        const { name, betCategory, apiSportId } = values;
        if (id !== "" && id !== undefined) {
          response = await updateSport({
            _id: id,
            ...values,
          });
        } else {
          response = await addSport({
            ...values,
          });
        }
        if (response.success) {
          navigate("/sport-list");
        } else {
          setServerError(response.message);
        }
      } catch (error) {
        //console.log(error);
        if (error.response && error.response.status === 500) {
          // Server-side error occurred
          setServerError(error.response.data.message); // Set the server error message
        } else {
          // Handle other errors
        }
      } finally {
        setLoading(false); // Set loading state to false
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await getSportDetailByID(id);

        formik.setValues((prevValues) => ({
          ...prevValues,
          name: result.name || "",
          apiSportId: result.apiSportId || "",
          betCategory: result.betCategory || [],
        }));
      }

      const betCategoryData = await getAllBetCategory();
      const dropdownOptions = betCategoryData.records.map(option => ({
        value: option._id,
        label: option.name
      }));
      setBetCategoryList(dropdownOptions)
    };
    fetchData();
  }, [id]);

  const formTitle = id ? "UPDATE SPORT" : "CREATE SPORT";

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
                {/* Display server error message */}
                <FormInput
                  label="Name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                  width={2}
                />

                <FormInput
                  label="Sport API Code"
                  name="apiSportId"
                  type="text"
                  value={formik.values.apiSportId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.apiSportId && formik.errors.apiSportId}
                  width={3}
                />

                <FormMultiSelect
                  label="Bet Category"
                  name="betCategory"
                  value={formik.values.betCategory}
                  onChange={formik.setFieldValue}
                  onBlur={formik.handleBlur}
                  options={betCategoryList}
                  error={formik.touched.betCategory && formik.errors.betCategory}
                  width={3}
                />

                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      {loading ? <CSpinner size="sm" /> : "Save"}
                    </CButton>
                    <Link
                      to={`${process.env.PUBLIC_URL}/sport-list`}
                      className="btn btn-danger btn-icon text-white "
                    >
                      Cancel
                    </Link>
                  </div>
                </CCol>
              </CForm>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
