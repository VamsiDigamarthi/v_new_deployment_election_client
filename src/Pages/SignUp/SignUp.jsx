import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { stateWiseData } from "../../data/statedata";
import { ToastContainer } from "react-toastify";
import { APIS, headers } from "../../data/header";
import "react-toastify/dist/ReactToastify.css";

import {
  errorMsgApi,
  pleaseChoosImages,
  registorSucces,
  resizeFile,
  seonOtp,
} from "../../util/showmessages";
import { assemblyList } from "../../data/assembly";
const SignUp = ({ onSwitchRegistor }) => {
  // user store data state
  const [user, setUser] = useState({
    name: "",
    email: "",
    state: "",
    dist: "",
    assembly: "",
    address: "",
    phonepe: "",
    voteridnumber: "",
    adharnumber: "",
    mandal: "",
    password: "",
    phone: "",
    voterIdImage: "",
    adharIdImage: "",
    role: "3",
    banknumber: "",
    IFSC: "",
    bankname: "",
    fatherName: "",
    motherName: "",
    dateOfRegister: "",
    pinCode: "",
    profilePic: "",
  });

  // console.log(user);

  // switch to login form to otp form by using this state
  const [sendOtpUiDesign, setSendOtpUiDesign] = useState(false);

  // this two states are form validations
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [gg, setGg] = useState(false);

  // state change corresponding district names store state
  const [stateWiseDistState, setStateWiseDistState] = useState([]);

  // DISTRICT WISE ASSEMBLIES
  const [filterAssembly, setFilterAssembly] = useState([]);

  // user changes input field that corresponding data store there state function
  const usernameChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // validated all users information before there submitted data
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    const name = /^[a-zA-Z\s]*$/;

    if (!values.name) {
      errors.name = "name is required!";
    } else if (!name.test(values.name)) {
      errors.name = "Name shold containe only charaters";
    }

    if (!values.assembly) {
      errors.assembly = "Assembly is required!";
    }
    if (!values.state) {
      errors.state = "state is required!";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.dist) {
      errors.dist = "District is required!";
    }
    if (!values.mandal) {
      errors.mandal = "Mandal number is required!";
    } else if (!name.test(values.mandal)) {
      errors.mandal = "mandal shold containe only charaters";
    }
    // errors.adharnumber = "adhar number number is required!";
    if (!values.adharnumber) {
      errors.adharnumber = "adhar number number is required!";
    } else if (!/^[0-9]{1,}$/.test(values?.adharnumber)) {
      errors.adharnumber = "adhar number must be numeric characters";
    } else if (values.adharnumber.length !== 12) {
      errors.adharnumber = "adhar number must be 12 digits";
    }

    if (!values.voterIdImage) {
      errors.voterIdImage = "Adhar Card Front side is required!";
    }
    if (!values.adharIdImage) {
      errors.adharIdImage = "Adhar Card Back side is required!";
    }

    if (!values.address) {
      errors.address = "address is required!";
    }
    if (!values.phone) {
      // console.log(values?.phone.length);
      errors.phone = "phone number is required!";
    } else if (!/^[0-9]{1,}$/.test(values?.phone)) {
      errors.phone = "phone number must be numeric characters";
    } else if (values?.phone.length !== 10) {
      errors.phone = "phone number must be 10 characters";
    }
    if (!values.phonepe) {
      errors.phonepe = "phonepe number is required!";
    } else if (!/^[0-9]{1,}$/.test(values.phonepe)) {
      errors.phonepe = "phonepe number must be numeric characters";
    } else if (values.phonepe.length !== 10) {
      errors.phonepe = "phonepe number must be 10 characters";
    }

    if (!values.bankname) {
      errors.bankname = "Bank Name is required!";
    }
    if (!values.banknumber) {
      errors.banknumber = "Bank Number is required!";
    } else if (!/^[0-9]{1,}$/.test(values?.banknumber)) {
      errors.banknumber = "bank number must be numeric characters";
    }
    if (!values.IFSC) {
      errors.IFSC = "IFSC Number is required!";
    }
    // father name

    if (!values.fatherName) {
      errors.fatherName = "Father Name is required";
    } else if (!name.test(values.fatherName)) {
      errors.fatherName = "Father Name shold containe only charaters";
    }

    if (!values.motherName) {
      errors.motherName = "Mother Name is required";
    } else if (!name.test(values.motherName)) {
      errors.motherName = "Mother Name shold containe only charaters";
    }
    if (!values.dateOfRegister) {
      errors.dateOfRegister = "Date Of Registration is required!";
    }

    if (!values.pinCode) {
      errors.pinCode = "PIN Code is required!";
    }

    if (!values.profilePic) {
      errors.profilePic = "Profile is required!";
    }
    return errors;
  };

  // console.log(formErrors);

  // whene user selected state that corresponding district filters
  useEffect(() => {
    if (user.state !== "") {
      const newDist = stateWiseData.filter((each) => each.state === user.state);
      setStateWiseDistState(newDist[0].dist);
      // setFilterAssembly([]);
      setUser({ ...user, dist: newDist[0]?.dist[0]?.name });
    }
  }, [user.state]);

  useEffect(() => {
    if (user.dist !== "") {
      const filterAssembly = assemblyList.filter(
        (each) => each.dist === user.dist
      );
      setFilterAssembly(filterAssembly[0]?.assembly);
      // console.log(filterAssembly[0]?.assembly);
      // setStateWiseDistState(newDist[0].dist);
      setUser({ ...user, assembly: filterAssembly[0]?.assembly[0]?.name });
    }
  }, [user.dist]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && gg) {
      APIS.post(
        "/auth/new-sign",
        { phone: user.phone, name: user.name },
        { headers: headers }
      )
        .then(() => {
          setIsSubmit(false);
          setSendOtpUiDesign(true);
          seonOtp();
        })
        .catch((e) => {
          console.log(e?.response?.data?.msg);
          errorMsgApi(e?.response?.data?.msg);
        });

      // APIS.post("/auth/register", user, { headers: headers })
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((e) => {
      //     console.log(e?.response?.data?.msg);
      //     errorMsgApi(e?.response?.data?.msg);
      //   });
    }
  }, [formErrors]);

  // user validated there form and send otp api call

  const onSubmitRegisterDataFn = (e) => {
    e.preventDefault();
    // console.log(user);
    setFormErrors(validate(user));
    setIsSubmit(true);
    setGg(true);
  };

  // submitted otp from signup user if otp is valid
  const onSubmitOtpFunc = () => {
    APIS.post("/auth/verify-otp", user, { headers: headers })
      .then(() => {
        registorSucces();
        setSendOtpUiDesign(false);
        setUser({
          name: "",
          email: "",
          state: "",
          dist: "",
          assembly: "",
          address: "",
          phonepe: "",
          voteridnumber: "",
          adharnumber: "",
          mandal: "",
          password: "",
          phone: "",
          voterIdImage: "",
          adharIdImage: "",
          banknumber: "",
          IFSC: "",
          bankname: "",
          fatherName: "",
          motherName: "",
          dateOfRegister: "",
          pinCode: "",
          profilePic: "",
        });
        onSwitchRegistor({ phone: user.phone });
      })
      .catch((e) => {
        console.log(e?.response?.data?.msg);
        errorMsgApi(e?.response?.data?.msg);
      });
  };

  // user enter otp in input field
  const onChangeOtpFromInput = (e) => {
    setUser({ ...user, otp: e.target.value });
  };

  // this function takes adhar card front image
  const onFrontAdhrChange = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      setUser({
        ...user,
        voterIdImage: image,
      });
    } catch (err) {
      console.log(err);
      pleaseChoosImages();
      setUser({
        ...user,
        voterIdImage: "",
      });
    }
  };

  // this function take the adhar card back side image
  const onBackAdhrChange = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      setUser({
        ...user,
        adharIdImage: image,
      });
    } catch (err) {
      console.log(err);
      pleaseChoosImages();
      setUser({
        ...user,
        adharIdImage: "",
      });
    }
  };

  // this function take the adhar card back side image
  const onPrfilePic = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      setUser({
        ...user,
        profilePic: image,
      });
    } catch (err) {
      console.log(err);
      pleaseChoosImages();
      setUser({
        ...user,
        profilePic: "",
      });
    }
  };

  // const onChangeDistrictCoor = (e) => {
  //   if (e.target.checked) {
  //     setUser({
  //       ...user,
  //       role: e.target.value,
  //     });
  //   } else {
  //     setUser({
  //       ...user,
  //       role: "3",
  //     });
  //   }
  // };

  // console.log(user);

  return (
    <>
      {sendOtpUiDesign ? (
        <div className="send__otp__main__card">
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
          <h3>Enter Your OTP</h3>

          <input
            type="text"
            maxLength="4"
            placeholder="Please Enter 4 Digit Otp"
            onChange={onChangeOtpFromInput}
          />
          <div onClick={onSubmitOtpFunc} className="otp_submit_btn">
            <button>Submit Otp</button>
          </div>
        </div>
      ) : (
        <div className="signup__tabs__down__ui__card">
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
          {/* user name and email set input field */}
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.name ? formErrors.name : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="name"
                required="required"
                value={user.name}
              />
              <span>Name as Per Adhar Card</span>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.email ? formErrors.email : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="email"
                required="required"
                value={user.email}
              />
              <span>Email</span>
            </div>
          </div>
          {/* state and district set selected field */}
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.state ? formErrors.state : "."}
              </p>
              <select name="state" onChange={usernameChange}>
                <option disabled hidden selected>
                  STATE
                </option>
                {stateWiseData.map((each, key) => (
                  <option value={each.state} key={key}>
                    {each.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.dist ? formErrors.dist : "."}
              </p>
              <select name="dist" onChange={usernameChange}>
                <option disabled hidden selected>
                  DISTRICT
                </option>
                {stateWiseDistState?.map((each, key) => (
                  <option value={each.name} key={key}>
                    {each.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Adhar number and mandal set input field */}

          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.assembly ? formErrors.assembly : "."}
              </p>
              <select name="assembly" onChange={usernameChange}>
                <option disabled hidden selected>
                  ASSEMBLY
                </option>
                {filterAssembly?.map((each, key) => (
                  <option value={each.name} key={key}>
                    {each.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.adharnumber ? formErrors.adharnumber : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="adharnumber"
                required="required"
                value={user.adharnumber}
              />
              <span>Adhar Number</span>
            </div>
          </div>
          {/* phone number and UPI number set Input Field */}
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.phone ? formErrors.phone : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="phone"
                required="required"
                value={user.phone}
              />
              <span>Phone Number</span>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.phonepe ? formErrors.phonepe : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                required="required"
                name="phonepe"
                value={user.phonepe}
              />
              <span>UPI Number</span>
            </div>
          </div>
          {/* ADHAR CARD FRONT AND BACK SIDE IMAGES UPLOADED  */}
          <div className="multi__input__card__file">
            <div className="file__image__preview__card">
              <div className="file__input__box">
                <p
                  style={{
                    visibility: "visible",
                    color: "#f58b76",
                  }}
                >
                  {formErrors.voterIdImage ? formErrors.voterIdImage : "."}
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={onFrontAdhrChange}
                />

                <span>Adhar Id Frontside</span>
              </div>
              <div className="multi__input__card ">
                {user.voterIdImage ? (
                  <img src={user.voterIdImage} alt="" />
                ) : (
                  <img src="" alt="" />
                )}
              </div>
            </div>
            <div className="file__image__preview__card">
              <div className="file__input__box">
                <p
                  style={{
                    visibility: "visible",
                    color: "#f58b76",
                  }}
                >
                  {formErrors.adharIdImage ? formErrors.adharIdImage : "."}
                </p>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={onBackAdhrChange}
                />
                <span>Adhar Id Backside</span>
              </div>
              <div className="multi__input__card ">
                {user.adharIdImage ? (
                  <img src={user.adharIdImage} alt="" />
                ) : (
                  <img src="" alt="" />
                )}
              </div>
            </div>
          </div>
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.mandal ? formErrors.mandal : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                required="required"
                name="mandal"
                value={user.mandal}
              />
              <span>Mandal</span>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.bankname ? formErrors.bankname : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="bankname"
                required="required"
                value={user.bankname}
              />
              <span>Enter Your Bank Name</span>
            </div>
          </div>
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.banknumber ? formErrors.banknumber : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="banknumber"
                required="required"
                value={user.banknumber}
              />
              <span>Enter Your Bank Number</span>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.IFSC ? formErrors.IFSC : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="IFSC"
                required="required"
                value={user.IFSC}
              />
              <span>IFSC Code</span>
            </div>
          </div>
          {/*  father mother names card */}
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.fatherName ? formErrors.fatherName : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="fatherName"
                required="required"
                value={user.fatherName}
              />
              <span>Father Name</span>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.motherName ? formErrors.motherName : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="motherName"
                required="required"
                value={user.motherName}
              />
              <span>Mother Name</span>
            </div>
          </div>
          {/* father mother names card end */}
          {/* date of registrations and pincode card */}
          <div className="multi__input__card">
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.password ? formErrors.password : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                required="required"
                name="password"
                value={user.password}
              />
              <span>Password</span>
            </div>
            <div className="inputBox">
              <p
                style={{
                  visibility: "visible",
                  color: "#f58b76",
                }}
              >
                {formErrors.pinCode ? formErrors.pinCode : "."}
              </p>
              <input
                onChange={usernameChange}
                type="text"
                name="pinCode"
                required="required"
                value={user.pinCode}
              />
              <span>PIN Code</span>
            </div>
          </div>
          {/* date of registrations and pincode end */}
          {/* SET THE ADDRESS  */}
          <div className="multi__input__card__file">
            <div className="file__image__preview__card">
              <div className="file__input__box">
                <p
                  style={{
                    visibility: "visible",
                    color: "#f58b76",
                  }}
                >
                  {formErrors.profilePic ? formErrors.profilePic : "."}
                </p>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={onPrfilePic}
                />
                <span>Profile Pic</span>
              </div>
              <div className="multi__input__card ">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="" />
                ) : (
                  <img src="" alt="" />
                )}
              </div>
            </div>
            <div className="file__image__preview__card">
              <div className="file__input__box">
                <p
                  style={{
                    visibility: "visible",
                    color: "#f58b76",
                  }}
                >
                  {formErrors.dateOfRegister ? formErrors.dateOfRegister : "."}
                </p>
                <input
                  type="date"
                  onChange={usernameChange}
                  name="dateOfRegister"
                  // required="required"
                  value={user.dateOfRegister}
                />

                <span>Date of Registration</span>
              </div>
            </div>
          </div>
          <div className="text__are__card">
            <p
              style={{
                visibility: "visible",
                color: "#f58b76",
              }}
            >
              {formErrors.address ? formErrors.address : "."}
            </p>

            <textarea
              cols="50"
              placeholder="Enter Your Address"
              rows="5"
              required="required"
              onChange={usernameChange}
              name="address"
              value={user.address}
            ></textarea>
          </div>

          {/* Bank Details */}

          {/* <div className="signup__as__dist__coor">
            <input
              id="role"
              value="2"
              onChange={onChangeDistrictCoor}
              type="checkbox"
            />
            <lable htmlFor="role">
              If You are District Coordinator Please Click CheckBox
            </lable>
          </div> */}
          {/* SUBMITED THERE FORM */}
          <button
            style={{
              cursor: "pointer",
            }}
            onClick={onSubmitRegisterDataFn}
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
};

export default SignUp;
