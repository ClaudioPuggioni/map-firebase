import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/dataSlice";

export default function Login(props) {
  const dispatch = useDispatch();
  return (
    <div id="loginContainer" className="flex flex-col justify-center items-center h-full w-full">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().min(3, "Must be at least 3 characters").max(15, "Must be 15 characters or less").required("Required"),
          email: Yup.string().email("Invalid email address").required("Required"),
          password: Yup.string().min(8, "Must be at least 8 characters").max(15, "Must be 15 characters or less").required("Required"),
        })}
        onSubmit={(values) => {
          dispatch(login(values));
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center items-center gap-5 border-solid border-2 w-300 p-5 rounded-md bg-slate-600">
            <div id="loginHeader" className="text-lg font-bold drop-shadow-lg">
              Login
            </div>
            <div className="form-sector w-11/12 relative drop-shadow-md">
              <label>Username</label>
              <Field type="username" name="username" placeholder="username" className="inputField pl-1" />
              <ErrorMessage className="errorMsg absolute -bottom-5 text-rose-700 font-semibold" name="username" component="div" />
            </div>
            <div className="form-sector w-11/12 relative drop-shadow-md">
              <label>Email</label>
              <Field type="email" name="email" placeholder="email@domain.com" className="inputField pl-1" />
              <ErrorMessage className="errorMsg absolute -bottom-5 text-rose-700 font-semibold" name="email" component="div" />
            </div>
            <div className="form-sector w-11/12 relative drop-shadow-md">
              <label>Password</label>
              <Field type="password" name="password" placeholder="password" className="inputField pl-1" />
              <ErrorMessage className="errorMsg absolute -bottom-5 text-rose-700 font-semibold" name="password" component="div" />
            </div>
            <button id="submitButton" className="mt-3  mb-1 px-2 py-0.1 bg-slate-100 border-2 rounded-sm" type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <Link to={"/signup"}>
        <div id="redirectSignUp" className="mt-1">
          New to FireTrips? Signup here!
        </div>
      </Link>
    </div>
  );
}
