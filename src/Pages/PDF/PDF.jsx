import React, { useEffect, useState } from "react";
import "./PDF.css";
import { APIS, headers } from "../../data/header";
import { SpinnerDotted } from "spinners-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
const PDF = () => {
  const [psData, setPsData] = useState([]);

  const [loading, setPsLoading] = useState(true);

  const [uniqueDistrict, setUniqueDistrict] = useState([]);

  const [uniqueAssembly, setUniqueAssembly] = useState([]);

  const [district, setDistrict] = useState("");
  const [assembly, setAssembly] = useState("");

  const [apiFilterData, setApiFilterData] = useState([]);

  const [apiFilterDataLoader, setApiFilterDataLoader] = useState(null);

  useEffect(() => {
    setPsLoading(true);
    APIS.get(
      "own/only/assam/psdata",

      {
        headers: headers,
      }
    )
      .then((res) => {
        setPsLoading(false);
        // console.log(res.data);
        setPsData(res.data);
      })
      .catch((e) => {
        setPsLoading(false);
        console.log(e);
      });
  }, []);

  // after fetching ps date filter unique district

  useEffect(() => {
    const uniqueDis = [...new Set(psData?.map((item) => item.District))];
    setUniqueDistrict(uniqueDis);
  }, [psData]);

  const onSelecteDistrict = (e) => {
    setDistrict(e.target.value);
  };

  useEffect(() => {
    if (district !== "") {
      const filterAssembly = psData.filter(
        (each) => each.District.trim() === district.trim()
      );
      const uniqueAssembly = [
        ...new Set(filterAssembly?.map((item) => item.AC_Name)),
      ];
      setAssembly(uniqueAssembly[0]);
      setUniqueAssembly(uniqueAssembly);
    }
  }, [district]);
  const onSelecteAssembly = (e) => {
    setAssembly(e.target.value);
  };

  // const onFetchAssemblyWiseData = () => {
  //   setApiFilterDataLoader(true);
  //   APIS.get(
  //     `own/fetch/pdf/data/assembly/${assembly}/district/${district}`,

  //     {
  //       headers: headers,
  //     }
  //   )
  //     .then((res) => {
  //       setApiFilterDataLoader(false);
  //       // console.log(res.data);
  //       setApiFilterData(res.data);
  //     })
  //     .catch((e) => {
  //       setApiFilterDataLoader(false);
  //       console.log(e);
  //     });
  // };

  const download = (key) => {
    const capture = document.getElementById(key?.key);
    // console.log(capture);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const doc = new jsPDF("p", "mm", "a4");

      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);

      doc.save(`${key?.name}.pdf`);
    });

    APIS.put(`/user/previwe/${key?.id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => console.log(e));
  };

  const downloadAdhar = (value) => {
    const capture = document.getElementById(value?.id);
    html2canvas(capture, {
      width: capture.offsetWidth,
      height: capture.offsetHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const doc = new jsPDF("p", "mm", "a4");

      // Scale the image to fit the PDF page
      const scale = Math.min(
        doc.internal.pageSize.getWidth() / canvas.width,
        doc.internal.pageSize.getHeight() / canvas.height
      );
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;

      doc.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
      doc.save(`${value?.name}adhaar.pdf`);
      // document.body.removeChild(element);
    });
  };

  return (
    <div className="download--user--pdfs-main--card">
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SpinnerDotted
            size={50}
            thickness={100}
            speed={100}
            color="#36ad47"
          />
        </div>
      ) : (
        <>
          <div className="show--case--user--select--card">
            <select onChange={onSelecteDistrict}>
              <option disabled selected hidden>
                SELECT DISTRICT
              </option>
              {uniqueDistrict.map((each, key) => (
                <option key={key}>{each}</option>
              ))}
            </select>
            <select onChange={onSelecteAssembly}>
              <option disabled selected hidden>
                SELECT ASSEMBLY
              </option>
              {uniqueAssembly.map((each, key) => (
                <option key={key}>{each}</option>
              ))}
            </select>
            <button>
              <Link to="/user/all/assembly/pdf" state={{ assembly, district }}>
                Submit
              </Link>
              {/* {apiFilterDataLoader ? "Loading ..!" : "Submit"} */}
            </button>
          </div>
          {apiFilterDataLoader ? (
            <div
              style={{
                width: "100%",
                height: "70%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SpinnerDotted
                size={50}
                thickness={100}
                speed={100}
                color="#36ad47"
              />
            </div>
          ) : (
            <div className="user--main--padfs--as--super-adamin">
              {apiFilterData?.map((each, key) => (
                <div key={key} className="main-p-f-d">
                  <div id={key} className="pdf_main_page_card">
                    <h1>DECLARATION BY WEB CASTING AGENTS</h1>
                    <h3 style={{ paddingLeft: "6%" }}>
                      I,{" "}
                      <span style={{ fontWeight: "bold" }}>
                        <span>{each?.name}</span>
                      </span>
                      , do hereby make a solemndeclaration, in connection with
                      the General Election to Lok Sabha 2024, Assam, that:
                    </h3>
                    <ol type="A" className="pdf_ol_main_card">
                      <li>
                        I am not a close relative of any of the contesting
                        candidate/leading <br /> political functionary of the
                        state/district in the aforesaid election
                      </li>
                      <li>
                        No criminal case is pending against me in any court of
                        law.
                      </li>
                    </ol>
                    <div className="pdf-main-imge-card">
                      <img src={each?.profilePic} alt="" />
                      <div className="pdf_user_detaiisl_main">
                        <span>
                          Name --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.name}
                          </span>
                        </span>

                        <span>
                          Address --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.address?.slice(0.25)}
                          </span>
                        </span>
                        <span>
                          Village --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.mandal}
                          </span>
                        </span>
                        <span>
                          District --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.district}
                          </span>
                        </span>
                        <span>
                          PIN --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.pinCode}
                          </span>
                        </span>
                        <span>
                          Mobile No --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.phone}
                          </span>
                        </span>
                        <span>
                          Adhaar No --{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {each?.adharnumber}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    id={`${key}_${each?.name}`}
                    // style={{ visibility: "hidden" }}
                    className="pdf-adhrr-card"
                  >
                    <img src={each?.voteridurl} alt="" />
                    <img src={each?.adharidurl} alt="" />
                  </div>
                  <div className="downloadpdf-btn-crad">
                    <button
                      onClick={() =>
                        download({ key, name: each?.name, id: each?._id })
                      }
                    >
                      Download {each?.name} Details PDF{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {each?.downloadPreview} time download
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        downloadAdhar({
                          id: `${key}_${each?.name}`,
                          name: each?.name,
                        })
                      }
                    >
                      Download {each?.name} Adhaar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDF;
