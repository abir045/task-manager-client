import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import SocialLogin from "./SocialLogin";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const links = (
    <>
      <li>
        <NavLink to={"/"}>Home</NavLink>
      </li>
      {user && user?.email ? (
        <>
          <li>
            <NavLink to={"/viewTasks"}>Tasks</NavLink>
          </li>

          <li>
            <NavLink to={"/addTask"}>Add Task</NavLink>
          </li>
        </>
      ) : (
        ""
      )}
    </>
  );

  return (
    <div>
      <div className="navbar bg-base-200 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Task Manager </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 ml-2">{links}</ul>
        </div>
        <div className="navbar-end">
          {user && user?.email ? (
            <>
              <div className="flex items-center relative ">
                {/* <img
                  className="w-10 rounded-full"
                  src={user?.photoURL}
                  alt=""
                /> */}

                <div className="opacity-100 hover:opacity-100 absolute right-[100%]">
                  <div className="flex  items-center">
                    <p>{user?.displayName}</p>
                    <button
                      className="btn btn-neutral rounded-xl"
                      onClick={logOut}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-1">
              <SocialLogin />
            </div>
          )}
        </div>
      </div>
      ;
    </div>
  );
};

export default Navbar;
