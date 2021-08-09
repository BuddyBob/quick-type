import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { db } from '../../../firebase'
import NavBar from '../../Nav/NavBar' 
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#ede8e8",
      padding:5,
    },
    body: {
      color:"#ffdc7a",
      fontSize: 12,
      fontFamily:"Roboto Mono"
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
      backgroundColor:"#2D2F31",
      height:1,
    },

  }))(TableRow);
  
const useStyles = makeStyles({
    table: {
        border:"1px solid white", 
        borderRadius:200, 
        maxWidth: 500, 
        margin: 'auto'
    }
});

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
  const classes = useStyles();
  const [data, setData] = useState()
  //get data
  useEffect(async () => {
      const snapshot = await db.collection('users').get()
      const snappy = await snapshot.docs.map(doc => doc.data())
      setData(call(snappy))
  }, [])
  //sort data
  return (
    <div>
        <div id="nav" style={{marginBottom:"40px"}}>
        <NavBar/>
        </div>
        {data &&
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <StyledTableCell style={{color:"#ed3469", paddingLeft:"15px"}} align="left"><strong>#</strong></StyledTableCell>
                    <StyledTableCell style={{paddingLeft:"15px"}} align="left"><strong>Name</strong></StyledTableCell>
                    <StyledTableCell style={{paddingLeft:"15px"}} align="center"><strong>Wpm</strong></StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {data.map(n => {
                return (
                <StyledTableRow>
                    <StyledTableCell align="left" >{n.place}</StyledTableCell>
                    <StyledTableCell align="left">{n.username}</StyledTableCell>
                    <StyledTableCell align="center">{n.pb}</StyledTableCell>
                </StyledTableRow>
                );
            })}
            </TableBody>
        </Table>
        }
    </div>
  );
}

export default Leaderboard