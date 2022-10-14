import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Col, message, Row } from "antd";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Bus from "../component/Bus";
import axios from "axios";

function Home() {
  const { user } = useSelector((state) => state.users);

  const [filter, setFilter] = useState({});
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);

  const getBuses = async () => {
    const tempFilter = {}
    Object.keys(filter).forEach((keys)=>{
      if(filter[keys]){
        tempFilter[keys]=filter[keys]
      }
    })
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/buses/get-all-buses", tempFilter,
   {   headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
     }}
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBuses();
  }, []);
  return (
    <div>
      <div className="my-3 card-sm py-3">
        <Row gutter={10} align="center">
          <Col lg={6} xs={24}>
            <input
              type="text"
              placeholder="From"
              value={filter.from}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
            />
          </Col>
          <Col lg={6} xs={24}>
            <input
              type="text"
              placeholder="To"
              value={filter.to}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
            />
          </Col>{" "}
          <Col lg={6} xs={24}>
            <input
              type="date"
              placeholder="Journey Date"
              value={filter.journeyDate}
              onChange={(e) =>
                setFilter({ ...filter, journeyDate: e.target.value })
              }
            />
          </Col>{" "}
          <Col lg={6} xs={24}>
            <div className="d-flex gap-3">
            <button className="btn btn-primary"
              onClick={() =>getBuses()}
            >Search</button>
            <button className="btn btn-outline-success outline" onClick={()=>setFilter({
              from:"",
              to:"",
              journeyDate:""
            })}>Clear</button>
            </div>
            
           
          </Col>
        </Row>
      </div>
      <div className="mb-2 ">
        <Row gutter={[15, 15]}>
          {buses
            .filter((buse) => buse.status === "Yet To Start")
            .map((bus) => (
              <Col lg={12} xs={24} sm={24}>
                <Bus bus={bus} />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
