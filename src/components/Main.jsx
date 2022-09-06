import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import AddTrip from "./AddTrip";
import Login from "./Login";
import Profile from "./Profile";
import SignUp from "./SignUp";
import TripDetails from "./TripDetails";
import Trips from "./Trips";
import UserInterface from "./UserInterface";

export default function Main() {
  const cabinet = useSelector((state) => state.storedData);
  const goTo = useNavigate();

  useEffect(() => {
    !cabinet.lgn ? goTo("/login") : goTo("/");
    // eslint-disable-next-line
  }, [cabinet.lgn]);

  return (
    <div id="mainContainer" className="h-full w-full">
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/"} element={<UserInterface />}>
          <Route index element={<Trips />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/tripdetails/:id"} element={<TripDetails />} />
          <Route path={"/addtrip"} element={<AddTrip />} />
        </Route>
      </Routes>
    </div>
  );
}
