import { Col, Row } from "antd";
import React from "react";
import "../resources/bus.css";

function SeatSelection(props) {
  const {  bus } = props;
  const capacity = bus.capacity;
  const selectOrUnSelectSeats = (seatNumber) => {
    if (props.selectedSeats.includes(seatNumber)) {
      return props.setSelectedSeats(
        props.selectedSeats.filter((seat) => seat !== seatNumber)
      )
    } else {
      return props.setSelectedSeats([...props.selectedSeats,seatNumber]);
    }
  };
  return (
    <div className="mx-5">
      <div className="bus-container">
        <Row gutter={[10, 10]}>
          { Array.from(Array(capacity).keys()).map((seat) => {
            let seatClass = ''
            if (props.selectedSeats.includes(seat+1)) {
              seatClass = "selected-seats"
            }
            else if(bus.seatsBooked.includes(seat+1))
              {
                seatClass="booked-seat"
              }
            
            return (
              <Col span={6}>
                <div
                  className={`seats ${seatClass}`}
                  onClick={() => selectOrUnSelectSeats(seat + 1)}
                >
                  {seat + 1}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default SeatSelection;
