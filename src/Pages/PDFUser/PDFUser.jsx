import { APIS, headers } from "../../data/header";
import { ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./PDFUser.css";
import { useSelector } from "react-redux";
const PDFUser = () => {
  const UUU = useSelector((state) => state.authReducer.authData);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    APIS.get(
      `/user/all/user/pdf/file/state/${UUU?.state}/district/${UUU?.district}/assembly/${UUU?.assembly}`,
      {
        headers: headers,
      }
    )
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const downloadPdf = () => {
    user.forEach((record, index) => {
      let element = document.createElement("div");
      element.classList.add("pdf-main-mian");

      let firstMainDiv = document.createElement("div");
      firstMainDiv.classList.add("pdf-main-body");

      let mainHeading = document.createElement("h1");
      mainHeading.textContent = "DECLARATION BY WEB CASTING AGENTS";
      firstMainDiv.appendChild(mainHeading);

      let headingCard = document.createElement("div");
      headingCard.classList.add("main-heading-card");
      firstMainDiv.appendChild(headingCard);

      let secondHeading = document.createElement("h3");
      secondHeading.textContent = ` I, ${record?.name}, S/o / D/o ${record?.fatherName} do hereby make a
            solemn`;
      headingCard.appendChild(secondHeading);
      let thirdHeading = document.createElement("h3");
      thirdHeading.textContent =
        "declaration, in connection with the General Election to Lok Sabha 2024, Assam, that:";

      headingCard.appendChild(thirdHeading);

      let listElemnt = document.createElement("ol");
      listElemnt.classList.add("pdf-ul");
      firstMainDiv.appendChild(listElemnt);
      let firstOlEmenelt = document.createElement("li");

      firstOlEmenelt.textContent =
        "I am not a close relative of any of the contesting candidate/leading\npolitical functionary of the state/district in the aforesaid election.";

      listElemnt.appendChild(firstOlEmenelt);

      let secondOlElement = document.createElement("li");
      secondOlElement.textContent =
        "No criminal case is pending against me in any court of law.";

      listElemnt.appendChild(secondOlElement);

      let newSecondDiv = document.createElement("div");
      newSecondDiv.classList.add("pdf-img-names-card");
      firstMainDiv.appendChild(newSecondDiv);

      let img = document.createElement("img");

      img.width = 300;
      img.height = 200;

      img.src = `${record?.profilePic}`;

      newSecondDiv.appendChild(img);

      let secondDivInsideDiv = document.createElement("div");

      newSecondDiv.appendChild(secondDivInsideDiv);

      let signatureSpan = document.createElement("span");
      signatureSpan.textContent =
        "Signature With Date .............................";
      secondDivInsideDiv.appendChild(signatureSpan);

      let nameSpan = document.createElement("span");
      nameSpan.textContent = `Name -- ${record?.name}`;
      secondDivInsideDiv.appendChild(nameSpan);

      let fNameSpan = document.createElement("span");
      fNameSpan.textContent = `Father's Name -- ${record?.fatherName}</span>`;
      secondDivInsideDiv.appendChild(fNameSpan);

      let mNameSpan = document.createElement("span");
      mNameSpan.textContent = `Mother's Name -- ${record?.motherName}`;
      secondDivInsideDiv.appendChild(mNameSpan);

      let addressSpan = document.createElement("span");
      addressSpan.textContent = `Address -- ${record?.address}`;
      secondDivInsideDiv.appendChild(addressSpan);

      let village = document.createElement("span");
      village.textContent = `Village -- ${record?.mandal}`;
      secondDivInsideDiv.appendChild(village);

      let district = document.createElement("span");
      district.textContent = `District -- ${record?.district}`;
      secondDivInsideDiv.appendChild(district);

      let pin = document.createElement("span");
      pin.textContent = `PIN -- ${record?.pinCode}`;
      secondDivInsideDiv.appendChild(pin);

      let mobileNumber = document.createElement("span");
      mobileNumber.textContent = `Mobile No -- ${record?.phone}`;
      secondDivInsideDiv.appendChild(mobileNumber);

      let adharNumber = document.createElement("span");
      adharNumber.textContent = `Adhaar No -- ${record?.adharnumber}`;
      secondDivInsideDiv.appendChild(adharNumber);

      element.appendChild(firstMainDiv);

      document.body.appendChild(element);

      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("img/png");
        const doc = new jsPDF("p", "mm", "a4");

        const componentWidth = doc.internal.pageSize.getWidth();
        const componentHeight = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
        doc.save(`${record?.name}.pdf`);
        document.body.removeChild(element);
      });
    });

    // const capture = document.querySelector(".pdf-main-mian");
  };

  return (
    <div className="main-user-pdf">
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

      <div className="user-data-main">
        <h2>Users PDF File</h2>
        <button onClick={downloadPdf}>Download</button>
      </div>

      <div className="pdf-main-mian">
        {/* <div className="pdf-main-body">
          <h1>DECLARATION BY WEB CASTING AGENTS</h1>
          <h3 style={{ textAlign: "center" }}>
            I, {user?.name}, S/o / D/o {user?.fatherName} do hereby make a
            solemn
            <br /> declaration, in connection with the General Election to Lok
            Sabha 2024, Assam, that:
          </h3>
          <ol type="A" className="pdf-ul">
            <li>
              I am not a close relative of any of the contesting
              candidate/leading <br /> political functionary of the
              state/district in the aforesaid election.
            </li>
            <li>No criminal case is pending against me in any court of law.</li>
          </ol>
          <div className="pdf-img-names-card">
            <img src={user?.profilePic} alt="" />
            <div>
              Signature With Date .............................</span>
              <span>Name -- {user?.name}</span>
              <span>Father's Name -- {user?.fatherName}</span>
              <span>Mother's Name -- {user?.motherName}</span>
              <span>Address -- {user?.address}</span>
              <span>Village -- {user?.mandal}</span>
              <span>District -- {user?.district}</span>
              <span>PIN -- {user?.pinCode}</span>
              <span>Mobile No -- {user?.phone}</span>
              <span>Adhaar No -- {user?.adharnumber}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PDFUser;
