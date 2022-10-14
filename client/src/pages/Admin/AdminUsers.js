import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../../component/PageTitle";
import { axiosInstance } from "../../helpers/axiosinstance";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import "antd/dist/antd.css";

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/users/get-all-users", {});
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data);
        setUsers(response.data.data);
        message.success(response.data.message);
      } else {
        dispatch(hideLoading());
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const updateUserPermission = async (user, action) => {
    console.log(user);
    console.log(action);
    let payload = null;
    if (action === "make-admin") {
      payload = {
        ...user,
        isAdmin: true,
      };
    } else if (action === "remove-admin") {
      payload = {
        ...user,
        isAdmin: false,
      };
    } else if (action === "unblock") {
      payload = {
        ...user,
        isBlocked: false,
      };
    } else if (action === "block") {
      payload = {
        ...user,
        isBlocked: true,
      };
    }
    const response = await axiosInstance.post("/api/users/update-user", 
      payload,
    );
    try {
      dispatch(showLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getUsers();
      } else {
        dispatch(hideLoading());
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const column = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "",
      render: (data) => {
        return data?.isBlocked ? "Blocked" : "Active";
      },
    },
    {
      title: "Role",
      dataIndex: "",
      render: (data) => {
        // console.log(data);
        if (data?.isAdmin) {
          return "Admin";
        } else {
          return "User";
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          {record?.isBlocked && (
            <p
              className="underline"
              onClick={() => updateUserPermission(record, "unblock")}
            >
              UnBlock
            </p>
          )}
          {!record?.isBlocked && (
            <p
              className="underline"
              onClick={() => updateUserPermission(record, "block")}
            >
              Block
            </p>
          )}
          {record?.isAdmin && (
            <p
              className="underline"
              onClick={() => updateUserPermission(record, "remove-admin")}
            >
              Remove Admin
            </p>
          )}
          {!record?.isAdmin && (
            <p
              className="underline"
              onClick={() => updateUserPermission(record, "make-admin")}
            >
              Make Admin
            </p>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="Users" />
      </div>
      <Table columns={column} dataSource={users} />
    </div>
  );
}

export default AdminUsers;
