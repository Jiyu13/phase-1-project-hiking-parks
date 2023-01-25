const BASE_URL = `https://developer.nps.gov/api/v1`
const parkUrl = `${BASE_URL}/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=${API_KEY}`

document.addEventListener("DOMContentLoaded", () => {
    getParks()
    .then(parks => getVAParks(parks))
    .then(vaParks => vaParks.forEach(park => renderPark(park)))

    // checkbox
    const freeCheckBox = document.querySelector("#free")
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
    });

})



// create pop-up
function popUpDetails() {
    const popup = document.querySelector("details")
    details.className.toggle("show")
}

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


function getVAParks(parks) {
    let vaParks = []
    
    parks.forEach(park => {
        if (park.states === "VA") {
            vaParks.push(park)
            renderPark(park)
        }
    })
    return vaParks

}


function createDetailDiv(details, parkName) {
    const parkTag = document.createElement("div")
    parkTag.setAttribute("class", "park")

    const imageTag = document.createElement("img")
    imageTag.src = details["images"][0]["url"]
    imageTag.style.width = "180px"
    imageTag.style.height = "180px"


    const nameTag = document.createElement("h3")
    nameTag.innerHTML = parkName


    parkTag.append(imageTag, nameTag)

    const showFee = document.createElement("p")
    showFee.setAttribute("class", "show-fee")
    const fee = details["entranceFees"][0]["cost"]
    if (fee === "0.00") {
        showFee.innerHTML = `$${fee}`
    } else {
        showFee.innerHTML = `$${fee}`
    }


    parkTag.append(showFee)
    return parkTag

}


function renderPark(park) {

    const parkCode = park["parkCode"]
    
    getParkInfo(parkCode)
    .then(parkInfo => {

        const details = parkInfo["data"][0]
        const parkTag = createDetailDiv(details, park["name"])
        // console.log(parkTag)


        //////////////////////////////////////////////////////////////
        // show arrows
        const mapContainer = document.querySelector("#map-container");
       
        // create container for park info
        const parkContainer = document.createElement("div");
        parkContainer.setAttribute("class", "arrow")
        parkContainer.style.top = Math.random() * 400
        parkContainer.style.left = Math.random() * 400 + 300

        //create arrow image
        const parkSign = document.createElement("img")
        parkSign.setAttribute("class", "arrowImg")
        parkSign.src = "Images\\pngwing.png"


        // add arrow image and the park card div to the container
        parkContainer.appendChild(parkSign)
        parkContainer.appendChild(parkTag)
        mapContainer.appendChild(parkContainer)

        // hide park tag by default
        parkTag.style.display = "none"


        // add event listener to show/hide park card when hovering over the park sign
        parkContainer.addEventListener("mouseover", () => parkTag.style.display = "inline-block")
        parkContainer.addEventListener("mouseout", () => parkTag.style.display = "none")
        /////////////////////////////////////////////////////////////////////


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
            detailImgTag.src = details["images"][1]["url"]
            
            // show park name
            const nameDiv = document.createElement("div")
            nameDiv.setAttribute("id", "park-name")
            nameDiv.innerHTML = park["name"]

            // show fee
            const feeDiv = document.createElement("div")
            const fee = details["entranceFees"][0]["cost"]
            feeDiv.innerHTML = `Entrance Fees: $${fee}`


            // show description
            const descriptionTag = document.createElement("p")
            descriptionTag.setAttribute("id", "description")
            descriptionTag.innerHTML = details["description"]

            // show operating hours
            const operatingHoursTag = document.createElement("div")
            operatingHoursTag.setAttribute("id", "hour-table")
            operatingHoursTag.innerHTML = "Operating Hours:"

            const openingUl  = document.createElement("ul")
            operatingHoursTag.append(openingUl)
            const hours = details["operatingHours"][0]["standardHours"]
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
            const lis = operatingHoursTag.getElementsByTagName("li")

            const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            for (let i=0; i < lis.length; i++) {
                lis[i].textContent = `${allDays[i]}: ${hoursList[i]}`
            }


            // Closures:
            const closureTag = document.createElement("div")
            closureTag.id = "closure-table"
            closureTag.innerHTML = "CLOSURES EXCEPTIONS"

            const closureUl  = document.createElement("ul")
            closureTag.append(closureUl)

            const exceptions = details["operatingHours"][0]["exceptions"]
            for (let i=0; i < Object.keys(exceptions).length; i++) {
                const closureli = document.createElement("li")
                closureli.value = i
                closureli.innerHTML = exceptions[i]["name"]
                closureUl.append(closureli)
            }

            detailsTag.append(detailImgTag)

            contents.append(closeBtn, nameDiv, feeDiv, descriptionTag, operatingHoursTag, closureTag)
            detailsTag.append(contents)

        })
            
    })  
}