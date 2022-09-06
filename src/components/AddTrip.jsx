import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { sendData } from "../features/dataSlice";

export default function AddTrip() {
  const dispatch = useDispatch();
  const cabinet = useSelector((state) => state.storedData);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const mapContainer = useRef(null);
  const geocoder = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.90991266866176);
  const [lat, setLat] = useState(41.228287642520115);
  const [zoom, setZoom] = useState(13);
  const [destinations, setDestinations] = useState([]);
  const [location, setLocation] = useState(null);
  // const [companions, setCompanions] = useState([]);
  mapboxgl.accessToken = "pk.eyJ1IjoiYXJuYXZwdXJpIiwiYSI6ImNrZHNhb3ppYTBkNDYyeHFza3diMXZtdnkifQ.fCuBiUZ9JjgUbBlaBDvPrw";

  useEffect(() => {
    function getCoords() {
      return new Promise((resolved, rejected) => {
        navigator.geolocation.getCurrentPosition(resolved, rejected);
      });
    }
    async function getGeo() {
      let position = await getCoords().catch((error) => console.log(error));
      console.log("success", position.coords.longitude, position.coords.latitude);
      setLng(position.coords.longitude);
      setLat(position.coords.latitude);
      setZoom(17);
      if (map.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 17,
      });
      geocoder.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: {
          color: "orange",
          // draggable: true,
        },
        mapboxgl: mapboxgl,
      });
      geocoder.current.on("result", (result) => {
        const resultObj = { ...result }.result;
        console.log("result is", resultObj);
        setLocation({
          name: resultObj["place_name_en-US"],
          longitude: resultObj.geometry.coordinates[0],
          latitude: resultObj.geometry.coordinates[1],
        });
      });
      // geocoder.current.mapMarker.on("dragend", (e) => {
      //   console.log("dragged result", e);
      // });
      map.current.addControl(geocoder.current);
      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    }
    getGeo();
  }, []);

  useEffect(() => {
    console.log("location is", location);
  }, [location]);

  useEffect(() => {
    console.log("Destinations:", destinations);
  }, [destinations]);

  return (
    <div id="addTripContainer" className="w-4/5 h-full">
      <div id="addTripHeader">AddTrip</div>
      <div id="addTripBody">
        <Formik
          initialValues={{
            tripTitle: "",
            tripDescription: "",
            tripStatus: "",
            tripDates: "",
            tripDestinations: [],
            // tripCompanions: [],
          }}
          validationSchema={Yup.object({
            tripTitle: Yup.string().min(3, "Must be at least 3 characters").max(50, "Must be 50 characters or less").required("Title is required"),
            tripDescription: Yup.string()
              .min(3, "Must be at least 3 characters")
              .max(500, "Must be 500 characters or less")
              .required("Short description required"),
            tripStatus: Yup.string().required("Status is required"),
            tripDates: Yup.array(), //.min(new Date().toISOString().slice(0, 16), "Cannot plan for the past."),
            tripDestinations: Yup.array(),
            // tripCompanions: Yup.array(),
          })}
          onSubmit={(values) => {
            console.log("values:", values);
            dispatch(sendData(values));
          }}
        >
          {({ isSubmitting, setFieldValue, handleChange, handleBlur }) => {
            return (
              <Form>
                <div className="form-sector">
                  <label>Trip Title</label>
                  <Field type="text" name="tripTitle" placeholder="Trip title" className="inputField" />
                  <ErrorMessage className="errorMsg" name="tripTitle" component="div" />
                </div>
                <div className="form-sector descriptionField">
                  <label>Trip Description</label>
                  <Field type="text" name="tripDescription" placeholder="Trip description" className="inputField">
                    {() => <textarea className="h-20" onChange={(e) => setFieldValue("tripDescription", e.target.value)} />}
                  </Field>
                  <ErrorMessage className="errorMsg" name="tripDescription" component="div" />
                </div>
                <div className="form-sector">
                  <label>Trip Status</label>
                  {/* <Field type="text" name="tripStatus" placeholder="Trip status" className="inputField" /> */}
                  <select name="tripStatus" onChange={handleChange} onBlur={handleBlur}>
                    <option value="" label="Select status">
                      Select status
                    </option>
                    <option value="Planning" label="Planning">
                      Planning
                    </option>
                    <option value="Completed" label="Completed">
                      Completed
                    </option>
                    <option value="Cancelled" label="Cancelled">
                      Cancelled
                    </option>
                  </select>
                  <ErrorMessage className="errorMsg" name="tripStatus" component="div" />
                </div>
                <div className="form-sector">
                  <label>Trip Dates</label>
                  <Field type="text" name="tripDates" className="inputField">
                    {() => (
                      <DatePicker
                        className="dateField"
                        name="tripDates"
                        selectsRange={true}
                        minDate={new Date()}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                          setDateRange(update);
                          console.log("update:", update[0]);
                          const from = update[0].toString();
                          const to = update[1].toString();
                          !to ? setFieldValue("tripDates", [from]) : setFieldValue("tripDates", [from, to]);
                        }}
                        isClearable={true}
                        withPortal
                      />
                    )}
                  </Field>
                  <ErrorMessage className="errorMsg" name="tripDates" component="div" />
                </div>
                <div id="mapDiv">
                  <div ref={geocoder} className="geocoder-container"></div>
                  <div ref={mapContainer} className="map-container h-80"></div>
                  <div id="mapDivFooter" className="flex justify-between items-center">
                    <button
                      type="button"
                      id="addLocation"
                      className="shadow bg-white rounded px-2 py-1.5 text-sm bg-[#393a4a] text-white"
                      onClick={(e) => {
                        if (location && destinations.every((ele) => ele.name !== location.name))
                          setDestinations((destinations) => [...destinations, location]);
                      }}
                    >
                      Add Location
                    </button>
                    <div id="sidebar">
                      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                    </div>
                  </div>
                </div>
                <div id="destinationsDiv" className="flex flex-col">
                  {destinations.length > 0
                    ? destinations.map((ele, idx) => (
                        <div key={`destDiv${idx}`} className="destination flex items-center">
                          {ele.name}
                          <button
                            key={`destBtn${idx}`}
                            className="delBtn ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDestinations((destinations) => destinations.filter((obj) => obj.name !== ele.name));
                            }}
                          ></button>
                        </div>
                      ))
                    : null}
                </div>
                {/* <div className="form-sector">
                  <label>Add Trip Buddy</label>
                  <select name="tripCompanions" onChange={handleChange} onBlur={handleBlur}>
                    <option value="" label="None">
                      None
                    </option>
                    {companions.length === 0
                      ? null
                      : companions.map((ele, idx) => (
                          <option key={`companion${idx}`} value={ele.value} label={ele.label}>
                            {ele.value}
                          </option>
                        ))}
                  </select>
                  <ErrorMessage className="errorMsg" name="tripCompanions" component="div" />
                </div> */}
                <div id="formFooter" className="flex justify-center">
                  <button
                    id="submitButton"
                    className="shadow bg-white rounded px-4 py-1.5 mt-1 text-sm bg-[#393a4a] text-white"
                    type="submit"
                    disabled={cabinet.loading}
                    onClick={() => {
                      console.log("clicked submit");
                      setFieldValue("tripDestinations", destinations);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
