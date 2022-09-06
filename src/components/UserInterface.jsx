import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { logout } from "../features/dataSlice";

export default function UserInterface() {
  const dispatch = useDispatch();
  let cabinet = useSelector((state) => state.storedData);
  return (
    <div id="uiContainer" className="bg-red-500 h-screen w-screen">
      <div id="uiHeader" className="bg-blue-200 h-20 px-10 w-screen flex justify-between items-center">
        <Link to={"/"}>
          <div id="webTitle" className="text-4xl font-black">
            Fire Trips &#127966;
          </div>
        </Link>
        <div id="account" className="flex items-center">
          <div id="user" className="mr-5 font-normal text-2xl">
            {cabinet.username}
          </div>
          <button id="logout" className="bg-white rounded px-3 py-1 text-sm shadow" onClick={() => dispatch(logout())}>
            Log Out
          </button>
        </div>
      </div>
      <div id="outletContainer" className="bg-red-500 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}
