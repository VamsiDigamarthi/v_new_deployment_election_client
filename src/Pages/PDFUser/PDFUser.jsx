
import { APIS, headers } from "../../data/header";
import { ToastContainer } from "react-toastify";
import React, { useState } from 'react'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    allpsAddedtoUser,
    taskAddedAlredyRegis,
} from "../../util/showmessages";
import './PDFUser.css'
const PDFUser = () => {
    const [phone, setPhone] = useState("");

    const [user, setUser] = useState(null)
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(true)
    const validator = (phone) => {
        let errors = {};
        if (!phone) {
            // console.log(values?.phone.length);
            errors.phone = "phone number is required!";
        } else if (!/^[0-9]{1,}$/.test(phone)) {
            errors.phone = "phone number must be numeric characters";
        } else if (phone.length !== 10) {
            errors.phone = "phone number must be 10 characters";
        }
        //   role

        setErrors(errors);
        console.log(errors)
        return Object.keys(errors).length === 0;
    };

    const onPdfDownload = (e) => {
        console.log("out")
        if (validator(phone)) {
            console.log("is")
            setErrors({});
            APIS.get(
                `/own/access/user/by/phone/${phone}`,

                { headers: headers }
            )
                .then((res) => {
                    console.log(res.data);
                    setPhone("");
                    setUser(res.data)
                    allpsAddedtoUser(res.data?.msg);
                    setLoader(false)
                })
                .catch((e) => {
                    //   console.log(e?.response?.data?.msg);
                    taskAddedAlredyRegis(e?.response?.data?.msg);
                    setLoader(false)
                });
        }
    }

    const downloadPdf = () => {
        const capture = document.querySelector(".pdf-main-mian");
        html2canvas(capture).then((canvas) => {
          const imgData = canvas.toDataURL("img/png");
          const doc = new jsPDF("l", "mm", "a4");
    
          const componentWidth = doc.internal.pageSize.getWidth();
          const componentHeight = doc.internal.pageSize.getHeight();
          doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
    
          doc.save("userData.pdf");
        });
    
      };

    return (
        <div className='main-user-pdf'>
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

            <div className="user-pdf-card">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Enter Mobile Number" />
                <button onClick={onPdfDownload}>Submit</button>
            </div>
            {errors?.phone && <p>{errors?.phone}</p>}
            {/* {loader ? <div></div> : ( */}
<>
                <div className="pdf-main-mian">
                    <div className="pdf-main-body">
                        <h1>
                            DECLARATION BY WEB CASTING AGENTS
                        </h1>
                        <h3 style={{ textAlign: "center" }}>
                            I, {user?.name}, S/o / D/o {user?.fatherName} do hereby make a solemn<br /> declaration, in connection with the General Election to Lok Sabha 2024, Assam, that:
                        </h3>
                        <ol type="A" className="pdf-ul">

                            <li>
                            I am not a close relative of any of the contesting candidate/leading <br /> political functionary of the state/district in the aforesaid election.
                            </li>
                            <li>No criminal case is pending against me in any court of law.</li>

                        </ol>
                        <div className="pdf-img-names-card">
                            <img src={user?.profilePic} alt="" />
                            <div>
                                <span>Signature With Date .............................</span>
                                <span>Name -- {user?.name}</span>
                                <span>Father's Name -- {user?.fatherName}</span>
                                <span>Mother's Name -- {user?.motherName}</span>
                                <span>
                                    Address  -- {user?.address}
                                </span>
                                <span>
                                    Village -- {user?.mandal}
                                </span>
                                <span>
                                    District -- {user?.district}
                                </span>
                                <span>
                                    PIN -- {user?.pinCode}
                                </span>
                                <span>
                                    Mobile No -- {user?.phone}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pdf-downloasd-btn-card">
                    <button onClick={downloadPdf}>Download</button>
                </div>
                </>
                {/* )
            } */}



        </div>
    )
}

export default PDFUser
