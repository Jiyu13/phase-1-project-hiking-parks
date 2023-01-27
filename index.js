const BASE_URL = `https://developer.nps.gov/api/v1`
const parkUrl = `${BASE_URL}/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=${API_KEY}`

document.addEventListener("DOMContentLoaded", () => {
    
    const newParkForm = document.querySelector("#new-park")

    getParks()
    .then(parks => getVAParks(parks))
    .then(vaParks => vaParks.forEach(jsonPark => renderPark(jsonPark)))

    // add new park btn
    newParkForm.style.display = "none"

    const addParkBtn = document.querySelector("#add-park")
    addParkBtn.addEventListener("click", () => {
        newParkForm.style.display = ""
        newParkForm.addEventListener("submit", (event) => {
            event.preventDefault()
            storeNewPark(event.target)
            newParkForm.reset()
        })
    })
    

    // checkbox
    const freeCheckBox = document.querySelector(".free")
    freeCheckBox.addEventListener('change', () => {
        const costs = document.getElementsByClassName("show-fee")

        for (let i = 0; i< costs.length; i++) {
            const arrowImg = costs[i].parentNode.previousSibling
            if (freeCheckBox.checked && costs[i].innerHTML !== "$0.00") {
                arrowImg.style.display = "none"
            } else if (!freeCheckBox.checked) {
                arrowImg.style.display = ""
            }
        } 
    })
    newParks = JSON.parse(localStorage.getItem("parks"))

    if(newParks === null) {
        newParks = []
    }
    newParks.forEach(park => newCard(park))
})


// create new card
function newCard(parkData) {
    const parkObj = {
        code: null,
        name: parkData["Park Name"],
        description: "You added this park!",
        designation: parkData["Category"],
        latitude: parkData["latitude"],
        longitude: parkData["longtitude"],
        image1Url: parkData["Park Image"],
        image2Url: parkData["Park Image"],
        entranceFees: "???",
        operatingHours: null,
        operatingHourExceptions: null
    }
    createParkContainer(parkObj)

}

let newParks = []


// post new park/trail using localStorage
function storeNewPark(newPark) {
    const formData = new FormData(newPark)
    const obj = Object.fromEntries(formData)

    newParks.push(obj)

    const json = JSON.stringify(newParks)
    localStorage.setItem("parks", json)
    newCard(obj)

}


// localStorage.setItem("parks", null) // clear newParks item


// get park info
function getParkInfo(parkCode) {
    return fetch(`${BASE_URL}/parks?parkCode=${parkCode}&api_key=${API_KEY}`)
    .then(response => response.json())
}

function getParks() {
    return fetch(parkUrl)
    .then(response => response.json())
    .then(data => data["data"][0]["parks"])
}


// store park type and add select feature
function createparkType(designations) {
    const select = document.querySelector(".park-type")
    for (let each of designations) {
        const option = document.createElement("option")
        if (each) {
            
            option.innerHTML = each
            option.value = each
            select.append(option)
        } else {
            option.innerHTML = "Uncategorized "
            option.value = "Uncategorized"
            select.append(option)
        }
    }

    // filter park type based on selected designation
    select.addEventListener("change", (event) => {
        const currentOption = event.target.value
        const parks = Array.from(document.querySelectorAll(".arrow"))  // get all elements with class "arrow" and turn in to array
        const matchingParks = parks.filter(park => park.dataset.designation === currentOption)
        const unmatchingParks = parks.filter(park => park.dataset.designation !== currentOption)
        matchingParks.forEach(park => park.style.display = "")
        unmatchingParks.forEach(park => park.style.display = "none")
        if (currentOption === "Park Type") {
            parks.forEach(park => park.style.display = "")
        }
        
    })
}

let vaParks = []
let designations = []

function getVAParks(parks) {
    parks.forEach(park => {
        if (park.states === "VA") {
            vaParks.push(park)
            const designation = park["designation"]
            if (!designations.includes(designation)) {
                designations.push(designation)
            }

        }
    })
    createparkType(designations, vaParks)
    
    return vaParks
}


