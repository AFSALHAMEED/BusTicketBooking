import React from "react";
import { Form, message } from "antd";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { hideLoading } from "../redux/alertsSlice";
import '../resources/auth.css'


function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

const onFinish = async(value)=>{
  try {
    const response = await axios.post("api/users/register",value)
    dispatch(hideLoading())

    if(response.data.success){
      console.log(response.data);
      message.success(response.data.message)
      navigate("/login")
    }
    else{
      message.error(response.data.message)
    }
  } catch (error) {
    dispatch(hideLoading())

    message.error(error.message)
  }
}

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-center text-2xl">Register Form</h1>
        <hr />

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="name" name="name">
            <input type="text" />
          </Form.Item>
          <Form.Item label="email" name="email">
            <input type="text" />
          </Form.Item>
          <Form.Item label="password" name="password">
            <input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-item-center mt-3">
          <Link to="/login">Click Here To login</Link>
          <button type="submit" className="secondary-btn">Register</button>
        </div>
        </Form>
       
      </div>
    </div>
  );
}

export default Register;
