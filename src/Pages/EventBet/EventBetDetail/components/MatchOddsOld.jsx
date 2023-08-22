import { ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CardActions, Collapse } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import { io } from "socket.io-client";
import BetBox from "../../../../components/Common/BetComponents/BetBox";

const formatSize = (size) => {
  if (size >= 100000) {
    return `${(size / 100000).toFixed(1)}L`;
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(1)}k`;
  } else {
    return size.toString();
  }
};

function MatchOdds({ selectedEvent, marketId }) {
  const [teamOneLayData, setTeamOneLayData] = useState([]);
  const [teamOneBackData, setTeamOneBackData] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [teamTwoLayData, setTeamTwoLayData] = useState([]);
  const [teamTwoBackData, setTeamTwoBackData] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL;
    const marketUrl = `${socketUrl}/market`;
    const marketSocket = io(marketUrl, {
      autoConnect: false,
    });
    console.log(marketSocket);

    marketSocket.on("disconnect", (data) => {
      console.log("disconnected");
    });

    marketSocket.on("connect_error", (err) => {
      console.log(err.message);
    });

    marketSocket.on("server_error", (message) => {
      console.log(message);
    });

    marketSocket.on(`market:match_odds:m-${marketId}`, (data) => {
      console.log(data);
    });

    marketSocket.on("connect", () => {
      marketSocket.emit("join", {
        id: marketId,
        room: `m-${marketId}`,
        type: "match_odds",
      });
    });

    marketSocket.connect();

    return () => {
      marketSocket.off("disconnect");
      marketSocket.off("connect_error");
      marketSocket.off("server_error");
      marketSocket.off(`market:match_odds:m-${marketId}`);

      marketSocket.disconnect();
    };
  }, [marketId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Row>
      <div>
        <h4>
          {selectedEvent.competitionName} {" > "} {selectedEvent.eventName}{" "}
        </h4>
        {/* Display other competition data here */}
      </div>

      <hr className="mt-5"></hr>
      <Card className="card">
        <CardActions className="card-header bg-primary br-tr-3 br-tl-3">
          <h3 className="card-title text-white">MATCH_ODDS</h3>
          <div className="rtlcards ">
            <ExpandMore
              expand={expanded.toString()}
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
            ></IconButton>
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
                <div className="title-area">
                  <span>{selectedEvent.marketRunners[0]?.runnerName}</span>
                </div>
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
                    const backgroundColor = "back" + back_one_index;
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
                <div className="title-area">
                  <span>{selectedEvent.marketRunners[1]?.runnerName}</span>
                </div>
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
  );
}

export default MatchOdds;
