import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { getDetailByID, addData, updateData } from "../accountService";
import FormInput from "../../../components/Common/FormComponents/FormInput"; // Import the FormInput component
import FormSelect from "../../../components/Common/FormComponents/FormSelect"; // Import the FormSelect component
import FormToggleSwitch from "../../../components/Common/FormComponents/FormToggleSwitch"; // Import the FormToggleSwitch component

import * as Yup from 'yup';
import {
  CForm,
  CCol,
  CButton,
  CFormLabel,
  CSpinner
} from "@coreui/react";

export default function UserForm() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // State to hold the server error message
  const { creditPoints, role, rate, _id } = JSON.parse(localStorage.getItem('user_info')) || {};
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      city: '',
      mobileNumber: '',
      creditPoints: '',
      role: 'user',
      isBetLock: false,
      isActive: true,
      forcePasswordChange: true,
      exposureLimit: '',
      exposurePercentage: '',
      stakeLimit: '',
      maxProfit: '',
      maxLoss: '',
      bonus: '',
      maxStake: ''
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
      mobileNumber: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
      creditPoints: Yup.number()
        .required('Credit amount is required')
        .test('creditPoints', 'Credit amount exceeds available balance', function (value) {
          // Access the user's role and creditPoints
          const user = JSON.parse(localStorage.getItem('user_info'));
          const creditPoints = user?.creditPoints || 0;

          // Check if the user's role is not 'system_owner' and credit amount exceeds creditPoints
          if (user?.role !== 'system_owner' && value > creditPoints) {
            return false; // Validation failed
          }
          return true; // Validation passed
        }),

      exposureLimit: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('Exposure Limit is required');
        }
        return schema;
      }),
      exposurePercentage: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('Exposure Percentage Limit is required');
        }
        return schema;
      }),
      stakeLimit: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('Stake Limit is required');
        }
        return schema;
      }),
      maxProfit: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('Max Profit Limit is required');
        }
        return schema;
      }),
      maxLoss: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('Max Loss Limit is required');
        }
        return schema;
      }),
      bonus: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('Bonus Limit is required');
        }
        return schema;
      }),
      maxStake: Yup.number().when('role', (role, schema) => {
        if (Array.isArray(role) && role.includes('user')) {
          return schema.required('max Stake Limit is required');
        }
        return schema;
      }),
    }),
    onSubmit: async (values) => {
      // Perform form submission logic
      setServerError(null); // Reset server error state
      setLoading(true); // Set loading state to true
      try {
        let response = null;
        if (id !== '' && id !== undefined) {
          response = await updateData({
            _id: id,
            ...values,
          });
        } else {
          response = await addData({
            ...values,
          });
        }
        if (response.success) {
          navigate("/user-list/");
        } else {
          setServerError(response.message);
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
    const fetchData = async () => {
      if (id) {
        const result = await getDetailByID(id);

        formik.setValues((prevValues) => ({

          ...prevValues,
          username: result.username || '',
          fullName: result.fullName || '',
          password: result.password || '',
          city: result.city || '',
          mobileNumber: result.mobileNumber || '',
          creditPoints: result.creditPoints || '',
          role: result.role || '',
          isBetLock: result.isBetLock || false,
          isActive: result.isActive || false,
          forcePasswordChange: result.forcePasswordChange || false,
          exposureLimit: result.exposureLimit || '',
          exposurePercentage: result.exposurePercentage || '',
          stakeLimit: result.stakeLimit || '',
          maxProfit: result.maxProfit || '',
          maxLoss: result.maxLoss || '',
          bonus: result.bonus || '',
          maxStake: result.maxStake || '',
        }));
      }
    };
    fetchData();
  }, [id, getDetailByID]);

  const formTitle = id ? "UPDATE USER" : "CREATE USER";

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
            {/* <Card.Header>
              <h3 className="card-title">General Information</h3>
            </Card.Header> */}
            <Card.Body>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={formik.handleSubmit}
              >
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
                  label="City"
                  name="city"
                  type="text"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && formik.errors.city}
                  isRequired="false"
                  width={3}
                />

                <FormInput
                  label="Mobile Number"
                  name="mobileNumber"
                  type="text"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobileNumber && formik.errors.mobileNumber}
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

                <FormInput
                  label="Credit Amount"
                  name="creditPoints"
                  type="text"
                  value={formik.values.creditPoints}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.creditPoints && formik.errors.creditPoints}
                  isRequired="true"
                  width={3}
                />

                <input type="hidden" name="role" value={formik.values.role} />

                <Row>
                  <hr className="my-5" />

                  <h4 className="mb-4">User Setting </h4>

                  <CCol md="1">
                    <CFormLabel htmlFor="isBetLock">Bet Lock</CFormLabel>
                    <FormToggleSwitch
                      id="isBetLock"
                      name="isBetLock"
                      checked={formik.values.isBetLock}
                      onChange={() => {
                        formik.setFieldValue('isBetLock', !formik.values.isBetLock);
                      }}
                    />
                  </CCol>

                  <CCol md="1">
                    <CFormLabel htmlFor="isActive">User Lock</CFormLabel>
                    <FormToggleSwitch
                      id="isActive"
                      name="isActive"
                      checked={formik.values.isActive}
                      onChange={() => {
                        formik.setFieldValue('isActive', !formik.values.isActive);
                      }}
                    />
                  </CCol>

                  <CCol md="2">
                    <CFormLabel htmlFor="forcePasswordChange">Force Password change</CFormLabel>
                    <FormToggleSwitch
                      id="forcePasswordChange"
                      name="forcePasswordChange"
                      checked={formik.values.forcePasswordChange}
                      onChange={() => {
                        formik.setFieldValue('forcePasswordChange', !formik.values.forcePasswordChange);
                      }}
                    />
                  </CCol>
                  <FormInput
                    label="Exposure Limit"
                    name="exposureLimit"
                    type="text"
                    value={formik.values.exposureLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.exposureLimit && formik.errors.exposureLimit}
                    isRequired="true"
                    width={2}
                  />

                  <FormInput
                    label="Exposure Percentage"
                    name="exposurePercentage"
                    type="text"
                    value={formik.values.exposurePercentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.exposurePercentage && formik.errors.exposurePercentage}
                    isRequired="true"
                    width={2}
                  />

                  <FormInput
                    label="Stake Limit"
                    name="stakeLimit"
                    type="text"
                    value={formik.values.stakeLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.stakeLimit && formik.errors.stakeLimit}
                    isRequired="true"
                    width={2}
                  />

                  <FormInput
                    label="Max Profit"
                    name="maxProfit"
                    type="text"
                    value={formik.values.maxProfit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.maxProfit && formik.errors.maxProfit}
                    isRequired="true"
                    width={2}
                  />

                  <FormInput
                    label="Max Loss"
                    name="maxLoss"
                    type="text"
                    value={formik.values.maxLoss}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.maxLoss && formik.errors.maxLoss}
                    isRequired="true"
                    width={2}
                  />

                  <FormInput
                    label="Bonus"
                    name="bonus"
                    type="text"
                    value={formik.values.bonus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bonus && formik.errors.bonus}
                    isRequired="true"
                    width={2}
                  />
                  <FormInput
                    label="Max Stake"
                    name="maxStake"
                    type="text"
                    value={formik.values.maxStake}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.maxStake && formik.errors.maxStake}
                    isRequired="true"
                    width={2}
                  />

                </Row>


                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      {loading ? <CSpinner size="sm" /> : "Save"}
                    </CButton>
                    <Link to={`${process.env.PUBLIC_URL}/account-list`} className="btn btn-danger btn-icon text-white ">
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