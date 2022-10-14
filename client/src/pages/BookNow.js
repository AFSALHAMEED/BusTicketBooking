import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../component/SeatSelection";
import { axiosInstance } from "../helpers/axiosinstance";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import StripeCheckout from "react-stripe-checkout";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
const navigate = useNavigate()
  const param = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);

  const getBus = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: param.id,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setBus(response.data.data);
        console.log(bus);
      } else {
        message.error(response.data.message);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };
  const bookNow = async (transactionId) => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        transactionId
      });
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/bookings')
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const onToken = async(token) => {
    console.log(token);
try {
  dispatch(showLoading())
  const response = await axiosInstance.post("/api/bookings/make-payment",{
    token,
    amount:selectedSeats.length*bus.fare*100

  })
   dispatch(hideLoading())
  if(response.data.success){
      message.success(response.data.message)
      bookNow(response.data.data.transactionId)

  }
  else{
    message.error(response.data.message)
  }
} catch (error) {
  dispatch(hideLoading())
 
  message.error(error.message)
}
  };
  useEffect(() => {
    getBus();
  }, []);
  return (
    <div >
      {bus && (
        <Row className="mt-3" gutter={20}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-lg text-secondary">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />
            <div className="flex flex-col gap-1">
              <h1 className="text-lg">
               Journey Date: {bus.journeyDate}
              </h1>
              <h1 className="text-lg">
                Fare: {bus.fare}/-
              </h1>
              <h1 className="text-lg">
                Arrival Time {bus.arrival}
              </h1>
              <h1 className="text-lg">
                Departure Time: {bus.departure}
              </h1>
              <h1 className="text-lg">Bus capacity : {bus.capacity}</h1>
              <h1 className="text-lg">
                Seat Left : {bus.capacity - bus.seatsBooked.length}
              </h1>
            </div>
            <hr />
            <div className="flex flex-col gap-3">
              <h3 className="">
                Selected Seats:{selectedSeats.join(", ")}
              </h3>
              <h3 className="mt-2">
                Fare : {bus.fare * selectedSeats.length} /-
              </h3>
              <hr />
              <StripeCheckout
              billingAddress
              amount={selectedSeats.length*bus.fare*100}
                token={onToken}
                currency="INR"
                stripeKey="pk_test_51LqsbfSIa9ydFJQFf8aG3jU4DKfGfoyizbHpsuo7oBDcDbHDBvA6UBGCTvbIbklozLIrk6TBQeLjpVbEg1R44WUT00D7DvCgrX"
                >
                <button
                  className={`secondary-btn mt-3 ${
                    selectedSeats.length === 0 && `disabled-btn`
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
