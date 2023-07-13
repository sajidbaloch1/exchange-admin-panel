import React from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card } from "react-bootstrap";
import * as dashboard from "../../data/dashboard/dashboard";
import { Link } from "react-router-dom";
export default function Dashboard() {
  //localStorage.clear();
  return (
    <div>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Dashboard </h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Dashboard
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

      </div>
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={12} sm={12} xl={3}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Balance</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={34516}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-primary me-1">
                          <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                        <i className="fe fe-trending-up text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xl-3">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Exposure</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={56992}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-secondary me-1">
                          <i className="fa fa-chevron-circle-up text-secondary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                        <i className="icon icon-rocket text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
            <Col lg={6} md={12} sm={12} xl={3}>
              <Card className="card overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Credit Pts</h6>
                      <h3 className="mb-2 number-font">

                        <CountUp
                          end={42567}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-success me-1">
                          <i className="fa fa-chevron-circle-down text-success me-1"></i>
                          <span>0.5% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                        <i className="fe fe-dollar-sign text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} md={12} sm={12} xl={3}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">All Pts</h6>
                      <h3 className="mb-2 number-font">

                        <CountUp
                          end={34789}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-danger me-1">
                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                          <span>0.2% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-success-gradient box-shadow-success brround  ms-auto">
                        <i className="fe fe-briefcase text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} md={12} sm={12} xl={3}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Settlement Pts</h6>
                      <h3 className="mb-2 number-font">

                        <CountUp
                          end={34789}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-danger me-1">
                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                          <span>0.2% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-success brround  ms-auto">
                        <i className="fe fe-layers text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} md={12} sm={12} xl={3}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Upper Pts</h6>
                      <h3 className="mb-2 number-font">

                        <CountUp
                          end={34789}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-danger me-1">
                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                          <span>0.2% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-danger-gradient box-shadow-success brround  ms-auto">
                        <i className="fe fe-arrow-up text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} md={12} sm={12} xl={3}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Down Pts</h6>
                      <h3 className="mb-2 number-font">

                        <CountUp
                          end={34789}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      {/* <p className="text-muted mb-0">
                        <span className="text-danger me-1">
                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                          <span>0.2% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-secondary-gradient box-shadow-success brround  ms-auto">
                        <i className="fe fe-arrow-down text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <Card>
            {/* <Card.Header className="card-header">
              <h3 className="card-title">Total Transactions</h3>
            </Card.Header> */}
            <Card.Body className="card-body pb-0">
              <div id="chartArea" className="chart-donut">
                <ReactApexChart
                  options={dashboard.dashboardGraph.options}
                  series={dashboard.dashboardGraph.series}
                  type="bar"
                  height={300}
                />
              </div>
              <Row className="row5 align-self-center text-center">
                <Col xs={6} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary"></i> Credit pts
                  </p>
                  <h5>1,00,000</h5>
                </Col>
                <Col xs={6} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-warning"></i> All pts
                  </p>
                  <h5>1,00,000</h5>
                </Col>
                <Col xs={4} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-info"></i> Settlement pts
                  </p>
                  <h5>0</h5>
                </Col>
                <Col xs={4} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i> Upper pts
                  </p>
                  <h5>0</h5>
                </Col>
                <Col xs={4} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-dark"></i> Down pts
                  </p>
                  <h5>0</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            {/* <Card.Header className="card-header">
              <h3 className="card-title">Total Transactions</h3>
            </Card.Header> */}
            <Card.Body className="card-body pb-0">
              <div id="chartArea" className="chart-donut">
                <ReactApexChart
                  options={dashboard.categoryWiseGraph.options}
                  series={dashboard.categoryWiseGraph.series}
                  type="bar"
                  height={300}
                />
              </div>
              <Row className="row5 align-self-center text-center">
                <Col xs={6} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary"></i> Sports P/L
                  </p>
                  <h5>1,00,000</h5>
                </Col>
                <Col xs={6} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-warning"></i> Casino P/L
                  </p>
                  <h5>1,00,000</h5>
                </Col>
                <Col xs={4} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-info"></i> Tp Casino P/L
                  </p>
                  <h5>0</h5>
                </Col>
                <Col xs={4} sm>
                  <p className="mb-2 font-size-11">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i> Total P/L
                  </p>
                  <h5>0</h5>
                </Col>

              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <h1 className="page-title">Our Live Casino </h1>
        </Col>
      </Row>

    </div>
  );
}
