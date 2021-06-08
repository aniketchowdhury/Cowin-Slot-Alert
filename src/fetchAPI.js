const URLStates = "https://cdn-api.co-vin.in/api/v2/admin/location/states";

export const getStates = async() =>{
    const requestOptions={
    method: "GET"
}
    const res = await fetch(URLStates,requestOptions);
    if(res.ok)
    {
        return res.json().then(data=>{
            console.log(data.states);
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
            console.log(res.districts);
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
