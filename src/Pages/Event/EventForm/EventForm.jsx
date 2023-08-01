import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Card, Row, Col, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { getEventDetailByID, addEvent, updateEvent } from "../eventService";
import { getAllCompetition } from '../../Competition/competitionService'
import FormInput from "../../../components/Common/FormComponents/FormInput";
import FormSelectWithSearch from "../../../components/Common/FormComponents/FormSelectWithSearch"; // Import the FormSelect component
import FormToggleSwitch from "../../../components/Common/FormComponents/FormToggleSwitch"; // Import the FormToggleSwitch component
import * as Yup from "yup";
import { CForm, CCol, CFormLabel, CButton, CSpinner } from "@coreui/react";

export default function EventForm() {
  const navigate = useNavigate();
  const location = useLocation();
  //id get from state
  const id = location.state ? location.state.id : '';
  //id get from url
  //const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // State to hold the server error message
  const [competitionList, setCompetitionList] = useState([]);


  const formik = useFormik({
    initialValues: {
      name: "",
      matchDate: "",
      competitionId: "",
      sportId: "",
      oddsLimit: "",
      volumeLimit: "",
      minStackSession: "",
      maxStack: "",
      maxStackSession: "",
      minStack: "",
      betDeleted: false,
      hardBetDeleted: false,
      completed: false,
      isActive: false,

    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      matchDate: Yup.string().required("Date is required"),
      competitionId: Yup.string().required('Competition is required'),
      oddsLimit: Yup.number().required("Odds Limit is required"),
      volumeLimit: Yup.number().required("Odds Limit is required"),
      minStackSession: Yup.number().required("Odds Limit is required"),
      maxStack: Yup.number().required("Odds Limit is required"),
      maxStackSession: Yup.number().required("Odds Limit is required"),
      minStack: Yup.number().required("Odds Limit is required"),
    }),
    onSubmit: async (values) => {

      // Perform form submission logic
      setServerError(null); // Reset server error state
      setLoading(true); // Set loading state to true
      try {
        let response = null;
        if (id !== "" && id !== undefined) {

          const response = await updateEvent({
            _id: id,
            ...values,
          });
        } else {
          const response = await addEvent({
            ...values,
          });
        }
        if (response.success) {
          navigate("/event-list/");
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
        const result = await getEventDetailByID(id);

        formik.setValues((prevValues) => ({
          ...prevValues,
          name: result.name || "",
          competitionId: result.competitionId || "",
          sportId: result.sportId || "",
          oddsLimit: result.oddsLimit || "",
          minStackSession: result.minStackSession || "",
          maxStack: result.maxStack || "",
          maxStackSession: result.maxStackSession || "",
          minStack: result.minStack || "",
          volumeLimit: result.volumeLimit || "",
          betDeleted: result.betDeleted || false,
          hardBetDeleted: result.hardBetDeleted || false,
          completed: result.completed || false,
          isActive: result.isActive || false,
        }));
      }

      const competitionData = await getAllCompetition({});
      const dropdownOptions = competitionData.records.map(option => ({
        value: option._id,
        label: option.name,
        sportId: option.sportId,
      }));
      setCompetitionList(dropdownOptions);
    };
    fetchData();
  }, [id]);

  const formTitle = id ? "UPDATE EVENT" : "CREATE EVENT";

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
                {serverError && <p className="text-red">{serverError}</p>}
                {/* Display server error message */}

                <FormSelectWithSearch
                  label="Competition"
                  name="competitionId"
                  value={formik.values.competitionId}
                  onChange={(name, selectedValue) => {
                    formik.setFieldValue(name, selectedValue); // Use the 'name' argument here
                    const selectedCompetition = competitionList.find(
                      (competition) => competition.value === selectedValue
                    );

                    if (selectedCompetition) {
                      formik.setFieldValue('sportId', selectedCompetition.sportId);
                    } else {
                      formik.setFieldValue('sportId', ""); // Reset sportId if selectedCompetition is not found
                    }
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.competitionId && formik.errors.competitionId}
                  isRequired="true"
                  width={3}
                  options={competitionList}
                />

                <FormInput
                  label="Name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Match Date"
                  name="matchDate"
                  type="date"
                  value={formik.values.matchDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.matchDate && formik.errors.matchDate}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Odds Limit"
                  name="oddsLimit"
                  type="text"
                  value={formik.values.oddsLimit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.oddsLimit && formik.errors.oddsLimit}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Volume Limit"
                  name="volumeLimit"
                  type="text"
                  value={formik.values.volumeLimit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.volumeLimit && formik.errors.volumeLimit}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Min Stake Session"
                  name="minStackSession"
                  type="text"
                  value={formik.values.minStackSession}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.minStackSession && formik.errors.minStackSession}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Max Stake"
                  name="maxStack"
                  type="text"
                  value={formik.values.maxStack}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.maxStack && formik.errors.maxStack}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Max Stake Session"
                  name="maxStackSession"
                  type="text"
                  value={formik.values.maxStackSession}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.maxStackSession && formik.errors.maxStackSession}
                  width={3}
                  isRequired="true"
                />

                <FormInput
                  label="Min Stake"
                  name="minStack"
                  type="text"
                  value={formik.values.minStack}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.minStack && formik.errors.minStack}
                  width={3}
                  isRequired="true"
                />
                {id != '' &&
                  <Row>
                    <CCol md="1">
                      <CFormLabel htmlFor="betDeleted">Bet Delete</CFormLabel>
                      <FormToggleSwitch
                        id="betDeleted"
                        name="betDeleted"
                        checked={formik.values.betDeleted}
                        onChange={() => {
                          formik.setFieldValue('betDeleted', !formik.values.betDeleted);
                        }}
                      />
                    </CCol>

                    <CCol md="1">
                      <CFormLabel htmlFor="hardBetDeleted">Hard Delete</CFormLabel>
                      <FormToggleSwitch
                        id="hardBetDeleted"
                        name="hardBetDeleted"
                        checked={formik.values.hardBetDeleted}
                        onChange={() => {
                          formik.setFieldValue('hardBetDeleted', !formik.values.hardBetDeleted);
                        }}
                      />
                    </CCol>

                    <CCol md="1">
                      <CFormLabel htmlFor="completed">Completed</CFormLabel>
                      <FormToggleSwitch
                        id="completed"
                        name="completed"
                        checked={formik.values.completed}
                        onChange={() => {
                          formik.setFieldValue('completed', !formik.values.completed);
                        }}
                      />
                    </CCol>

                    <CCol md="1">
                      <CFormLabel htmlFor="isActive">Status</CFormLabel>
                      <FormToggleSwitch
                        id="isActive"
                        name="isActive"
                        checked={formik.values.isActive}
                        onChange={() => {
                          formik.setFieldValue('isActive', !formik.values.isActive);
                        }}
                      />
                    </CCol>
                  </Row>
                }
                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-block">
                    <CButton color="primary" type="submit" className="me-3">
                      {loading ? <CSpinner size="sm" /> : "Save"}
                    </CButton>
                    <Link
                      to={`${process.env.PUBLIC_URL}/event-list`}
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
