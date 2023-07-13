import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Card, Row, Col } from "react-bootstrap";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { getDetailByID, addData, updateData } from "../currencyService";
import FormInput from "../../../components/Common/FormComponents/FormInput"; // Import the FormInput component
import * as Yup from 'yup';
import {
  CForm,
  CCol,
  CFormLabel,
  CFormInput,
  CButton,
} from "@coreui/react";

export default function CurrencyForm() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
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
      try {
        if (id !== '' && id !== undefined) {
          await updateData({
            _id: id,
            name: values.name,
            multiplier: values.multiplier
          });
        } else {
          await addData({
            name: values.name,
            multiplier: values.multiplier
          });
        }
        navigate('/currency-list');
      } catch (error) {
        // Handle error
      }
      console.log('Form submitted successfully:', values);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await getDetailByID(id);
        formik.setValues((prevValues) => ({
          ...prevValues,
          name: result.name || '',
          multiplier: result.multiplier || '',
        }));
      }
    };
    fetchData();
  }, [id, getDetailByID]);

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
                <FormInput
                  label="Name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                <FormInput
                  label="Multiplier"
                  name="multiplier"
                  type="text"
                  value={formik.values.multiplier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.multiplier && formik.errors.multiplier}
                />


                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      Save
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
