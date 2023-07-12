import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Card, Row, Col, Form } from "react-bootstrap";
import {
  CForm,
  CCol,
  CFormLabel,
  CFormFeedback,
  CFormInput,
  CButton,
} from "@coreui/react";
export default function UserForm() {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };
  const { id } = useParams();
  console.log(id)
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">USER</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              User
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Form
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

      </div>

      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">User Detail</h3>
            </Card.Header>
            <Card.Body>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <CCol md={4}>
                  <CFormLabel htmlFor="validationCustom01">Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="validationCustom01"
                    defaultValue=""
                    required
                  />

                  <CFormFeedback invalid>Name is required field.</CFormFeedback>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
                  <CFormInput
                    type="text"
                    id="validationCustom02"
                    defaultValue=""
                    required
                  />
                  <CFormFeedback invalid>Email is required field.</CFormFeedback>
                </CCol>
                {/* <CCol md={4}>
                  <CFormLabel htmlFor="validationCustomUsername">Username</CFormLabel>
                  <CInputGroup className="has-validation">
                    <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
                    <CFormInput
                      type="text"
                      id="validationCustomUsername"
                      defaultValue=""
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                    <CFormFeedback invalid>Please choose a username.</CFormFeedback>
                  </CInputGroup>
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="validationCustom03">City</CFormLabel>
                  <CFormInput type="text" id="validationCustom03" required />
                  <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
                </CCol> */}

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
    </div>
  );
}