function createDetailDiv(park) {
    const parkTag = document.createElement("div")
    parkTag.setAttribute("class", "park")

    const imageTag = document.createElement("img")
    imageTag.setAttribute("class", "park-image")
    

    imageTag.src = park.image1Url
    imageTag.style.width = "180px"
    imageTag.style.height = "150px"

    const nameTag = document.createElement("h4")
    nameTag.innerHTML = park.name


    parkTag.append(imageTag, nameTag)

    const showFee = document.createElement("p")
    showFee.setAttribute("class", "show-fee")
    const fee = park.entranceFees
    if (fee === "0.00") {
        showFee.innerHTML = `$${fee}`
    } else {
        showFee.innerHTML = `$${fee}`
    }

    // more info link
    const moreInfo = document.createElement("button")
    moreInfo.setAttribute("class", "more-info")
    moreInfo.innerHTML = "More Info"

    parkTag.append(showFee, moreInfo)
    return parkTag

}


// show operating hours
function operatingHours(park) {

    const hourTable = document.createElement("div")
    hourTable.setAttribute("class", "hour-table")
    

    const openingHoursDiv = document.createElement("div")
    openingHoursDiv.setAttribute("class", "opening-hours")
    openingHoursDiv.innerHTML = "Operating Hours";
    
    // toggle hour table
    hourTable.addEventListener("click", () => {
        hourTable.classList.toggle("show-hours")
    })

    hourTable.append(openingHoursDiv)

    const openingUl  = document.createElement("ul")
    openingUl.setAttribute("class", "hour-list")
    hourTable.append(openingUl)
    const hours = park.operatingHours
    const sunday = hours["sunday"]
    const monday = hours["monday"]
    const tuesday = hours["tuesday"]
    const wednesday = hours["wednesday"]
    const thursday = hours["thursday"]
    const friday = hours["friday"]
    const saturday = hours["saturday"]
    const hoursList = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]

    for (let i=1; i <= Object.keys(hours).length; i++) {
        const openingli = document.createElement("li")
        openingli.value = i
        openingUl.append(openingli)
    }
    const lis = hourTable.getElementsByTagName("li")

    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    for (let i=0; i < lis.length; i++) {
        lis[i].textContent = `${allDays[i]}: ${hoursList[i]}`
    }

    return hourTable
}


// Closure:
function closure(park) {
    const closureTable = document.createElement("div")
    closureTable.className = "closure-table"
    closureTable.innerHTML = "CLOSURES EXCEPTIONS"

    // toggle closure table
    closureTable.addEventListener("click", () => {
        closureTable.classList.toggle("show-closure")
    })

    const closureUl  = document.createElement("ul")
    closureUl.className = "closure-list"
    closureTable.append(closureUl)

    const exceptions = park.operatingHourExceptions
    if (exceptions.length !== 0) {
        for (let i=0; i < Object.keys(exceptions).length; i++) {
            const closureli = document.createElement("li")
            closureli.value = i
            closureli.innerHTML = exceptions[i]["name"]
            closureUl.append(closureli)
        }
    } else {
        const moreInforLink = document.createElement("a")
        moreInforLink.href = `https://www.nps.gov/${park.code}/planyourvisit/hours.htm`
        
        moreInforLink.innerHTML = 'More info'
        closureUl.append(moreInforLink)
    }
    return closureTable
}


// set latitude
function latitudeToPx(latitude) {
    const latPx = .0038; //this is the number of degrees latitude/pixel
    const latDiff = 39.2 - latitude;
    const latitudeInPx = latDiff/latPx;
    return latitudeInPx

}

 // set longtitude
function longitudeToPx(longitude) {
    const longPx = .00517; //this is the number of degrees longitude/pixel
    const longDiff = Math.abs(-83.3 - (longitude));
    const longitudeInPx = longDiff/longPx;
    return longitudeInPx

}

