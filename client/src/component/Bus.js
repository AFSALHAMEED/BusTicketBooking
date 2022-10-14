import React from "react";
import {useNavigate} from 'react-router-dom';

function Bus({ bus }) {
    const navigate= useNavigate()
  return (
    <div className="card p-2">
      <h3 className="text-lg text-primary"> <b>{bus.name}</b></h3>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
            <p className="text-sm">From</p>
            <p className="text-sm">{bus.from}</p>

        </div>
        <div>
            <p className="text-sm">To</p>
            <p className="text-sm">{bus.to}</p>

        </div>
        <div>
            <p className="text-sm">Fare</p>
            <p className="text-sm">$ {bus.fare} /-</p>

        </div>
       
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-end">
        <div>
            <p className="text-sm">Journey Date</p>
            <p className="text-sm">{bus.journeyDate}</p>

        </div>
        <h5 className="text-lg text-success" onClick={()=>{
            navigate(`/book-now/${bus._id}`)
        }}>Book Now</h5>

        </div>
    </div>
  );
}

export default Bus;
