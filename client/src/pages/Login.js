import React from "react";
import { Form,message} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading } from "../redux/alertsSlice";
import '../resources/auth.css'

function Login() {
  const dispatch = useDispatch()
  const onFinish = async (value) => {
    try {
      dispatch(hideLoading())
      const response = await axios.post("api/users/login",value);
      dispatch(hideLoading())

      if (response.data.success) {
        console.log(response.data);
        message.success(response.data.message)
        localStorage.setItem("token",response.data.data)
        window.location.href="/"
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())

      message.error(error.message);
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-center text-2xl">Login Form</h1>
        <hr />

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <input type="text" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-item-center mt-3">
            <Link to="/register">Click Here To Register</Link>
            <button type="submit" className="secondary-btn">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
