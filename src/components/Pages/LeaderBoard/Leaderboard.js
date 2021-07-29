import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import NavBar from '../../Nav/NavBar' 
import GenData from './GenData'
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

function createData(place, name, wpm) {
  return { place, name, wpm };
}

const data = [
  createData(1, 'Thavas', 140),
  createData(2, 'Rice Gum', 100),
  createData(3, 'Jaden', 80),
  createData(4, 'Julio', 50),
  createData(5, 'Tom Brady', 20),
];

function Leaderboard() {
  const classes = useStyles();
  GenData();
  return (
    <div>
        <div id="nav" style={{marginBottom:"40px"}}>
        <NavBar/>
        </div>
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
                    <StyledTableCell align="left">{n.name}</StyledTableCell>
                    <StyledTableCell align="center">{n.wpm}</StyledTableCell>
                </StyledTableRow>
                );
            })}
            </TableBody>
        </Table>
    </div>
  );
}

export default Leaderboard