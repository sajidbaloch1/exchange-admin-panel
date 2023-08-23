import { CCol } from "@coreui/react";
import React, { useState } from "react";
import { Card, Row } from "react-bootstrap";
import MatchDetails from "./components/MatchDetails";
import SportsCompetitions from "./components/SportsCompetitions";

function EventBetDetail() {
  const [eventId, setEventId] = useState(null);

  return (
    <div className="mt-5">
      <Card>
        <Card.Header>
          <h3 className="card-title">Match</h3>
        </Card.Header>

        <Card.Body>
          <Row>
            <CCol md={3}>
              <SportsCompetitions onClick={setEventId} />
            </CCol>

            <CCol md={9}>{eventId ? <MatchDetails eventId={eventId} /> : null}</CCol>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EventBetDetail;
