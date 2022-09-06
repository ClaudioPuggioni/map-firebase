import React from "react";
import { useNavigate } from "react-router-dom";

export default function TripCard({ data, uid }) {
  const goTo = useNavigate();
  return (
    <div key={`TripCard${uid}}`} className="px-6 pt-7 pb-16 TripCard relative flex flex-col">
      {/* console.log("PLANNING:", uid, data) */}
      <div className="tripHeader mt-2">
        <div className="tripTitle font-semibold text-lg">{data.tripTitle}</div>
        <div>
          <div className="tripStatus">Status: {data.tripStatus}</div>
          <div className="tripDates self-end">
            {data.tripDates.length === 0
              ? null
              : data.tripDates.length === 1
              ? `Trip Date: ${new Date(data.tripDates[0]).toDateString()}`
              : data.tripDates.map((date, idx) =>
                  idx === 0 ? (
                    <div>{`Trip Start: ${new Date(date).toDateString()}`}</div>
                  ) : (
                    <div key={`TripDate${idx}`}>{`Trip End: ${new Date(date).toDateString()}`}</div>
                  )
                )}
          </div>
        </div>
      </div>
      <div className="tripDescription my-3">Description: {data.tripDescription}</div>

      <div className="tripDestinations">
        {data.tripDestinations.length === 0
          ? null
          : data.tripDestinations.length === 1
          ? `${data.tripDestinations[0]}`
          : data.tripDestinations.map((destination, idx) => (
              <div key={`TripDestination${idx}`} className="locationDiv">
                <div className="underline">{`Location ${idx + 1}:`}</div>
                <div>{`${destination.name}`}</div>
              </div>
            ))}
      </div>
      <button
        className="absolute right-7 bottom-5 bg-amber-400 px-5 py-1 rounded-xl font-medium"
        onClick={() => {
          goTo(`/tripdetails/${uid}`);
          console.log("TRIPID:", uid);
        }}
      >
        Edit
      </button>
    </div>
  );
}
