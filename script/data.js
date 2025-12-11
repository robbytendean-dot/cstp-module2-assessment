const JSON_BIN_BASE_URL = 'https://api.jsonbin.io/v3';
const JSON_BIN_ID="";
const JSON_BIN_MASTER_KEY="";

function getLargestID(bucketList)
{
    let largestID = 0;
    for (let b of bucketList)
    {
        if (parseInt(b.id) > largestID)
        {
            largestID = b.id;
        }
    }
    return largestID;
}

async function loadData() {
    try{        
        const config = {
            headers: {
                "Content-Type":"application/json", //this line is not mandatory
                'X-Master-Key': JSON_BIN_MASTER_KEY
            }
        };
        const response = await axios.get(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}/latest`,config);
        console.log("loadData.response: ",response);    
        return response.data.record;    
    }
    catch(e)
    {
        console.log("Exception:",e);
        return []; //empty array so for loop won't crash
    }    
};

async function saveData(bucketList) {
    try{        
        const config = {
            headers: {
                "Content-Type":"application/json", //this line is not mandatory
                'X-Master-Key': JSON_BIN_MASTER_KEY
            }
        };
        //params:
        //1. URL
        //2. Array of Books
        //3. config
        const response = await axios.put(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}`,bucketList,config);
        console.log("saveData.response: ",response);   
        return response;    
    }
    catch(e)
    {
        console.log("Exception:",e);
        return {
            "error":e
        }
    }    
}

function addActivity(bucketList,country,city,activity,priority)
{
    let newID = getLargestID(bucketList) + 1; 
    const newActivity = {
        "id": newID,
        "country": country,
        "city": city,
        "activity": activity,
        "priority": priority,
        "done": 0
    }
    bucketList.push(newActivity);
    return saveData(bucketList);
}

function modifyActivity(bucketList,updateID,updateCountry,updateCity,updateActivity,updatePriority,updateDone)
{
    let errorMessage="";
    for(let b of bucketList)
    {
        if (b.id==updateID)
        {   
            //check if any error
            if (!["high","medium","low"].includes(updatePriority))
            {
                errorMessage += "Invalid Priority: " + updatePriority + "; Please use High/Medium/Low instead.\n";
            }
            if (!["done","pending"].includes(updateDone))
            {
                errorMessage += "Invalid Status: " + updateDone + "; Please use Done/Pending instead.\n";
            }
            if (errorMessage == "")
            {
                b.country=updateCountry;
                b.city=updateCity;
                b.activity=updateActivity;
                b.priority=updatePriority;
                b.done = updateDone == "done" ? 1 : 0;
            }
            break;
        }
    }
    if (errorMessage != "")
    {
        alert(errorMessage);
    }
    return saveData(bucketList);
}

function deleteActivity(bucketList,deleteID)
{
    let deleteIndex = -1;
    let currentIndex = 0;
    for(let b of bucketList)
    {
        if (b.id==deleteID)
        {
            deleteIndex=currentIndex;
            break; 
        }
        currentIndex++;
    }
    bucketList.splice(deleteIndex,1);
    return saveData(bucketList);
}