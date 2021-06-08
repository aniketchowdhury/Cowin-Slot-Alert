import './App.css';
import { Select, MenuItem, Typography, FormControl, makeStyles, Paper, TableRow, TableCell, Table, TableHead,TableBody, TableContainer, InputLabel, Snackbar, IconButton, Switch} from "@material-ui/core";
import { useEffect, useState } from 'react';
import {getStates, getDistricts, getSlots} from "./fetchAPI";
import moment from "moment";
import _ from "underscore";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles(theme=>({
  root:{
    margin: theme.spacing(1),
    top:"50px",
    display:"flex",
    flexDirection:"row",
    minWidth:"fit-content"
  },
  selectStyle:{
    width:"300px"
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
    height: "85vh"
  },
  colorCorrectAnswer:{
    backgroundColor: "#92F7BA",
    padding: "15px",
    borderRadius: "7px",
    color: "#474747"
  },
}))
function App() {
  const classes = useStyles();
  let audio = new Audio("https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3");
  const [stateName, setStateName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [stateCode, setStateCode] = useState(0);
  const [districtCode, setDistrictCode] = useState(0);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [slotsList, setSlotsList] = useState([]);
  const [doseChoice, setDoseChoice] = useState("");
  const [open, setOpen] = useState(true);
  const [toggleAudio, setAudio] = useState(true);
  const vertical='bottom';const horizontal='center';

  useEffect(()=>{
    document.title = "Cowin Slot Alert"
    async function fetchData(){
      const listOfStates = await getStates();
      setStateList(listOfStates);
    }
    fetchData();
  }, []);

  useEffect(()=>{
    const fetchDistricts=async(ID)=>{
      const listOfDistricts = await getDistricts(ID);
      setDistrictList(listOfDistricts);
    }
    fetchDistricts(stateCode);
  }, [stateCode]);

  const displaySlots = ()=>{
    let centername; let sessions=[]; let freeSlots=[] ;
    slotsList.forEach(item=>{
      sessions = item.sessions;
      sessions.forEach(val=>{
        let dose = _.isEqual(doseChoice,"dose1") ? val.available_capacity_dose1 : val.available_capacity_dose2;
        if(dose > 0)
          {
            centername = item.name;
            let obj={openSlots:0,centerName:"",slotDate:"",vaccine:"",pincode:""};
            obj.openSlots = dose;
            obj.centerName = centername;
            obj.slotDate = val.date;
            obj.vaccine = val.vaccine;
            obj.pincode = item.pincode;
            freeSlots.push(obj);
          }
      })
    })
    if(!_.isEmpty(freeSlots)){
      toggleAudio && audio.play();
      return(
        <TableContainer component={Paper} style={{
          width: "680px",
          height: "400px",
          opacity: "0.87",
          overflowY: "auto"}}>
        <Table size="medium" stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Center Name</TableCell>
            <TableCell align="left">Pin Code&nbsp;</TableCell>
            <TableCell align="left">Open Slots</TableCell>
            <TableCell align="left">Slot Dates&nbsp;</TableCell>
            <TableCell align="left">Vaccine&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {freeSlots.map((item,index)=>{
          return (<TableRow key={index.toString()}>
            <TableCell>{item.centerName}</TableCell>
            <TableCell>{item.pincode}</TableCell>
            <TableCell>{item.openSlots}</TableCell>
            <TableCell>{item.slotDate}</TableCell>
            <TableCell>{item.vaccine}</TableCell>
            </TableRow>
          )
        })
      }
        </TableBody>
      </Table>
      </TableContainer>
      )
    }
    else
    return (
      <div style={{display:"flex",marginTop: "100px"}}>
        <ErrorIcon fontSize="medium" style={{width:"4.5rem" ,height:"2.5rem", color:"crimson"}}/>
        <Typography variant="h4">No Slots Found</Typography>
    </div>
    )
  }

  useEffect(()=>{
    const fetchSlots = async(ID,date) => {
      const listOfSlots = await getSlots(ID,date);
      setSlotsList(listOfSlots);
    }
    let date = moment().format('DD-MM-YYYY');
    fetchSlots(districtCode,date);
    const interval = setInterval(() => fetchSlots(districtCode,date), 15000)
        return () => {
          clearInterval(interval);
        }
  }, [districtCode]);

  const handleStateSelect = (event) =>{
     setStateName(event.target.value);
     let stateID = stateList.find(item=>item.state_name===event.target.value).state_id;
     setStateCode(stateID);
  }

  const handleDistrictSelect = (event) => {
    setDistrictName(event.target.value);
    let districtID = districtList.find(item=> item.district_name===event.target.value).district_id;
    setDistrictCode(districtID);
    displaySlots();
  }

  const handleDoseSelect = (event) => {
    setDoseChoice(event.target.value);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleToggle = (event) => {
    setAudio(event.target.checked)
  }

  const renderSwitch = () => {
    return (
      <div style={{marginTop: "55px", display:"flex"}}>
      <Switch 
      value="true"
      color="primary"
      data-testid="toggleFilmStrip"
      size="medium"
      checked={toggleAudio}
      onClick={handleToggle}
    />
    <Typography style={{paddingTop:"7px"}}>
      {!toggleAudio?"Switch Audio ON":"Switch Audio OFF"}
    </Typography>
    </div>
    )
  }

  return (
    <div className="App">
      <div className={classes.wrapper}>
        <div>
        <Typography variant="h3">Cowin Slot Finder</Typography>
        </div>
        <div style={{display:"flex"}}>
        <FormControl variant="outlined" className={classes.root}>
        {stateList && (
          <>
          <InputLabel style={{top:"-6px"}}>Select your state</InputLabel>
          <Select variant="outlined" 
            className={classes.selectStyle} 
            value={stateName} 
            onChange={handleStateSelect}
            MenuProps={{
              style: {top:"50px",height:"350px"}
            }}
          >
          {
            stateList.map((item,index)=>(
              <MenuItem value={item.state_name} key={index.toString()}>{item.state_name}</MenuItem>
            ))
          }
        </Select>
        </>
        )
        }
        </FormControl>
        <FormControl variant="outlined" className={classes.root}>
        {stateName && districtList && (
          <>
          <InputLabel style={{top:"-6px"}}>Select your district</InputLabel>
          <Select variant="outlined" 
            className={classes.selectStyle} 
            value={districtName} 
            onChange={handleDistrictSelect}
            MenuProps={{
              style: {top:"50px",height:"350px"}
            }}
          >
          {
            districtList.map((item,index)=>(
              <MenuItem 
                value={item.district_name} 
                key={index.toString()}
              >
                {item.district_name}
              </MenuItem>
            ))
          }
        </Select>
        </>
        )
        }
        </FormControl><FormControl variant="outlined" className={classes.root}>
        {stateName && districtList && (
          <>
          <InputLabel style={{top:"-6px"}}>Select your dose</InputLabel>
          <Select variant="outlined" 
            className={classes.selectStyle} 
            value={doseChoice} 
            onChange={handleDoseSelect}
            MenuProps={{
              style: {top:"50px",height:"350px"}
            }}
          >
          <MenuItem value={'dose1'}>DOSE 1</MenuItem>
          <MenuItem value={'dose2'}>DOSE 2</MenuItem>
        </Select>
        </>
        )
        }
        </FormControl>
        </div>
        {!_.isEmpty(slotsList) && !_.isEmpty(doseChoice) ? <>{renderSwitch()} {displaySlots()}</>:null}
      </div>
      <Snackbar
        open={open}
        anchorOrigin={{vertical, horizontal}}
        message="Data is polled every 30 seconds"
        action={
          <IconButton color="inherit" size="small" onClick={handleClose}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        }
      >
      </Snackbar>
    </div>
  );
}

export default App;
