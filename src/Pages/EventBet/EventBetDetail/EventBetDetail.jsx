import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Accordion, Card, Row, Col, Button } from "react-bootstrap";
import { getAllActiveCompetitionEvents, getEventMatchData, matchOddsDetail, getAllBet } from "../eventBetService";
import "../eventBetDetail.css";
import FormInput from "../../../components/Common/FormComponents/FormInput";
import { Notify } from "../../../utils/notify";
import { CCol, CFormLabel, CButton, CSpinner } from "@coreui/react";
import CardActions from "@mui/material/CardActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import BetLockModal from "../BetLockModal";
import { SocketContext } from "../../../components/SocketContext";
import BetBox from "../../../components/Common/BetComponents/BetBox";

export default function EventBetDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  //id get from state
  const id = location.state ? location.state.id : '';
  //id get from url
  //const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sportList, setSportList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expanded, setExpanded] = React.useState(true);

  const [marketId, setMarketId] = useState(0);
  const [showBetLockModal, setShowBetLockModal] = useState(false);
  const [rowData, setRowData] = useState("");

  const [betList, setBetList] = useState([]);

  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);

  const [teamOneLayData, setTeamOneLayData] = useState([]);
  const [teamOneBackData, setTeamOneBackData] = useState([]);
  const [previousTeamOneBackData, setPreviousTeamOneBackData] = useState([]);

  const [teamTwoLayData, setTeamTwoLayData] = useState([]);
  const [teamTwoBackData, setTeamTwoBackData] = useState([]);

  const { matchOddDetails, socket } = useContext(SocketContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const formatSize = (size) => {
    if (size >= 100000) {
      return `${(size / 100000).toFixed(1)}L`;
    } else if (size >= 1000) {
      return `${(size / 1000).toFixed(1)}k`;
    } else {
      return size.toString();
    }
  };

  const [show, setShow] = useState(true);

  useEffect(() => {
    socket.on('getMatchOdds', data => {

      if (data.length > 0) {
        setTeamOneLayData(data[0].matchOdds[0]?.lay)
        setTeamOneBackData(data[0].matchOdds[0]?.back)

        setTeamTwoLayData(data[0].matchOdds[1]?.lay)
        setTeamTwoBackData(data[0].matchOdds[1]?.back)
      }
      //setTeamOneData(data[0].matchOdds)
    })


    return () => {
      socket.off('getMatchOdds')
    }
  }, [])

  useEffect(() => {
    // When teamOneBackData updates, set the current data as previous
    setPreviousTeamOneBackData(teamOneBackData);
  }, [teamOneBackData]);

  const eventMatchData = async (eventId) => {
    try {
      const eventData = await getEventMatchData(eventId);

      setSelectedEvent(eventData); // Set the selected event data in state
      setTeamOne(eventData.marketRunners[0].selectionId)
      setTeamTwo(eventData.marketRunners[1].selectionId)
      setMarketId(eventData.marketId); // Update the marketId here
      betDetail();
      matchOddDetails(marketId)
    } catch (error) {
      console.error("Error fetching event data:", error);
      // Handle the error here, e.g., show a notification or error message
    }
  };

  const handleDepositClick = () => {
    // Set initial values for the Deposit modal based on the row data
    setShowBetLockModal(true);
    //setRowData(row);
  };

  const betDetail = async () => {
    try {
      const betData = await getAllBet(marketId);
      setBetList(betData)
    } catch (error) {
      console.error("Error fetching event data:", error);
      // Handle the error here, e.g., show a notification or error message
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const sportData = await getAllActiveCompetitionEvents();
      setSportList(sportData);
    };
    fetchData();
    betDetail();
  }, [id, marketId]);

  return (
    <div>
      <Row className="mt-5">
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Match</h3>
            </Card.Header>
            <Card.Body>

              <Row>
                <CCol lg={3}>
                  <Accordion defaultActiveKey="0">
                    {sportList.map((sport, index) => (
                      <Accordion.Item key={sport._id} eventKey={sport._id} className="mb-1">
                        <Accordion.Header className="panel-heading1 style3" >
                          {sport.name}
                        </Accordion.Header>
                        <Accordion.Body className="border">
                          <Accordion defaultActiveKey="0">
                            {sport.competitions.map((competition, competition_index) => (

                              competition.isActive === true && (
                                < Accordion.Item key={competition._id} eventKey={competition._id} className="mb-1" >
                                  <Accordion.Header className="panel-heading1 style3">
                                    {competition.name}
                                  </Accordion.Header>
                                  <Accordion.Body className="border">
                                    <div className="">
                                      <ul className="list-group">
                                        {competition.events.map((event, event_index) => (
                                          event.isActive == true &&
                                          <li
                                            onClick={() => {
                                              eventMatchData(event._id); // Call the function on event click
                                            }}
                                            className="listunorder" key={event._id + '_list'}
                                            style={{ cursor: "pointer" }}>
                                            {event.name}
                                          </li>

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
                <CCol lg={6}>
                  {/* Display server error message */}
                  {selectedEvent && (
                    <Row>
                      <div>
                        <h4>{selectedEvent.competitionName} {' > '} {selectedEvent.eventName} </h4>
                        {/* Display other competition data here */}
                      </div>
                      <hr className="mt-5"></hr>
                      <Card className="card">
                        <CardActions className="card-header bg-primary br-tr-3 br-tl-3">
                          <h3 className="card-title text-white">MATCH_ODDS</h3>
                          <div className="rtlcards ">
                            <ExpandMore
                              expand={expanded}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more"
                            >
                              <ExpandMoreIcon className=" text-white" />
                            </ExpandMore>
                            <IconButton
                              size="small"
                              edge="start"
                              color="inherit"
                              onClick={() => setShow(false)}
                              aria-label="close"
                            >
                            </IconButton>
                          </div>
                        </CardActions>

                        <Collapse in={expanded} timeout="auto">
                          <div className="card-body">

                            <div className="row main-title-row">
                              <div className="col-md-4 col-sm-12 col-12"></div>
                              <div className="col-md-8 col-sm-12 col-12 center-content">
                                <div className="yes-nno-tab">
                                  Max : 1.3
                                  <div className="grey-box back2">Back</div>
                                  <div className="grey-box lay2">Lay</div>
                                </div>
                              </div>
                            </div>
                            <div className="row pb-2">
                              <div className="col-md-4 col-sm-12 col-12">
                                <div className="title-area"><span>{selectedEvent.marketRunners[0]?.runnerName}</span></div>
                              </div>
                              <div className="col-md-8 col-sm-12 col-12">
                                <div className="blocks griad-6-boxes">
                                  {/* {teamOneBackData.reverse().map((back_one, back_one_index) => (
                                    <BetBox
                                      key={`back-one-${back_one_index}`}
                                      topDate={back_one.price}
                                      bottomData={formatSize(back_one.size)}
                                      colorClass={`back${back_one_index}`}
                                    />
                                  ))} */}

                                  {teamOneBackData.reverse().map((back_one, back_one_index) => {
                                    const previousPrice = previousTeamOneBackData[back_one_index]?.price;
                                    //console.log(previousPrice);
                                    //console.log(back_one.price)
                                    if (previousPrice !== back_one.price) {
                                      console.log('inn');
                                    }

                                    const backgroundColor = previousPrice
                                      ? back_one.price > previousPrice
                                        ? "bg-green" // Set your CSS class for price increase (green background)
                                        : back_one.price < previousPrice
                                          ? "bg-red" // Set your CSS class for price decrease (red background)
                                          : "back" + back_one_index
                                      : "";
                                    //console.log(backgroundColor);
                                    return (
                                      <BetBox
                                        key={`back-one-${back_one_index}`}
                                        topDate={back_one.price}
                                        bottomData={formatSize(back_one.size)}
                                        colorClass={` ${backgroundColor}`}
                                      />
                                    );
                                  })}

                                  {teamOneLayData.map((lay_one, lay_one_index) => (
                                    <BetBox
                                      key={`lay-one-${lay_one_index}`}
                                      topDate={lay_one.price}
                                      bottomData={formatSize(lay_one.size)}
                                      colorClass={`lay${lay_one_index}`}
                                    />
                                  ))}

                                </div>
                              </div>
                            </div>

                            <div className="row pb-2">
                              <div className="col-md-4 col-sm-12 col-12">
                                <div className="title-area"><span>{selectedEvent.marketRunners[1]?.runnerName}</span></div>
                              </div>
                              <div className="col-md-8 col-sm-12 col-12">
                                <div className="blocks griad-6-boxes">
                                  {teamTwoBackData.reverse().map((back_two, back_two_index) => (
                                    <BetBox
                                      key={`back-two-${back_two_index}`}
                                      topDate={back_two.price}
                                      bottomData={formatSize(back_two.size)}
                                      colorClass={`back${back_two_index}`}
                                    />
                                  ))}

                                  {teamTwoLayData.map((lay_two, lay_two_index) => (
                                    <BetBox
                                      key={`lay-two-${lay_two_index}`}
                                      topDate={lay_two.price}
                                      bottomData={formatSize(lay_two.size)}
                                      colorClass={`lay${lay_two_index}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                        </Collapse>
                      </Card>
                    </Row>
                  )}
                </CCol>
                <CCol lg={3}>
                  {/* Display server error message */}
                  {selectedEvent && (
                    <Row>
                      <Card className="card ms-2">
                        <CardActions className="card-header bg-primary br-tr-3 br-tl-3">
                          <h3 className="card-title text-white">MY BETS</h3>

                          <div className="rtlcards ">
                            <Button variant="success" onClick={() => handleDepositClick()} className="btn" title="Deposit">
                              View More
                            </Button>
                            <ExpandMore
                              expand={expanded}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more"
                            >
                              <ExpandMoreIcon className=" text-white" />
                            </ExpandMore>
                            <IconButton
                              size="small"
                              edge="start"
                              color="inherit"
                              onClick={() => setShow(false)}
                              aria-label="close"
                            >
                            </IconButton>
                          </div>
                        </CardActions>

                        <Collapse in={expanded} timeout="auto">
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table coupon-table mb-0">
                                <thead>
                                  <tr>
                                    <th >UserName</th>
                                    <th >Nation</th>
                                    <th className="text-right">Rate</th>
                                    <th className="text-right">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {betList.map((bet, bet_index) => (
                                    <tr key={bet_index}>
                                      <td className="text-center">{bet.userName}</td>
                                      <td className="text-center">{bet.betOrderType}</td>
                                      <td className="text-center">{bet.odds}</td>
                                      <td className="text-center">{bet.stake}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </Collapse>
                      </Card>
                    </Row>
                  )}
                </CCol>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
      <BetLockModal
        show={showBetLockModal}
        onHide={() => setShowBetLockModal(false)}
        betList={betList}
      />
    </div >
  );
}
