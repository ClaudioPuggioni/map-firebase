import React, { useState } from "react";
import { useRef } from "react";

export default function Location({ destination, id, idx, handleDelete, handleUpdate }) {
  const [locationOn, setLocation] = useState(true);
  const areaTxt = useRef(null);

  return (
    <div key={`TripDestination${idx}`} className="locationDiv">
      <div className="underline flex justify-between items-center">
        {`Location ${idx + 1}:`}
        <div className="flex items-center">
          <img
            onClick={() => {
              if (!locationOn) handleUpdate(areaTxt.current.value, idx);
              locationOn ? setLocation(false) : setLocation(true);
            }}
            className="w-6 h-6 ml-1 shadow shadow-[#4367BF] rounded-full cursor-pointer"
            src="../assets/tool.png"
            alt="tool"
          />
          <img
            onClick={() => handleDelete(idx)}
            className="w-6 h-6 ml-1 p-0.5 shadow shadow-[#4367BF] rounded-full bg-rose-400 cursor-pointer"
            src="../assets/bin.png"
            alt="bin"
          />
        </div>
      </div>
      <div style={{ display: locationOn ? "flex" : "none" }}>{`${destination.name}`}</div>
      <textarea
        ref={areaTxt}
        defaultValue={`${destination.name}`}
        style={{ display: locationOn ? "none" : "flex", width: "100%", height: "100px" }}
        rows="4"
        cols="50"
        type="text"
      />
    </div>
  );
}
