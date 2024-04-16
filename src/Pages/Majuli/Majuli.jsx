import React, { useEffect, useState } from "react";
import "./Majuli.css";
import { APIS } from "../../data/header";
const Majuli = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    APIS.get("/own/donload/majuli")
      .then((res) => setData(res.data))
      .catch((e) => console.log(e));
  }, []);

  const printerDownload = () => {
    window.print();
  };
  return (
    <div className="main-majuli">
      <div>
        <button onClick={printerDownload}>Download</button>
      </div>
      <div className="second-majuli-card">
        {data.map((each, key) => (
          <div key={key} className="single-majuli-card">
            <img src={each.profilePic} alt="" />
            <h3>{each.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Majuli;
