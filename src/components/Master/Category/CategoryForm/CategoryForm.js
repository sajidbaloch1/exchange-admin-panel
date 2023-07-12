import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Card, Row, Col, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import { postData } from '../../../../utils/fetch-services';
import { useNavigate } from "react-router-dom";
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
export default function CategoryForm() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
    }),
    onSubmit: (values) => {
      // Perform form submission logic
      store(values.name)
      console.log('Form submitted successfully:', values);
    }
  });

  // const store = async (name) => {
  //   setLoading(true);
  //   const result = await postData('categories/createCategory', {
  //     name: name,

  //   });
  //   if (result.success) {
  //     navigate('/category-list');
  //     setLoading(false);
  //   } else {

  //   }
  // };

  const store = async (name) => {
    setLoading(true);

    if (id !== '' && id !== undefined) {
      const result = await postData('categories/updateCategory', {
        _id: id,
        name: name,
      });
      if (result.success) {
        navigate('/category-list');
        setLoading(false);
      } else {

      }
    } else {
      const result = await postData('categories/createCategory', {
        name: name,
      });
      if (result.success) {
        navigate('/category-list');
        setLoading(false);
      } else {

      }
    }
  };

  const getDetailByID = async (id) => {
    setLoading(true);
    const result = await postData('categories/getCategoryById', {
      _id: id,
    });
    if (result.success) {
      formik.setValues({
        ...formik.values,
        name: result.data.details.name, // Set the name value in formik.values
      });
      setLoading(false);
    } else {

    }
  };


  useEffect(() => {
    if (id !== '' && id !== undefined) {
      getDetailByID(id);
    }
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">CREATE CATEGORY</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Category
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
                  <CFormLabel htmlFor="validationCustom01">Name <span className="text-red">*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                  {formik.touched.name && formik.errors.name && <p className="text-red">{formik.errors.name}</p>}
                </CCol>

                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      Save
                    </CButton>
                    <Link to={`${process.env.PUBLIC_URL}/category-list`} className="btn btn-danger btn-icon text-white ">
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
