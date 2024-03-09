import React, { useEffect, useState } from "react";
import "./AssemblyAssignTask.css";
import { useSelector } from "react-redux";
import { APIS, headers } from "../../data/header";
import { GoTasklist } from "react-icons/go";
import ReactPaginate from "react-paginate";
import { RxCross1 } from "react-icons/rx";
import { allpsAddedtoUser } from "../../util/showmessages";
const AssemblyAssignTask = () => {
  const UUU = useSelector((state) => state.authReducer.authData);
  const [initiallyAllPs, setInitiallyAllPs] = useState([]);
  const [allInitiallyUsers, setAllInitiallyUsers] = useState([]);

  const [storeModalUser, setStoreModalUser] = useState(null);

  // array of ps added to users
  const [array, setArray] = useState([]);
  const [showError, setShowError] = useState("");

  // open task modal

  const [openTaskModal, setOpenTaskModal] = useState(false);

  // AFTER SET UNIQUE LOCATIONS THIS ALL STATE ARE STORE PAGINATION AND LOCATION DATA
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 8;
  const currentItems = allInitiallyUsers?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allInitiallyUsers?.length / 8);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 8) % allInitiallyUsers?.length;
    setItemOffset(newOffset);
  };

  const allUsers = () => {
    APIS.get(
      `assembly/alluser/assembly/${UUU?.assembly}/state/${UUU?.state}/district/${UUU?.district}`
    )
      .then((res) => {
        setAllInitiallyUsers(res.data);
        // console.log(res.data);
      })
      .catch((e) => console.log(e));
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
        `/assembly/assign/task/user/${storeModalUser?._id}/name/${storeModalUser?.name}/phone/${storeModalUser?.phone}`,
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

  return (
    <div className="assembly-aasigntask-main">
      <div
        style={{
          filter: openTaskModal && "blur(10px)",
        }}
        className="table__main__card"
      >
        <div className="table__header__card">
          <span>Name</span>
          <span>Address</span>
          <span>Phone</span>
          <span>Score</span>
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
              className="table__inner__body"
            >
              <span>{each.name}</span>
              <span>{each.address}</span>
              <span>{each.phone}</span>
              <span>{each.score}</span>
              <span>{each.mandal}</span>
              <button
                disabled={each.assign_task === "yes" && "true"}
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
          {showError && <span>{showError}</span>}
          <div>
            <div className="added-assembly-ps-task-card">
              <div>
                {initiallyAllPs?.map((each, key) => (
                  <div
                    key={key}
                    style={{
                      textDecoration: each?.assign === "yes" && "line-through",
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
