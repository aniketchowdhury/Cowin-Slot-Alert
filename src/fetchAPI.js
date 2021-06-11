const URLStates = "https://cdn-api.co-vin.in/api/v2/admin/location/states";

export const getStates = async() =>{
    const requestOptions={
    method: "GET"
}
    const res = await fetch(URLStates,requestOptions);
    if(res.ok)
    {
        return res.json().then(data=>{
            return data.states;
        })
    }
}

export const getDistricts = async(stateID)=>{
    const requestOptions={
        method: "GET"
    }
    const URLDistrictList = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/`+stateID;
    const results = await fetch(URLDistrictList,requestOptions);
    if(results.ok)
    {
        return results.json().then(res=>{
            return res.districts;
        })
    }
}

export const getSlots = async(ID,date) => {
    const requestOptions={
        method: "GET"
    };
    const URL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=`+ID+`&date=`+date;
    const results = await fetch(URL, requestOptions);
    if(results.ok)
    {
        return results.json().then(res=>{
            return res.centers;
        })
    }
}

export const getOTP = async(mobile) => {
    let txnID="";
    const formData = {
        "mobile": mobile
    }
    const requestOptions={
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    };
    const URL = "https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP";
    const res = await fetch(URL,requestOptions);
    if(res.ok)
    {
        return res.json().then(val=>{
            console.log("OTP FETCH",val);
            txnID = val.txnId;
        })
    }
    console.log(txnID);
}
