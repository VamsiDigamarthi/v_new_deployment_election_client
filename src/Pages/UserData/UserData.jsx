

import React, { useEffect, useState } from 'react'
import './UserData.css'
import * as XLSX from "xlsx";
import { APIS, headers } from '../../data/header'
const UserData = () => {

    const [userData, setUserData] = useState([])

    

    useEffect(() => {
        APIS.get("/user//fetch/all/user/available", {
            headers: headers,
          })
            .then((res) => {
              console.log(res);
              setUserData(res.data);
            })
            .catch((e) => {
              console.log(e);
            });
    } , [])

    const onExelDownload = (e) => {
        const ws = XLSX.utils.json_to_sheet(userData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "userData" + ".xlsx");
      };

      console.log(userData)

  return (
    <div className='user-data-main'>
      <h3>Users Data</h3>
      <button onClick={onExelDownload}>Download</button>
    </div>
  )
}

export default UserData
