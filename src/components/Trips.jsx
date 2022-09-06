import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getData, toggleWin } from "../features/dataSlice";
import TripCard from "./TripCard";

export default function Trips() {
  const { planning, completed, cancelled, planningOpen, completedOpen, cancelledOpen } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    console.log("LOCATION.KEY:", location.key);
    dispatch(getData());
  }, [location.key]);
  // }, []);

  return (
    <div id="tripsContainer" className="relative w-4/5 h-full flex flex-col gap-5">
      <div id="tripsHeader" className="mt-10 text-3xl font-bold flex items-center">
        Trips
        <Link to={"/addtrip"}>
          <button id="planTrip" className="ml-5 shadow-lg shadow-red-600 bg-white rounded px-2 py-1 text-sm">
            Plan trip &#10148;
          </button>
        </Link>
      </div>

      <div id="tripsPlanning">
        <div
          id="planningHeader"
          className="mb-2 w-40 px-2 py-1.5 text-l font-semibold cursor-pointer text-xl rounded-md bg-lime-500 shadow-sm shadow-red-600 flex justify-center items-center"
          onClick={() => dispatch(toggleWin("planning"))}
        >
          Upcoming Trips
        </div>
        <div id="planningBody" className="gap-5 flex flex-col overflow-auto rounded-l" style={{ display: planningOpen ? "flex" : "none" }}>
          {Object.keys(planning).length > 0
            ? Object.values(planning).map(({ data, uid }, idx) => <TripCard key={`Planned${idx}`} data={data} uid={uid} />)
            : null}
        </div>
      </div>
      <div id="tripsCompleted">
        <div
          id="completedHeader"
          className="mb-2 w-44 px-2 py-1.5 text-l font-semibold cursor-pointer text-xl rounded-md bg-lime-500 shadow-sm shadow-red-600 flex justify-center items-center"
          onClick={() => dispatch(toggleWin("completed"))}
        >
          Completed Trips
        </div>
        <div id="completedBody" className="gap-5 flex flex-col overflow-auto rounded-l" style={{ display: completedOpen ? "flex" : "none" }}>
          {Object.keys(completed).length > 0
            ? Object.values(completed).map(({ data, uid }, idx) => <TripCard key={`Completed${idx}`} data={data} uid={uid} />)
            : null}
        </div>
      </div>
      <div id="tripsCancelled" className="mb-10">
        <div
          id="cancelledHeader"
          className="mb-2 w-40 px-2 py-1.5 text-l font-semibold cursor-pointer text-xl rounded-md bg-lime-500 shadow-sm shadow-red-600 flex justify-center items-center"
          onClick={() => dispatch(toggleWin("cancelled"))}
        >
          Cancelled Trips
        </div>
        <div id="cancelledBody" className="gap-5 flex flex-col overflow-auto rounded-l" style={{ display: cancelledOpen ? "flex" : "none" }}>
          {Object.keys(cancelled).length > 0
            ? Object.values(cancelled).map(({ data, uid }, idx) => <TripCard key={`Cancelled${idx}`} data={data} uid={uid} />)
            : null}
        </div>
      </div>
    </div>
  );
}
