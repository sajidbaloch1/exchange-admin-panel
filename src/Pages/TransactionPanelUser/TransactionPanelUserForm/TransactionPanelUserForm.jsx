import { CButton, CCol, CForm, CFormLabel, CSpinner } from "@coreui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import FormInput from "../../../components/Common/FormComponents/FormInput"; // Import the FormInput component
import { Notify } from "../../../utils/notify";
import { createTransactionUser, getTransactionUserById, updateTransactionUser } from "../transactionPanelUserService";


const validationSchemaForCreate = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .test("no-spaces", "Spaces are not allowed in the username", (value) => {
      if (value) {
        return !/\s/.test(value); // Check if there are no spaces in the username
      }
      return true;
    }),
  name: Yup.string().required("Full name is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const validationSchemaForUpdate = Yup.object({
  name: Yup.string().required("Full name is required"),
  password: Yup.string().nullable(true).min(6, "Password must be at least 6 characters long"),
  confirmPassword: Yup.string()
    .nullable(true)
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

export default function TransactionPanelUserForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state ? location.state.id : null;
  const editMode = !!id;

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const user = {
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  };

  const submitForm = async (values) => {
    setServerError(null);
    setLoading(true);

    try {
      let response = null;

      if (editMode) {
        response = await updateTransactionUser({
          _id: id,
          ...values,
        });
      } else {
        response = await createTransactionUser({
          ...values,
        });
      }

      if (response.success) {
        Notify.success(editMode ? "Transaction panel user updated successfully." : "Transaction user added successfully");
        navigate("/transaction-panel-user-list/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Notify.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: user,
    validationSchema: editMode ? validationSchemaForUpdate : validationSchemaForCreate,
    onSubmit: submitForm,
  });

  useEffect(() => {
    const fetchData = async () => {
      // !!! IMPORTANT NOTE: The order of the promises in the array must match the order of the results in the results array
      Promise.all([getTransactionUserById(id)]).then((results) => {
        const [fetchtedUser] = results;

        if (fetchtedUser !== null) {
          const result = fetchtedUser;
          formik.setValues((prevValues) => ({
            ...prevValues,
            username: result.username || "",
            name: result.name || "",

          }));
        }
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formTitle = id ? "UPDATE TRANSACTION PANEL USER" : "CREATE TRANSACTION PANEL USER";

  return (
    <div>
      <div className="page-header mb-3">
        <h1 className="page-title">{formTitle}</h1>
      </div>

      <Card>

        <Card.Body>
          <CForm className="row g-3 needs-validation" onSubmit={formik.handleSubmit}>
            {serverError ? <p className="text-red">{serverError}</p> : null}

            <FormInput
              disabled={editMode}
              label="Username"
              name="username"
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && formik.errors.username}
              isRequired={editMode ? "false" : "true"}
              width={3}
              autoComplete={false}
            />

            <FormInput
              label="Name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
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
              isRequired={editMode ? "false" : "true"}
              width={3}
              autoComplete={false}
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              isRequired={editMode ? "false" : "true"}
              width={3}
              autoComplete={false}
            />

            <CCol xs={12} className="pt-3">
              <div className="d-grid gap-2 d-md-block">
                <CButton color="primary" type="submit" className="me-md-3">
                  {loading ? <CSpinner size="sm" /> : editMode ? "Update" : "Create"}
                </CButton>

                <Link to={`${process.env.PUBLIC_URL}/transaction-panel-user-list`} className="btn btn-danger btn-icon text-white ">
                  Cancel
                </Link>
              </div>
            </CCol>
          </CForm>
        </Card.Body>
      </Card>
    </div>
  );
}
