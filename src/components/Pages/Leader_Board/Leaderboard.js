import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import NavBar from '../../Nav/NavBar' 
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#ede8e8",
    },
    body: {
      color:"#ffdc7a",
      fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: "#2D2F31",
      },
      '&:nth-of-type(even)': {
        backgroundColor: "#1f2022",
      },
    },
  }))(TableRow);
  
const useStyles = makeStyles({

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

  return (
    <div>
        <div id="nav" style={{marginBottom:"40px"}}>
        <NavBar/>
        </div>
        <Table style={{ maxWidth: 1000, margin: 'auto' }}>
            <TableHead>
                <TableRow>
                    <StyledTableCell style={{color:"#ed3469"}} align="left">#</StyledTableCell>
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="center">Wpm</StyledTableCell>
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