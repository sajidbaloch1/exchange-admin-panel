import { CCol } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { getEventMatchData } from "../../eventBetService";
import MatchOdds from "./MatchOdds";
import UserBets from "./UserBets";

function MatchDetails({ eventId }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [marketId, setMarketId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const eventData = await getEventMatchData(eventId);
      setSelectedEvent(eventData);
      setMarketId(eventData.marketId);
    };

    fetchData();

    return () => {
      setSelectedEvent(null);
      setMarketId(null);
    };
  }, [eventId]);

  return (
    <div>
      {selectedEvent ? (
        <Row>
          <h4>
            {selectedEvent?.competitionName} {" > "} {selectedEvent?.eventName}
          </h4>

          <CCol md={8}>
            {marketId ? (
              <>
                <MatchOdds marketId={marketId} selectedEvent={selectedEvent} />
              </>
            ) : null}
          </CCol>

          <CCol md={4}>
            <UserBets eventId={eventId} />
          </CCol>
        </Row>
      ) : null}
    </div>
  );
}

export default MatchDetails;
