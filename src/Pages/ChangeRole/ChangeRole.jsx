import React, { useState } from "react";
import "./ChangeRole.css";
import { APIS, headers } from "../../data/header";
import { ToastContainer } from "react-toastify";
import {
  allpsAddedtoUser,
  taskAddedAlredyRegis,
} from "../../util/showmessages";
const ChangeRole = () => {
  const [phone, setPhone] = useState("");

  const [role, setRole] = useState("");

  const [errors, setErrors] = useState({});

  const validator = (user) => {
    let errors = {};
    if (!user.phone) {
      // console.log(values?.phone.length);
      errors.phone = "phone number is required!";
    } else if (!/^[0-9]{1,}$/.test(user?.phone)) {
      errors.phone = "phone number must be numeric characters";
    } else if (user?.phone.length !== 10) {
      errors.phone = "phone number must be 10 characters";
    }
    //   role
    if (!user.role) {
      errors.role = "Role is Required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChangeRoleFun = () => {
    if (validator({ phone, role })) {
      setErrors({});
      APIS.put(
        `/own/change/role/phone/${phone}`,
        { role },
        { headers: headers }
      )
        .then((res) => {
          //   console.log(res.data);
          setPhone("");
          setRole("");
          allpsAddedtoUser(res.data?.msg);
        })
        .catch((e) => {
          //   console.log(e?.response?.data?.msg);
          taskAddedAlredyRegis(e?.response?.data?.msg);
        });
    }
  };

  return (
    <div className="change-role-main">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="change-role">
        {errors.phone && (
          <span
            style={{
              color: "red",
            }}
          >
            {errors.phone}
          </span>
        )}
        <input
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          value={phone}
          placeholder="Enter Mobile Number"
        />
        {errors.role && (
          <span
            style={{
              color: "red",
            }}
          >
            {errors.role}
          </span>
        )}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option disabled hidden selected>
            STATE
          </option>
          <option value="1">State Coordinator</option>
          <option value="2">District Coordinator</option>
          <option value="5">Assembly Coordinator</option>
        </select>
        <button onClick={onChangeRoleFun}>Updated</button>
      </div>
    </div>
  );
};

export default ChangeRole;