function createParkContainer(park) {
    // show arrows
    const mapContainer = document.querySelector("#map-container");

    const parkTag = createDetailDiv(park)

    // create container for park info
    const parkContainer = document.createElement("div");
    parkContainer.setAttribute("class", "arrow")
    if (park.designation) {
        parkContainer.dataset.designation = park.designation    // html--->data-designation=details["designation"]
    } else {
        parkContainer.dataset.designation = "Uncategorized"
    }


    const latitude = park.latitude;
    const longitude = park.longitude;


    parkContainer.style.top = latitudeToPx(latitude)
    parkContainer.style.left = longitudeToPx(longitude)


        //create arrow image
        const parkSign = document.createElement("img")
        parkSign.setAttribute("class", "arrowImg")
        
        console.log(park["designation"])
        //change pin color by park type
        if (park["designation"] === "State Park") {
            parkSign.src = "Images\\Map-Pin-Orange.png"
        } else if (park["designation"] === "Local Park") {
            parkSign.src = "Images\\Map-Pin-Blue.png"
        } else if (park["designation"] === "Trail") {
            parkSign.src = "Images\\Map-Pin-Brown.png"
        } else {
            parkSign.src = "Images\\Map-Pin-Green.png"
        }
        
        

    // add arrow image and the park card div to the container
    parkContainer.appendChild(parkSign)
    parkContainer.appendChild(parkTag)
    mapContainer.appendChild(parkContainer)

    // hide park tag by default
    parkTag.style.display = "none"


    // add event listener to show/hide park card when hovering over the park sign
    parkContainer.addEventListener("mouseover", () => parkTag.style.display = "inline-block")
    parkContainer.addEventListener("mouseout", () => parkTag.style.display = "none")


    // add event listener to parkTag
    parkTag.addEventListener("click", () => {
        const detailsTag = document.querySelector("#details")

        // create contents div for detail text content
        const contents = document.createElement("div")
        contents.setAttribute("class", "contents")

        detailsTag.style.display = "block"

        // add close pop-up btn
        const closeBtn = document.createElement("button")
        closeBtn.setAttribute("id", "x")
        closeBtn.innerHTML = "X"
        closeBtn.addEventListener("click", () => {
            detailsTag.innerHTML = ""
            detailsTag.style.display = "none"
        })


        // show image
        const detailImgTag = document.createElement("img")
        detailImgTag.setAttribute("id", "detail-image")
        detailImgTag.src = park.image2Url

        // show park name
        const nameDiv = document.createElement("div")
        nameDiv.setAttribute("id", "park-name")
        nameDiv.innerHTML = park["name"]

        // show fee
        const feeDiv = document.createElement("div")
        const fee = park.entranceFees
        feeDiv.innerHTML = `Entrance Fees: $${fee}`


        // show description
        const descriptionTag = document.createElement("p")
        descriptionTag.setAttribute("class", "description")

        // toggle description with btn
        const readMoreBtn = document.createElement("button")
        readMoreBtn.setAttribute("class", "read-more-btn")
        readMoreBtn.innerHTML = "Read More"
        readMoreBtn.addEventListener("click", () => {
            descriptionTag.classList.toggle("show-more")  // add "show more" class to description tag when click btn
            if (readMoreBtn.innerHTML === "Read More") {
                readMoreBtn.innerHTML = "Read Less"
            } else {
                readMoreBtn.innerHTML = "Read More"
            }
        })
        descriptionTag.innerHTML = `${park.description.substring(0, 100)} 
                                   <span class='more-text'>${park.description.substring(100)}</span>
                                   `
        descriptionTag.append(readMoreBtn)

        const hourTable = (park.operatingHours != null) ? operatingHours(park) : null

        const closureTable = (park.operatingHourExceptions != null) ? closure(park) : null
        detailsTag.append(detailImgTag)

        contents.append(closeBtn, nameDiv, feeDiv, descriptionTag, hourTable, closureTable)
        detailsTag.append(contents)
    })
}

function renderPark(park) {
    const parkCode = park["parkCode"]

    getParkInfo(parkCode)
    .then(parkInfo => {
        const details = parkInfo["data"][0]
        const parkObj = {
            code: parkCode,
            name: details["name"],
            description: details["description"],
            designation: details["designation"],
            latitude: details["latitude"],
            longitude: details["longitude"],
            image1Url: details["images"][0]["url"],
            image2Url: details["images"][1]["url"],
            entranceFees: details["entranceFees"][0]["cost"],
            operatingHours: details["operatingHours"][0]["standardHours"],
            operatingHourExceptions: details["operatingHours"][0]["exceptions"]
        }
        createParkContainer(parkObj);
    })
}