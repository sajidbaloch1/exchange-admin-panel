import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Card, Row, Col, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { getCompetitionDetailByID, addCompetition, updateCompetition } from "../competitionService";
import { getAllSport } from '../../Sport/sportService'
import FormInput from "../../../components/Common/FormComponents/FormInput";
import FormSelect from "../../../components/Common/FormComponents/FormSelect"; // Import the FormSelect component
import * as Yup from "yup";
import { CForm, CCol, CFormLabel, CButton, CSpinner } from "@coreui/react";

export default function CompetitionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  //id get from state
  const id = location.state ? location.state.id : '';
  //id get from url
  //const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // State to hold the server error message
  const [sportList, setSportList] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      sportId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      sportId: Yup.string().required('Sport is required'),
    }),
    onSubmit: async (values) => {
      // Perform form submission logic
      setServerError(null); // Reset server error state
      setLoading(true); // Set loading state to true
      try {
        const { name, sportId } = values;
        if (id !== "" && id !== undefined) {

          const response = await updateCompetition({
            _id: id,
            ...values,
          });
          if (response.success) {
            navigate("/competition-list/");
          } else {
            setServerError(response.message);
          }
        } else {
          const response = await addCompetition({
            ...values,
          });
          if (response.success) {
            navigate("/competition-list/");
          } else {
            setServerError(response.message);
          }
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
        const result = await getCompetitionDetailByID(id);

        formik.setValues((prevValues) => ({
          ...prevValues,
          name: result.name || "",
          sportId: result.sportId || "",
        }));
      }

      const sportData = await getAllSport(0);
      setSportList(sportData.records);
    };
    fetchData();
  }, [id]);

  const formTitle = id ? "UPDATE COMPETITION" : "CREATE COMPETITION";

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

                <FormSelect
                  label="Sport"
                  name="sportId"
                  value={formik.values.sportId}
                  onChange={(event) => {
                    formik.setFieldValue('sportId', event.target.value);

                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sportId && formik.errors.sportId}
                  isRequired="true"
                  width={3}
                >
                  <option value="">Select Sport</option>
                  {sportList.map((sport, index) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </FormSelect>

                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      {loading ? <CSpinner size="sm" /> : "Save"}
                    </CButton>
                    <Link
                      to={`${process.env.PUBLIC_URL}/competition-list`}
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
