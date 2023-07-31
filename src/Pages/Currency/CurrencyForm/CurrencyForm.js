import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Card, Row, Col } from "react-bootstrap";
import { useFormik } from 'formik';
import { getCurrencyDetailByID, addCurrency, updateCurrency } from "../currencyService";
import FormInput from "../../../components/Common/FormComponents/FormInput"; // Import the FormInput component
import * as Yup from 'yup';
import {
  CForm,
  CCol,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner
} from "@coreui/react";

export default function CurrencyForm() {
  const navigate = useNavigate();
  const location = useLocation();
  //id get from state
  const id = location.state ? location.state.id : '';
  //id get from url 
  //const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // State to hold the server error message

  const formik = useFormik({
    initialValues: {
      name: '',
      multiplier: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      multiplier: Yup.number().required('Multiplier must be a number'),
    }),
    onSubmit: async (values) => {
      // Perform form submission logic
      setServerError(null); // Reset server error state
      setLoading(true); // Set loading state to true
      try {
        if (id !== '' && id !== undefined) {
          const response = await updateCurrency({
            _id: id,
            name: values.name,
            multiplier: values.multiplier
          });
          if (response.success) {
            navigate("/currency-list/");
          } else {
            setServerError(response.message);
          }
        } else {
          const response = await addCurrency({
            name: values.name,
            multiplier: values.multiplier
          });

          if (response.success) {
            navigate("/currency-list");
          } else {
            setServerError(response.message);
          }
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await getCurrencyDetailByID(id);
        formik.setValues((prevValues) => ({
          ...prevValues,
          name: result.name || '',
          multiplier: result.multiplier || '',
        }));
      }
    };
    fetchData();
  }, [id, getCurrencyDetailByID]);

  const formTitle = id ? "UPDATE CURRENCY" : "CREATE CURRENCY";

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
                  width={3}
                />

                <FormInput
                  label="Multiplier"
                  name="multiplier"
                  type="text"
                  value={formik.values.multiplier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.multiplier && formik.errors.multiplier}
                  width={2}
                />

                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      {loading ? <CSpinner size="sm" /> : "Save"}
                    </CButton>
                    <Link to={`${process.env.PUBLIC_URL}/currency-list`} className="btn btn-danger btn-icon text-white ">
                      Cancel
                    </Link>
                  </div>
                </CCol>
              </CForm>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div >
  );
}
