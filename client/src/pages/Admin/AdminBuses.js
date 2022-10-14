import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BusForm from "../../component/BusForm";
import PageTitle from "../../component/PageTitle";
import { axiosInstance } from "../../helpers/axiosinstance";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import 'antd/dist/antd.css';


function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus,setSelectedBus] = useState(null)
// get buses
  const getBuses = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses", {});
      dispatch(hideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
      dispatch(hideLoading())

    } catch (error) {
      dispatch(hideLoading())
      message.error(error.message)
    }
  };

  // delete bus
  const deleteBus = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/buses/delete-bus", {
        _id:id
      });
      dispatch(hideLoading());
      if (response.data.success) {
message.success(response.data.message)
getBuses()
      } else {
        message.error(response.data.message);
      }
      dispatch(hideLoading())

    } catch (error) {
      dispatch(hideLoading())
      message.error(error.message)
    }
  };


  const column=[
    {
      title:"Name",
      dataIndex:"name"
    },
    {
      title:"Number",
      dataIndex:"number"
    }, {
      title:"From",
      dataIndex:"from"
    }, {
      title:"To",
      dataIndex:"to"
    }, {
      title:"Journey Date",
      dataIndex:"journeyDate"
    }, {
      title:"Status",
      dataIndex:"status"
    },
    {
      title:"Actions",
      dataIndex:"action",
      render:(action,record)=>(
        <div className="d-flex gap-3">

          <i className="ri-delete-bin-line" onClick={()=>deleteBus(record._id)}></i>
          <i className="ri-pencil-line" onClick={()=>{
                  console.log(action);
                  setSelectedBus(record)
            setShowBusForm(true)
          }}></i>
        </div>
      )
    }
  ]

  useEffect(() => {
    getBuses();
  }, []);
  return (
    <div>
      <div className ="d-flex justify-content-between">
        <PageTitle title="Buses" />
        <button className="primary-btn" onClick={() => setShowBusForm(true)}>
          Add Bus
        </button>
      </div>
      <Table columns={column} dataSource={buses}/>
      {showBusForm && (
        <BusForm
          showBusForm={showBusForm}
          setShowBusForm={setShowBusForm}
          type={selectedBus ? "edit" : "add"}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedBus}
          getData={getBuses}
        />
      )}
    </div>
  );
}

export default AdminBuses;
