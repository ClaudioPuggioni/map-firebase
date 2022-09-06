import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateTrip } from "../features/dataSlice";
import Location from "./Location";

export default function TripDetails() {
  const goTo = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { planning, completed, cancelled, loading } = useSelector((state) => state.storedData);
  let data = useRef(
    planning[id]
      ? JSON.parse(JSON.stringify(planning[id].data))
      : completed[id]
      ? JSON.parse(JSON.stringify(completed[id].data))
      : cancelled[id]
      ? JSON.parse(JSON.stringify(cancelled[id].data))
      : null
  );

  const [titleOn, setTitleOn] = useState(true);
  const [title, setTitle] = useState(data.current.tripTitle);
  const [descriptionOn, setDescriptionOn] = useState(true);
  const [description, setDescription] = useState(data.current.tripDescription);
  const descriptionRef = useRef(null);
  const [statusOn, setStatusOn] = useState(true);
  const [status, setStatus] = useState(data.current.tripStatus);
  const [startOn, setStartOn] = useState(true);
  const startRef = useRef(null);
  const [endOn, setEndOn] = useState(true);
  const endRef = useRef(null);
  const [destinations, setDestinations] = useState(data.current.tripDestinations);

  function handleSave() {
    dispatch(updateTrip({ tripId: id, tripData: data.current }));
    console.log("DATA.CURRENT:", data.current);
    setTimeout(() => {
      goTo("/");
    }, 2000);
  }

  const handleAddLoc = () => {
    let destinationsCopy = [...destinations, { name: "Enter address here" }];
    data.current.tripDestinations = destinationsCopy;
    setDestinations(destinationsCopy);
  };

  const handleDeleteLoc = (idx) => {
    let destinationsCopy = [...destinations];
    destinationsCopy.splice(idx, 1);
    data.current.tripDestinations = destinationsCopy;
    setDestinations(destinationsCopy);
  };

  const handleUpdateLoc = (newData, idx) => {
    destinations[idx].name = newData;
    delete destinations[idx].longitude;
    delete destinations[idx].latitude;
    data.current.tripDestinations = destinations;
  };

  return (
    <div key={`TripDetails-${id}`} className="mt-12 px-6 pt-7 pb-16 w-10/12 TripCard relative flex flex-col">
      <div className="tripHeader">
        <div className="tripTitleDiv font-semibold text-lg flex items-center">
          <div className="tripTitle" style={{ display: titleOn ? "flex" : "none" }}>
            {title}
          </div>
          <input
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                data.current.tripTitle = title;
                titleOn ? setTitleOn(false) : setTitleOn(true);
              }
            }}
            defaultValue={title}
            type="text"
            style={{ display: titleOn ? "none" : "flex", textTransform: "capitalize" }}
          />
          <img
            onClick={() => {
              if (!titleOn) data.current.tripTitle = title;
              titleOn ? setTitleOn(false) : setTitleOn(true);
            }}
            className="w-6 h-6 ml-3 shadow shadow-[#CCB89C] rounded-full cursor-pointer"
            src="../assets/tool.png"
            alt="tool"
          />
        </div>

        <div>
          <div className="tripStatusDiv flex items-center">
            <div className="tripStatus" style={{ display: statusOn ? "flex" : "none" }}>
              <div className="font-medium">Status:</div>
              <div className="ml-1">{status}</div>
            </div>
            <select
              name="statusSelect"
              id="statusSelect"
              defaultValue={status}
              style={{ display: statusOn ? "none" : "flex" }}
              onChange={(e) => {
                data.current.tripStatus = e.target.value;
                setStatus(e.target.value);
              }}
            >
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <img
              onClick={() => {
                statusOn ? setStatusOn(false) : setStatusOn(true);
              }}
              className="w-6 h-6 ml-3 shadow shadow-[#CCB89C] rounded-full cursor-pointer"
              src="../assets/tool.png"
              alt="tool"
            />
          </div>
          <div className="tripDates self-end">
            {data.current.tripDates.length === 0 ? null : data.current.tripDates.length === 1 ? (
              <>
                <div className="startDate flex">
                  <div className="mr-1 font-medium">Trip Date: </div>
                  <div>{new Date(data.current.tripDates[0]).toDateString()}</div>
                </div>
                <img
                  onClick={() => (startOn ? setStartOn(false) : setStartOn(true))}
                  className="w-6 h-6 ml-3 shadow shadow-[#CCB89C] rounded-full cursor-pointer"
                  src="../assets/tool.png"
                  alt="tool"
                />
              </>
            ) : (
              data.current.tripDates.map((date, idx) =>
                idx === 0 ? (
                  <div className="flex items-center">
                    <div className="startDate flex">
                      <div className="mr-1 font-medium">Trip Start:</div>
                      <div ref={startRef} style={{ display: startOn ? "flex" : "none" }}>
                        {new Date(date).toDateString()}
                      </div>
                    </div>
                    <input
                      onChange={(e) => {
                        data.current.tripDates[0] = new Date(e.target.value + "T00:00-0800").toString();
                        startRef.current.innerText = new Date(e.target.value + "T00:00-0800").toDateString();
                      }}
                      style={{ display: startOn ? "none" : "flex" }}
                      className="pl-5"
                      type="date"
                      defaultValue={new Date(date).toISOString().substring(0, 10)}
                    />
                    <img
                      onClick={() => {
                        startOn ? setStartOn(false) : setStartOn(true);
                      }}
                      className="w-6 h-6 ml-3 shadow shadow-[#CCB89C] rounded-full cursor-pointer"
                      src="../assets/tool.png"
                      alt="tool"
                    />
                  </div>
                ) : (
                  <div key={`TripDate${idx}`} className="flex items-center">
                    <div className="endDate flex">
                      <div className="mr-1 font-medium">Trip End: </div>
                      <div ref={endRef} style={{ display: endOn ? "flex" : "none" }}>
                        {new Date(date).toDateString()}
                      </div>
                    </div>
                    <input
                      onChange={(e) => {
                        data.current.tripDates[1] = new Date(e.target.value + "T00:00-0800").toString();
                        endRef.current.innerText = new Date(e.target.value + "T00:00-0800").toDateString();
                      }}
                      style={{ display: endOn ? "none" : "flex" }}
                      className="pl-5"
                      type="date"
                      defaultValue={new Date(date).toISOString().substring(0, 10)}
                    />
                    <img
                      onClick={() => (endOn ? setEndOn(false) : setEndOn(true))}
                      className="w-6 h-6 ml-3 shadow shadow-[#CCB89C] rounded-full cursor-pointer"
                      src="../assets/tool.png"
                      alt="tool"
                    />
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
      <div className="tripDescription my-5 flex items-center">
        <div className="description" style={{ width: "100%" }}>
          <div className="flex items-center  font-medium">
            Description:
            <img
              onClick={() => {
                if (!descriptionOn) {
                  data.current.tripDescription = descriptionRef.current.value;
                  setDescription(descriptionRef.current.value);
                }
                descriptionOn ? setDescriptionOn(false) : setDescriptionOn(true);
              }}
              className="w-6 h-6 ml-3 shadow shadow-[#CCB89C] rounded-full cursor-pointer"
              src="../assets/tool.png"
              alt="tool"
            />
          </div>
          <div style={{ display: descriptionOn ? "flex" : "none" }}>{description}</div>
          <textarea
            ref={descriptionRef}
            id="descriptionArea"
            defaultValue={data.current.tripDescription}
            style={{ display: descriptionOn ? "none" : "flex", width: "100%" }}
          ></textarea>
        </div>
      </div>

      <div className="tripDestinations">
        {destinations.length === 0
          ? null
          : destinations.map((destination, idx) => (
              <Location
                key={`Location${idx}`}
                destination={destination}
                id={id}
                idx={idx}
                handleDelete={handleDeleteLoc}
                handleUpdate={handleUpdateLoc}
              />
            ))}
        <div
          onClick={() => handleAddLoc()}
          className="w-12 bg-[#A9CDFF] hover:bg-[#769af2] flex justify-center items-center text-3xl text-slate-100 cursor-pointer"
          style={{ borderRadius: "3px" }}
        >
          +
        </div>
      </div>

      <button onClick={() => handleSave()} className="absolute right-7 bottom-5 bg-amber-400 px-5 py-1 rounded-xl font-medium flex items-center">
        SAVE
        {loading ? <img className="ml-1" src="../assets/loading.gif" alt="loading" style={{ width: "22px" }} /> : null}
      </button>
    </div>
  );
}
