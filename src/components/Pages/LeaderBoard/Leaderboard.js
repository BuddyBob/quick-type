import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { makeStyles, withStyles } from '@mui/styles';

import NavBar from '../../Nav/NavBar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { db } from '../../../firebase'

function setUp(data){
    function customSort(arr){
      arr.sort(function(first, second) {
          return second.pb - first.pb;
      });
      return arr
  }
  //remove NAN from logs
  function removeOcc(arr){
      let newArr = [];
      for (var elem of arr){
          if (elem){
              newArr.push(elem)
          }
      }
      return newArr
  }
  //if data is returned successfully
  if (data){
    let rows = []
    //iterate through users collection
    for (var i = 0; i <= data.length-1; i++){
        let wpms = data[i].logs.wpmHistory;  //return users wpm log
        wpms = removeOcc(wpms) //remove NaN
        wpms.sort((a, b) => a - b) //this allows sort to sort properly
        //get user name and highest wpm of row
        let username = data[i].username
        let highestWpm = wpms[wpms.length-1] 
        //turn empty logs into 0
        if (!highestWpm){highestWpm = 0}
        rows.push({"username": username,"pb":highestWpm})
    }
    //sort data highest wpm to lowest wpm
    rows = customSort(rows)
    //add a place to each row
    for (var i = 0; i <= rows.length-1; i++){
      rows[i]["place"] = i+1
    }
    console.log(rows)
    return rows
}
}
function call(d){
  const val = setUp(d)
  if (val){
    return val
  }
}
const Leaderboard = () => {
  const [data, setData] = useState()
  //get data
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => doc.data());
      setData(call(usersData));
    };
  
    fetchData();
  }, []);
  //sort data
  return (
    <div>
        <div id="nav" style={{marginBottom:"40px"}}>
        <NavBar/>
        </div>
        {data &&
        <Table >
            <TableHead>
                <TableRow>
                    <TableCell style={{color:"#ed3469", paddingLeft:"15px"}} align="left"><strong>#</strong></TableCell>
                    <TableCell style={{paddingLeft:"15px"}} align="left"><strong>Name</strong></TableCell>
                    <TableCell style={{paddingLeft:"15px"}} align="center"><strong>Wpm</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {data.map(n => {
                return (
                <TableRow>
                    <TableCell align="left" >{n.place}</TableCell>
                    <TableCell align="left">{n.username}</TableCell>
                    <TableCell align="center">{n.pb}</TableCell>
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
        }
    </div>
  );
}

export default Leaderboard