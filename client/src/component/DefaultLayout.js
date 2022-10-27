import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../resources/layout.css";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const {user} = useSelector(state=>state.users)
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icons: "ri-home-line",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icons: "ri-file-list-fill",
    },
    {
      name: "Profile",
      path: "/profile",
      icons: "ri-user-fill",
    },
  
    {
      name: "Logout",
      path: "/logout",
      icons: "ri-logout-box-line",
    }
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icons: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icons: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icons: "ri-user-fill",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icons: "ri-file-list-fill",
    },
    {
      name: "Logout",
      path: "/logout",
      icons: "ri-logout-box-line",
    },
  ];
  const menuTobeRendered = user?.isAdmin ? adminMenu :userMenu
  let activeRoute = window.location.pathname;
  if(window.location.pathname.includes('book-now')){
    activeRoute="/"
  }
  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">SB</h1>
          <h1 className="role">{user?.name} <br /> Role : {user?.isAdmin ? "Admin" : "User"}</h1>
        </div>
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuTobeRendered.map((item, index) => {
            return (
              <div
                className={`${
                  activeRoute === item.path && `active-menu-item`
                } menu-item`}
              >
                <i className={item.icons}></i>
               {!collapsed &&  <span
                  onClick={() => {
                    if(item.path==="/logout"){
                      localStorage.removeItem("token")
                      navigate("/login")
                    }
                    else{
                      navigate(item.path);

                    }
                  }}
                >
                  {item.name}
                </span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="header">
          {collapsed ? (
            <i className="ri-menu-2-fill" onClick={()=>setCollapsed(!collapsed)}></i>
          ) : (
            <i className="ri-close-line" onClick={()=>setCollapsed(!collapsed)}></i>
          )}
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
