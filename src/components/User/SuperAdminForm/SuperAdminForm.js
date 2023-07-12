import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Card, Row, Col, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  CForm,
  CCol,
  CFormLabel,
  CFormFeedback,
  CFormInput,
  CButton,
} from "@coreui/react";
import { color } from "echarts";
export default function UserForm() {
  const [validated, setValidated] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
      creditAmount: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      name: Yup.string().required('Name is required'),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required('Confirm Password is required'),
      creditAmount: Yup.string().required('Credit amount is required')
    }),
    onSubmit: (values) => {
      // Perform form submission logic
      console.log('Form submitted successfully:', values);
    }
  });

  const { id } = useParams();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">CREATE SUPER ADMIN</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Super admin
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              create
            </Breadcrumb.Item>
          </Breadcrumb>
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
                <CCol md={4}>
                  <CFormLabel htmlFor="validationCustom01">User name <span className="text-red">*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />

                  {formik.touched.username && formik.errors.username && <p className="text-red">{formik.errors.username}</p>}
                </CCol>

                <CCol md={4}>
                  <CFormLabel htmlFor="validationCustom01">Full name <span className="text-red">*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                  {formik.touched.name && formik.errors.name && <p className="text-red">{formik.errors.name}</p>}
                </CCol>

                <CCol md={4}>
                  <CFormLabel htmlFor="city">City </CFormLabel>
                  <CFormInput
                    type="text"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="password">Password <span className="text-red">*</span></CFormLabel>
                  <CFormInput
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                  {formik.touched.password && formik.errors.password && <p className="text-red">{formik.errors.password}</p>}
                </CCol>

                <CCol md={4}>
                  <CFormLabel htmlFor="confirmPassword">Confirm Password <span className="text-red">*</span></CFormLabel>
                  <CFormInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red">{formik.errors.confirmPassword}</p>}
                </CCol>

                <CCol md={4}>
                  <CFormLabel htmlFor="mobile_no">Mobile number </CFormLabel>
                  <CFormInput
                    type="text"
                    id="mobile_no"
                    name="mobile_no"
                    value={formik.values.mobile_no}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                  {formik.touched.mobile_no && formik.errors.mobile_no && <p className="text-red">{formik.errors.mobile_no}</p>}
                </CCol>

                <CCol md={4}>
                  <CFormLabel htmlFor="creditAmount">Credit Amount <span className="text-red">*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    id="creditAmount"
                    name="creditAmount"
                    value={formik.values.creditAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                  {formik.touched.creditAmount && formik.errors.creditAmount && <p className="text-red">{formik.errors.creditAmount}</p>}
                </CCol>

                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      Save
                    </CButton>
                    <Link to={`${process.env.PUBLIC_URL}/user-list`} className="btn btn-danger btn-icon text-white ">
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
