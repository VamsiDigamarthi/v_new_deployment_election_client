import React, { useEffect, useState } from "react";
import "./AssemblyAssignTask.css";
import { useSelector } from "react-redux";
import { APIS, headers } from "../../data/header";
import { GoTasklist } from "react-icons/go";
import ReactPaginate from "react-paginate";
import { RxCross1 } from "react-icons/rx";
import { allpsAddedtoUser } from "../../util/showmessages";
import { SpinnerDotted } from "spinners-react";
const AssemblyAssignTask = () => {
  const UUU = useSelector((state) => state.authReducer.authData);
  const [initiallyAllPs, setInitiallyAllPs] = useState([]);
  const [allInitiallyUsers, setAllInitiallyUsers] = useState([]);

  const [storeModalUser, setStoreModalUser] = useState(null);

  const [loader, setLoader] = useState(true);

  // array of ps added to users
  const [array, setArray] = useState([]);
  const [showError, setShowError] = useState("");

  // filter PS number

  const [onPsNumberFilter, setOnPsNumberFilter] = useState("");

  // open task modal

  const [openTaskModal, setOpenTaskModal] = useState(false);

  // AFTER SET UNIQUE LOCATIONS THIS ALL STATE ARE STORE PAGINATION AND LOCATION DATA
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 9;
  const currentItems = allInitiallyUsers?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allInitiallyUsers?.length / 9);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 9) % allInitiallyUsers?.length;
    setItemOffset(newOffset);
  };

  const allUsers = () => {
    setLoader(true);
    APIS.get(
      `assembly/alluser/assembly/${UUU?.assembly}/state/${UUU?.state}/district/${UUU?.district}`
    )
      .then((res) => {
        setLoader(false);
        setAllInitiallyUsers(res.data);
        // console.log(res.data);
      })
      .catch((e) => {
        setLoader(false);
        console.log(e);
      });
  };

  const allPsInitially = () => {
    APIS.get(`/assembly/allps/assemblycoor/${UUU?._id}`)
      .then((res) => {
        // console.log(res.data);
        setInitiallyAllPs(res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    allPsInitially();
    allUsers();
  }, []);

  const onTaskModalCloseFun = (user) => {
    console.log(user);
    setOpenTaskModal(!openTaskModal);
    setStoreModalUser(user);
    setShowError("");
    setArray([]);
  };
  const closeModal = () => {
    setOpenTaskModal(false);
  };

  const addedMulplePsUser = (ps) => {
    const index = array.findIndex((item) => item._id === ps._id);
    if (index === -1) {
      setArray((prev) => [...prev, ps]);
    } else {
      // If object exists, remove it from the array
      const newArray = [...array];
      newArray.splice(index, 1);
      setArray(newArray);
    }
  };

  const onAddAllTaskUser = () => {
    // console.log(storeModalUser);
    if (array.length > 0) {
      setShowError("");
      APIS.post(
        `/assembly/assign/task/user/${storeModalUser?._id}/name/${storeModalUser?.name}/phone/${storeModalUser?.phone}/bankname/${storeModalUser?.bankname}/banknumber/${storeModalUser?.banknumber}/ifsc/${storeModalUser?.IFSC}`,
        { array },
        { headers: headers }
      )
        .then((res) => {
          // console.log(res.data);
          closeModal();
          setArray([]);
          allpsAddedtoUser(res.data);
          allUsers();
          allPsInitially();
        })
        .catch((e) => console.log(e));
    } else {
      setShowError("Please Selecet Ps Number");
    }
  };

  // console.log(initiallyAllPs);

  //
  const onPsNumberChangeFilterFun = (e) => {
    setOnPsNumberFilter(e.target.value);
    console.log(initiallyAllPs[3]);

    // const l = initiallyAllPs.filter((each) => each.PS_No == "1");
    // console.log(l);
  };

  return (
    <div className="assembly-aasigntask-main">
      {loader ? (
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
          <div
            style={{
              filter: openTaskModal && "blur(10px)",
            }}
            className="table__main__card"
          >
            <div className="assembly-table-header">
              <span>Name</span>
              <span>Address</span>
              <span>Phone</span>
              <span>PIN Code</span>
              <span>Mandal</span>
              <span className="table__header__last__span">Action</span>
            </div>
            <div className="table__body__card">
              {currentItems?.map((each, key) => (
                <div
                  style={{
                    color: each.assign_task === "yes" && "#ee8673",
                  }}
                  key={key}
                  className="assembly-table-body"
                >
                  <span>{each.name}</span>
                  <span>{each.address?.toLowerCase()}</span>
                  <span>{each.phone}</span>
                  <span>{each.pinCode}</span>
                  <span>{each.mandal}</span>
                  <button
                    // disabled={each.assign_task === "yes" && "true"}
                    // onClick={() => onOpenTaskModalFun(each)}
                    className="table__action"
                    // style={{
                    //   color: each.assign === "yes" && "#ee8673",
                    // }}
                    onClick={() => onTaskModalCloseFun(each)}
                  >
                    <GoTasklist size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              filter: openTaskModal && "blur(10px)",
            }}
            className="paginations__card__appcss"
          >
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
              className="paginat"
            />
          </div>
        </>
      )}
      {openTaskModal && (
        <div className="assembly-assigntask-modal-main">
          <div className="user__modal__cross__card">
            <span>Assign Task</span>
            <RxCross1 onClick={onTaskModalCloseFun} size={20} />
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <span>Name : {storeModalUser?.name}</span>
            <span>Address : {storeModalUser?.address}</span>
            <span>Phone : {storeModalUser?.phone}</span>
          </div>

          {/* <div className="on-modal-input-card-new">
            <input
              onChange={onPsNumberChangeFilterFun}
              type="text"
              placeholder="Enter PS Number"
            />
          </div> */}
          {showError && <span>{showError}</span>}
          <div>
            <div className="added-assembly-ps-task-card">
              <div>
                {initiallyAllPs
                  ?.filter((each) =>
                    onPsNumberFilter === ""
                      ? each
                      : each.PS_No == onPsNumberFilter
                  )
                  .map((each, key) => (
                    <div
                      key={key}
                      style={{
                        textDecoration:
                          each?.assign === "yes" && "line-through",
                      }}
                    >
                      <input
                        disabled={each?.assign === "yes" ? true : false}
                        onChange={() => addedMulplePsUser(each)}
                        type="checkbox"
                      />
                      <label>
                        {each.PS_No} {" ,"} {each.PS_Name_and_Address} {" ,"}{" "}
                        {each.PS_Location}
                      </label>
                    </div>
                  ))}
              </div>
              <button onClick={onAddAllTaskUser}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssemblyAssignTask;
