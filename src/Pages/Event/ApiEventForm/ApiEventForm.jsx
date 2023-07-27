import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Accordion, Card, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { getEventDetailByID, addEvent, updateEvent, getAllCompetionByEvent, activeAllEvent, activeAllCompetition } from "../eventService";
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
  const [sportList, setSportList] = useState([]);

  const [selectedSport, setSelectedSport] = useState(null);
  const [addedCompetitionIds, setAddedCompetitionIds] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [addedEventIds, setAddedEventIds] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [eventSettingData, setEventSettingData] = useState(null);

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

  const toggleCompetitionStatus = (competition) => {
    const updatedCompetitions = addedCompetitionIds.includes(competition._id)
      ? addedCompetitionIds.filter((id) => id !== competition._id)
      : [...addedCompetitionIds, competition._id];
    setAddedCompetitionIds(updatedCompetitions);

  };

  const toggleEventStatus = (event) => {
    const updatedEvents = addedEventIds.includes(event._id)
      ? addedEventIds.filter(id => id !== event._id)
      : [...addedEventIds, event._id];
    setAddedEventIds(updatedEvents);
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleEventEditClick = (event) => {
    console.log(event)
    //setEventSettingData(event)
    //setSelectedSport(null); // Hide the selectedSport when the event is edited
    //setSelectedCompetition(null); // Hide the selectedCompetition when the event is edited
  };

  const updateCompetition = async (e) => {
    console.log(addedCompetitionIds);
    // API here
    const response = await activeAllCompetition({
      competitionIds: addedCompetitionIds,
      sportId: selectedSport._id
    });
    if (response.success) {
      navigate("/event-list/");
    } else {
      setServerError(response.message);
    }
  }

  const updateEvent = async (e) => {
    console.log(addedEventIds);
    const response = await activeAllEvent({
      eventIds: addedEventIds,
      competitionId: selectedCompetition._id
    });
    if (response.success) {
      navigate("/event-list/");
    } else {
      setServerError(response.message);
    }
  }

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

      const sportData = await getAllCompetionByEvent();
      setSportList(sportData);

      const addedEvents = sportData.reduce((acc, sport) => {
        const events = sport.competitions.flatMap(comp => comp.events);
        const addedIds = events.filter(event => event.isActive).map(event => event._id);
        return [...acc, ...addedIds];
      }, []);

      setAddedEventIds(addedEvents);
    };
    fetchData();
  }, [id]);

  const formTitle = id ? "UPDATE EVENT" : "CREATE EVENT";

  return (
    <div>
      {/* <div className="page-header">
        <div>
          <h1 className="page-title"> {formTitle}</h1>
        </div>
      </div> */}

      <Row className="mt-5">
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Match</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <CCol lg={4}>
                  <Accordion defaultActiveKey="0">
                    {sportList.map((sport, index) => (
                      <Accordion.Item key={index} eventKey={index} className="mb-1">
                        <Accordion.Header className="panel-heading1 style3" onClick={() => {
                          setSelectedCompetition(null); // Make selectedCompetition blank on sport click
                          setEventSettingData(null)
                          setSelectedSport(sport);
                          setAddedCompetitionIds(
                            sport.competitions.filter((comp) => comp.isActive).map((comp) => comp._id)
                          );
                        }}>
                          {sport.name}
                        </Accordion.Header>
                        <Accordion.Body className="border">
                          <Accordion defaultActiveKey="0">
                            {sport.competitions.map((competition, competition_index) => (

                              competition.isActive === true && (
                                < Accordion.Item key={competition_index} eventKey={competition_index} className="mb-1" >
                                  <Accordion.Header className="panel-heading1 style3" onClick={() => {
                                    setSelectedCompetition(competition); // Make selectedCompetition blank on sport click
                                    setSelectedSport(null);
                                    setEventSettingData(null);
                                    setAddedEventIds(
                                      competition.events.filter((ev) => ev.isActive).map((ev) => ev._id)
                                    );
                                  }}>
                                    {competition.name}
                                    {/* <Link to={`${process.env.PUBLIC_URL}/competition-form`} state={{ id: competition._id }}>
                                      <span className=" rounded-pill ">
                                        <i className="fa fa-edit"></i>
                                      </span>
                                    </Link> */}

                                  </Accordion.Header>
                                  <Accordion.Body className="border">
                                    <div className="">
                                      <ul className="list-group">
                                        {competition.events.map((event, event_index) => (
                                          event.isActive == true &&
                                          <Link to={`${process.env.PUBLIC_URL}/event-form`} state={{ id: event._id }} >
                                            <li className="listunorder" key={event._id}>{event.name}
                                              <span className="badgetext badge bg-default rounded-pill">
                                                <i className="fa fa-edit"></i>
                                              </span>
                                            </li>
                                          </Link>
                                        ))}
                                      </ul>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              )
                            ))}
                          </Accordion>

                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </CCol>
                <CCol lg={8}>
                  {serverError && <p className="text-red">{serverError}</p>}
                  {/* Display server error message */}

                  {selectedSport && (
                    <Row>

                      <div>
                        <h4>{selectedSport.name}</h4>
                        {/* Display other competition data here */}
                      </div>

                      <FormInput
                        label="Search"
                        name="searchText"
                        type="text"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        width={3}
                      />

                      <Row className="mt-5">
                        <CCol lg={4}>
                          Already Added :
                        </CCol>
                        <CCol lg={8}>
                          <div className="">
                            <ul className="list-group">
                              {selectedSport.competitions.map((competition, event_index) =>
                                addedCompetitionIds.includes(competition._id) ? (
                                  <li className="listunorder" key={competition._id} onClick={() => toggleCompetitionStatus(competition)}>
                                    {competition.name}
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </div>
                        </CCol>
                      </Row>
                      <hr className="mt-5"></hr>
                      <Row className="mt-5">
                        <CCol lg={4}>
                          All :
                        </CCol>
                        <CCol lg={8}>
                          <div className="">
                            <ul className="list-group">
                              {selectedSport.competitions.map((event, event_index) => {
                                const eventName = event.name.toLowerCase();
                                const searchQuery = searchText.toLowerCase();
                                if (!addedCompetitionIds.includes(event._id) && eventName.includes(searchQuery)) {
                                  return (
                                    <li className="listunorder" key={event._id} onClick={() => toggleCompetitionStatus(event)}>
                                      {event.name}
                                    </li>
                                  );
                                }
                                return null;
                              })}

                            </ul>
                          </div>
                        </CCol>
                      </Row>
                      <CCol xs={12}>
                        <div className="d-grid gap-2 d-md-block">
                          <CButton color="primary" type="button" className="me-3" onClick={() => {
                            updateCompetition()
                          }}>
                            {loading ? <CSpinner size="sm" /> : "Save"}
                          </CButton>

                        </div>
                      </CCol>

                    </Row>
                  )}

                  {selectedCompetition && (
                    <Row>

                      <div>
                        <h4>{selectedCompetition.name}</h4>
                        {/* Display other competition data here */}
                      </div>

                      <FormInput
                        label="Search"
                        name="searchText"
                        type="text"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        width={3}
                      />

                      <Row className="mt-5">
                        <CCol lg={4}>
                          Already Added :
                        </CCol>
                        <CCol lg={8}>
                          <div className="">
                            <ul className="list-group">
                              {selectedCompetition.events.map((event, event_index) =>
                                addedEventIds.includes(event._id) ? (
                                  <li className="listunorder" key={event._id} onClick={() => toggleEventStatus(event)}>
                                    {event.name}
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </div>
                        </CCol>
                      </Row>
                      <hr className="mt-5"></hr>
                      <Row className="mt-5">
                        <CCol lg={4}>
                          All :
                        </CCol>
                        <CCol lg={8}>
                          <div className="">
                            <ul className="list-group">
                              {selectedCompetition.events.map((event, event_index) => {
                                const eventName = event.name.toLowerCase();
                                const searchQuery = searchText.toLowerCase();
                                if (!addedEventIds.includes(event._id) && eventName.includes(searchQuery)) {
                                  return (
                                    <li className="listunorder" key={event._id} onClick={() => toggleEventStatus(event)}>
                                      {event.name}
                                    </li>
                                  );
                                }
                                return null;
                              })}

                            </ul>
                          </div>
                        </CCol>
                      </Row>
                      <CCol xs={12}>
                        <div className="d-grid gap-2 d-md-block">
                          <CButton color="primary" type="button" className="me-3" onClick={() => {
                            updateEvent()
                          }}>
                            {loading ? <CSpinner size="sm" /> : "Save"}
                          </CButton>

                        </div>
                      </CCol>

                    </Row>
                  )}

                  {eventSettingData && (
                    <Row>

                      <div>
                        <h4>{eventSettingData.name}</h4>
                        {/* Display other competition data here */}
                      </div>

                      <Row>
                        <CCol xs={12} md={6} lg={3} >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id=""
                              name=""
                              checked={false}
                            // onChange={(e) =>
                            //   formik.setFieldValue(match_odds, e.target.checked)
                            // }
                            />
                            <CFormLabel className="form-check-label">
                              Match Odds
                            </CFormLabel>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} lg={3} >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id=""
                              name=""
                              checked={false}
                            // onChange={(e) =>
                            //   formik.setFieldValue(match_odds, e.target.checked)
                            // }
                            />
                            <CFormLabel className="form-check-label">
                              Visible to player
                            </CFormLabel>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} lg={3} >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id=""
                              name=""
                              checked={false}
                            // onChange={(e) =>
                            //   formik.setFieldValue(match_odds, e.target.checked)
                            // }
                            />
                            <CFormLabel className="form-check-label">
                              Can bet
                            </CFormLabel>
                          </div>
                        </CCol>

                      </Row>

                      <Row>
                        <CCol xs={12} md={6} lg={3} >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id=""
                              name=""
                              checked={false}
                            // onChange={(e) =>
                            //   formik.setFieldValue(match_odds, e.target.checked)
                            // }
                            />
                            <CFormLabel className="form-check-label">
                              Match Odds
                            </CFormLabel>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} lg={3} >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id=""
                              name=""
                              checked={false}
                            // onChange={(e) =>
                            //   formik.setFieldValue(match_odds, e.target.checked)
                            // }
                            />
                            <CFormLabel className="form-check-label">
                              Visible to player
                            </CFormLabel>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} lg={3} >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id=""
                              name=""
                              checked={false}
                            // onChange={(e) =>
                            //   formik.setFieldValue(match_odds, e.target.checked)
                            // }
                            />
                            <CFormLabel className="form-check-label">
                              Can bet
                            </CFormLabel>
                          </div>
                        </CCol>

                      </Row>

                      <CCol xs={12}>
                        <div className="d-grid gap-2 d-md-block">
                          <CButton color="primary" type="button" className="me-3" onClick={() => {
                            updateEvent()
                          }}>
                            {loading ? <CSpinner size="sm" /> : "Save"}
                          </CButton>

                        </div>
                      </CCol>

                    </Row>
                  )}
                </CCol>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div >
  );
}
