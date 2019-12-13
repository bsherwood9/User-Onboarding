import React from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState, useEffect } from "react";

const HForm = ({ values, errors, touched, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    status && setUsers(users => [...users, status]);
  }, [status]);

  function validateEmail(value) {
    let error;
    if (!value) {
      error = "Please add a valid email";
    } else if (value.length > 20 || value.length < 7) {
      error = "Please provide valid email";
    } else if (value === "waffle@syrup.com") {
      error = "This email is already taken";
    }
    return error;
  }

  return (
    <div className="cont">
      <Form className="userForm">
        <label htmlFor="name">Name</label>

        <Field
          name="name"
          type="text"
          value={values.name}
          placeholder="Enter name..."
        />
        {touched.name && errors.name && <p className="error">{errors.name}</p>}

        <label htmlFor="email">Email</label>
        <Field
          name="email"
          type="text"
          value={values.email}
          placeholder="Email"
          validate={validateEmail}
        />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}

        <label htmlFor="password">Password</label>
        <Field
          name="password"
          type="password"
          value={values.password}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}

        <label htmlFor="userType">User</label>
        <Field as="select" name="userType">
          <option disabled>Choose a type of User</option>
          <option value="Admin">Admin</option>
          <option value="Subscriber">Subscriber</option>
          <option value="Free Rider">Free Rider</option>
        </Field>
        <div className="extra">
          <div>
            <label htmlFor="tos">Terms of Services</label>
            <Field type="checkbox" name="tos" checked={values.tos} />
          </div>
          <button type="submit">Submit</button>
        </div>
        <div>
          {" "}
          {touched.tos && errors.tos && <p className="error">{errors.tos}</p>}
        </div>
      </Form>

      {users.map(item => {
        return (
          <>
            <h1>{item.name}</h1>
            <p>{item.email}</p>
            <p>{item.password}</p>
            <p>{item.userType}</p>
            <p>{item.id}</p>
          </>
        );
      })}
    </div>
  );
};
const FormikHForm = withFormik({
  mapPropsToValues(props) {
    return {
      name: props.name || "",
      email: props.email || "",
      password: props.password || "",
      userType: props.userType || "",
      tos: props.tos || false
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(2, "Name is too short")
      .max(15, "Name is too long")
      .required("Required"),
    email: Yup.string(),
    //   .min(7, "Email is too short")
    //   .max(30, "Email is too long")
    //   .required("Required"),
    password: Yup.string()
      .min(6, "Must contain 6 characters.")
      .max(30, "Password is too long")
      .required("Required"),
    userType: Yup.string().required(),
    tos: Yup.boolean()
      .oneOf([true], "Must accept terms and conditions")
      .required()
  }),
  handleSubmit(values, { resetForm, setStatus }) {
    console.log("submitting!", values);
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log("Success", res.data);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err));
  }
})(HForm);
export default FormikHForm;
