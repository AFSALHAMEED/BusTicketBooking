import { message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../component/PageTitle";
import { axiosInstance } from "../helpers/axiosinstance";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useReactToPrint } from 'react-to-print';
function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [booking, setBooking] = useState([]);
  const dispatch = useDispatch();
  const getBooking = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-user-id",
        {}
      );
      dispatch(hideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBooking(mappedData);
      } else {
        message.error(response.data.message);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const column = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render:(seats)=>{
        return seats.join(", ")
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setShowPrintModal(true);
              setSelectedBooking(record);
            }}
          >
            Print Ticket
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBooking();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <PageTitle title="Booking" />
      <div className="mt-2">
      <Table dataSource={booking} columns={column}></Table>

      </div>
     {
        showPrintModal && (
            <Modal title="print-Ticket"
            onCancel={()=>{
              setShowPrintModal(false)
              setSelectedBooking(null)
            }}
            visible={showPrintModal}
            okText="Print"
            onOk={handlePrint}>
              <div className="d-flex flex-column p-5" ref={componentRef}>
                <p className="text-lg">Bus : {selectedBooking.name}</p>
                <p className="text-md text-secondary">{selectedBooking.from} - {selectedBooking.to}</p>
                <hr />
                <p>
                    <span >Journey Date:</span>
                    {moment(selectedBooking.date).format("dd-mm-yyyy")}
                </p>
                <p>
                    <span >Departure :</span>
                    {selectedBooking.departure}
                </p>
                <hr />
                <p>
                    <span >Seats Number: </span><br />
                    {selectedBooking.seats}
                </p>
                <hr />
                <p>
                    <span >Total Amount</span>
                    {selectedBooking.fare * selectedBooking.seats.length}
                </p>



              </div>
            </Modal>
        )
     }
    </div>
  );
}

export default Bookings;
