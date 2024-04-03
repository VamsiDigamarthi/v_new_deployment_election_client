import React from "react";
import "./PDF.css";
const PDF = ({ record }) => {
  return (
    <div className="pdf-main-mian">
      <div className="pdf-main-body">
        <h1>DECLARATION BY WEB CASTING AGENTS</h1>
        <h3 style={{ textAlign: "center" }}>
          I, {record?.name}, S/o / D/o {record?.fatherName} do hereby make a
          solemn
          <br /> declaration, in connection with the General Election to Lok
          Sabha 2024, Assam, that:
        </h3>
        <ol type="A" className="pdf-ul">
          <li>
            I am not a close relative of any of the contesting candidate/leading{" "}
            <br /> political functionary of the state/district in the aforesaid
            election.
          </li>
          <li>No criminal case is pending against me in any court of law.</li>
        </ol>
        <div className="pdf-img-names-card">
          <img src={record?.profilePic} alt="" />
          <div>
            <span>Signature With Date .............................</span>
            <span>Name -- {record?.name}</span>
            <span>Father's Name -- {record?.fatherName}</span>
            <span>Mother's Name -- {record?.motherName}</span>
            <span>Address -- {record?.address}</span>
            <span>Village -- {record?.mandal}</span>
            <span>District -- {record?.district}</span>
            <span>PIN -- {record?.pinCode}</span>
            <span>Mobile No -- {record?.phone}</span>
            <span>Adhaar No -- {record?.adharnumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDF;
