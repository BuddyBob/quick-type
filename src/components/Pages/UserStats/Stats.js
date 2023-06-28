import './Stats.css'

import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import NavBar from '../../Nav/NavBar'
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { db } from '../../../firebase'
import sum from 'lodash/sum';
import { useAuth } from '../../context/AuthContext'

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#ede8e8",
      padding:5,
      fontSize:12
    },
    body: {
      color:"#ffdc7a",
      fontSize: 12,
      padding:10,
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

const Stats = () => {
    const { currentUser } = useAuth();
    const [userId,setUserId] = useState(currentUser.uid)
    const [wpmArr,setWpmArr] = useState()
    const [rawWpmArr,setRawWpmArr] = useState()
    const [accuracyArr,setAccuracyArr] = useState()
    const [realAccuracyArr,setRealAccuracyArr] = useState()
    const [errorArr,setErrorArr] = useState()
    const [sortType,setSortType] = useState(localStorage.getItem("sortType"))
    const [rowCount,setRowCount] = useState(localStorage.getItem("rowCount"))
    useEffect(() => {
        const fetchData = async () => {
          try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setWpmArr(data.logs.wpmHistory.reverse());
              setRawWpmArr(data.logs.rawWpmHistory.reverse());
              setAccuracyArr(data.logs.accuracyHistory.reverse());
              setRealAccuracyArr(data.logs.realAccuracyHistory.reverse());
              setErrorArr(data.logs.errorHistory.reverse());
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.log("Error getting document:", error);
          }
        };
      
        fetchData();
      }, []);
    function getAvg(arr){
        return (sum(arr)/arr.length)
    }
    function sortData(sortType,currentSort){
        const ind = {"old - new":-2, "new - old":-1, "Real Wpm":0,"Raw Wpm":1,"Raw Accuracy":2,"Real Accuracy":3,"Errors":4}
        const tp = ind[sortType]
        if (tp >= 0){
            currentSort.sort( function( a, b ){
            if ( a[tp] == b[tp] ) return 0;
            return a[tp] > b[tp] ? -1 : 1;
            });
            return currentSort
        }
        else if (tp === -2){
            //flip order
            return currentSort.reverse()
        }
        else if (tp === -1){
            return currentSort
        }

    }
    function returnIt(rowDisplay){
            let _ = require('underscore')
            const zipped = _.zip(wpmArr.slice(0,rowDisplay),rawWpmArr.slice(0,rowDisplay),accuracyArr.slice(0,rowDisplay),realAccuracyArr.slice(0,rowDisplay),errorArr.slice(0,rowDisplay))
            //sort zip
            const modZipped = sortData(sortType,zipped)
            let avgWpm = sum(wpmArr)/(wpmArr.length)
            let avgRawWpm = sum(rawWpmArr)/(rawWpmArr.length)
            let avgAccuracy = sum(accuracyArr)/(accuracyArr.length)
            let avgRealAccuracy = sum(realAccuracyArr)/(realAccuracyArr.length)
            let avgErrors = sum(errorArr)/(errorArr.length)
            function roundIt(num){
                return Math.round(num * 10) / 10
            }
            return [modZipped,roundIt(avgWpm),roundIt(avgRawWpm),roundIt(avgAccuracy),roundIt(avgRealAccuracy),roundIt(avgErrors)]
           
    }
    function handleChange(e,change){
        if (change === "rows"){setRowCount(e.target.value);localStorage.setItem("rowCount",e.target.value);}
        else if (change === "sort"){setSortType(e.target.value);localStorage.setItem("sortType",e.target.value);}
    }
    const classes = useStyles()
    let x;
    let avgWpm;
    let avgRawWpm;
    let avgAccuracy;
    let avgRealAccuracy
    let avgErrors 
    if (wpmArr && rawWpmArr && accuracyArr && realAccuracyArr && errorArr){
        const data = returnIt(rowCount)
        x = data[0]
        console.log(data)
        avgWpm =  data[1]  
        avgRawWpm = data[2]
        avgAccuracy = data[3]
        avgRealAccuracy = data[4]  
        avgErrors = data[5]
    }
    return(
        <div className="iii">
            {x &&
                <div>
                    <NavBar/>
                    <div>
                        <h3 className="text-center font-weight-bold mt-4 mb-3 avgTitle ">Averages</h3>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell className="table-headers" style={{color:"#ed3469", paddingLeft:"15px"}} align="center"><strong>Real Wpm</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Raw Wpm</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Real Accuracy</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Raw Accuracy</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Errors</strong></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell align="center">{avgWpm}</StyledTableCell>
                                    <StyledTableCell align="center">{avgRawWpm}</StyledTableCell>
                                    <StyledTableCell align="center">{avgRealAccuracy}</StyledTableCell>
                                    <StyledTableCell align="center">{avgAccuracy}</StyledTableCell>
                                    <StyledTableCell align="center">{avgErrors}</StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex-container">
                        <div className="row-count">
                            <FormControl variant="filled" className="row-count-dropdown">
                                <InputLabel className="dropdown-label" style={{fontSize:"14px",color:"#ffdc7a",backgroundColor:"#2D2F31"}}>Rows</InputLabel>
                                <Select style={{color:"white"}} value={rowCount} onChange={(e) => handleChange(e,"rows")}>
                                <MenuItem value={5}><span className="options">5 rows</span></MenuItem>
                                <MenuItem value={10}><span className="options">10 rows</span></MenuItem>
                                <MenuItem value={30}><span className="options">30 rows</span></MenuItem>
                                <MenuItem value={100}><span className="options">100 rows</span></MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="log-sort">
                            <FormControl variant="filled" className="sort-type-dropdown">
                                <InputLabel className="dropdown-label" style={{fontSize:"14px",color:"#ffdc7a", backgroundColor:"#323437"}}>Sort</InputLabel>
                                <Select style={{color:"white"}} value={sortType} onChange={(e) => handleChange(e,"sort")}>
                                <MenuItem value={"new - old"}><span className="options">Newest to Oldest</span></MenuItem>
                                <MenuItem value={"old - new"}><span className="options">Oldest to Newest</span></MenuItem>
                                <MenuItem value={"Real Wpm"}><span className="options">Real Wpm</span></MenuItem>
                                <MenuItem value={"Raw Wpm"}><span className="options">Raw Wpm</span></MenuItem>
                                <MenuItem value={"Real Accuracy"}><span className="options">Real Accuracy</span></MenuItem>
                                <MenuItem value={"Raw Accuracy"}><span className="options">Raw Accuracy</span></MenuItem>
                                <MenuItem value={"Errors"}><span className="options">Errors</span></MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-center font-weight-bold mt-4 mb-3 avgTitle">Log</h3>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell className="table-headers" style={{color:"#ed3469", paddingLeft:"15px"}} align="center"><strong>Real Wpm</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Raw Wpm</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Real Accuracy</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Raw Accuracy</strong></StyledTableCell>
                                    <StyledTableCell className="table-headers" style={{paddingLeft:"15px"}} align="center"><strong>Errors</strong></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    {x.map(n => {
                                        {console.log(n)}
                                        return(
                                            <StyledTableRow>
                                                <StyledTableCell align="center">{n[0]}</StyledTableCell>
                                                <StyledTableCell align="center">{n[1]}</StyledTableCell>
                                                <StyledTableCell align="center">{n[2]}</StyledTableCell>
                                                <StyledTableCell align="center">{n[3]}</StyledTableCell>
                                                <StyledTableCell align="center">{n[4]}</StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }
        </div>
    )
}
export default Stats
