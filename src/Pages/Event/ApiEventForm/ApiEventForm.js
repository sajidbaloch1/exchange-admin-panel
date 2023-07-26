import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Accordion, Card, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { getEventDetailByID, addEvent, updateEvent } from "../eventService";
import { getAllCompetition } from '../../Competition/competitionService'
import FormInput from "../../../components/Common/FormComponents/FormInput";
import FormSelect from "../../../components/Common/FormComponents/FormSelect"; // Import the FormSelect component
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

        if (id !== "" && id !== undefined) {

          const response = await updateEvent({
            _id: id,
            ...values,
          });
          if (response.success) {
            navigate("/event-list/");
          } else {
            setServerError(response.message);
          }
        } else {
          const response = await addEvent({
            ...values,
          });
          if (response.success) {
            navigate("/event-list/");
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

      const competitionData = await getAllCompetition(0);
      setCompetitionList(competitionData.records);
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
            <Card.Header>
              <h3 className="card-title">Match</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <CCol lg={4}>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="mb-1">
                      <Accordion.Header className="panel-heading1 style3">
                        Cricket
                      </Accordion.Header>
                      <Accordion.Body className="border">
                        <div className="">
                          <ul className="list-group">
                            <li className="listunorder">Cras justo odio</li>
                            <li className="listunorder">Dapibus ac facilisis in</li>
                            <li className="listunorder">Morbi leo risus</li>
                            <li className="listunorder">Porta ac consectetur ac</li>
                            <li className="listunorder">Vestibulum at eros</li>
                          </ul>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="mb-1">
                      <Accordion.Header className="panel-heading1 style3">
                        Football
                      </Accordion.Header>
                      <Accordion.Body className="border">

                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="mb-1">
                      <Accordion.Header className="panel-heading1 style3">
                        Horse Riding
                      </Accordion.Header>
                      <Accordion.Body className="border">

                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </CCol>
                <CCol lg={8}>

                </CCol>
              </Row>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={formik.handleSubmit}
              >
                {serverError && <p className="text-red">{serverError}</p>}
                {/* Display server error message */}

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
