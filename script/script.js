document.addEventListener("DOMContentLoaded", async function() {
    const bucketList = await loadData();
    renderBucket(bucketList);
    
    let addTodoBtn = document.querySelector("#addActivity");
    addTodoBtn.addEventListener("click", async function(){
        //get country
        let country =document.querySelector("#countryInput");
        let countryValue = country.value;
        //get city
        let city =document.querySelector("#cityInput");
        let cityValue = city.value;
        //get activity
        let activity =document.querySelector("#activityInput");
        let activityValue = activity.value;
        //get priority
        let priority =document.querySelector("#priorityInput");
        let priorityValue = priority.value;
        //add todo
        let response = await addActivity(bucketList,countryValue,cityValue,activityValue,priorityValue);
        console.log("addTodoBtn.click:response.status: ",response["status"]);
        console.log("addTodoBtn.click:response.error: ",response["error"]);
        //check if success
        if (response["status"]=="200" && !response["error"])
        {
            let saveStatus = document.querySelector("#saveStatus");
            saveStatus.className="text-success";
            saveStatus.innerText = "Activity is saved successfully"
            //reset input
            country.value="";
            city.value="";
            activity.value="";
            priority.value="low";
        }
        else
        {
            //if error show message
            let errorStatus = document.querySelector("#saveStatus");
            errorStatus.className="text-danger";
            errorStatus.innerText = "Error: " + response["error"];
        }
        //render todo list again
        renderBucket(bucketList);        
    });
});

//parameter is bucket
function renderBucket(bucketList)
{
    let bucketContent = document.querySelector("#bucketContent");

    //remove existing childs first
    bucketContent.innerHTML="";

    //generate child elements
    for (let t of bucketList) {
        let rowElement = document.createElement("div");
        rowElement.className="row gy-3 pb-1 border-bottom border-dark text-start pb-3 pt-3";
        rowElement.innerHTML=`
            <div class="col-6 col-md-2">${t.country}</div>
            <div class="col-6 col-md-2">${t.city}</div>
            <div class="col-12 col-md-4">${t.activity}</div>
            <div class="col-6 col-md-1"> 
                <span class="badge ${t.priority == "high" ? 
                    "bg-danger" : (t.priority == "medium" ? "bg-warning" : "bg-success")}">
                    ${pascalCase(t.priority)}
                </span> 
            </div>
            <div class="col-6 col-md-1">
                <span class="badge ${t.done ? "bg-success" : "bg-warning"}">
                    ${t.done ? "Done" : "Pending"}
                </span>
            </div>
            <div class="col-12 col-md-2"> 
                <button class="btn btn-primary btn-sm edit-button">Edit</button>
                <button class="btn btn-danger btn-sm delete-button">Delete</button>
            </div>
        `;
        
        //add click event to edit button
        let editBtn = rowElement.querySelector(".edit-button");
        editBtn.addEventListener("click", function() {
            let newCountry = prompt("Update Country: ", t.country);
            if (newCountry != null)
            {
                let newCity = prompt("Update City: ", t.city);
                if (newCity != null)
                {
                    let newActivity = prompt("Update Activity: ", t.activity);
                    if (newActivity!=null)
                    {
                        let newPriority = prompt("Update Priority (High/Medium/Low): ", t.priority).toLowerCase();
                        if (newPriority != null)
                        {
                            let newDone = prompt("Update Status (Done/Pending):", t.done == 1 ? "Done" : "Pending").toLowerCase();
                            if (newDone != null)
                            {
                                modifyActivity(bucketList,t.id,newCountry,newCity,newActivity,newPriority,newDone);
                                renderBucket(bucketList);
                            }
                        }
                    }
                }
            }
        });

        //add click event to delete button        
        let deleteBtn = rowElement.querySelector(".delete-button");
        deleteBtn.addEventListener("click", function() {
            deleteActivity(bucketList,t.id);
            renderBucket(bucketList);
        });

        bucketContent.appendChild(rowElement);
    }   
}

function pascalCase(inputText)
{
    let newText = "";
    if (inputText)
    {
        for (let i=0;i<inputText.length;i++)
        {
            newText += i==0 ? inputText[i].toUpperCase() : inputText[i];
        }
    }
    return newText;
}