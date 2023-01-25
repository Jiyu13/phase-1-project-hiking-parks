const API_KEY = ''
const BASE_URL = `https://developer.nps.gov/api/v1`
const parkUrl = `${BASE_URL}/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=${API_KEY}`


document.addEventListener("DOMContentLoaded", () => {


    const parksContainer = document.querySelector("#parks-collection")

    function getParkInfo(parkCode) {
        return fetch(`${BASE_URL}/parks?parkCode=${parkCode}&api_key=${API_KEY}`)
        .then(response => response.json())
    }
    


    function renderEachPark(park) {

        const parkCode = park["parkCode"]

        const parkTag = document.createElement("div")
        parkTag.className = "park"

        const nameTag = document.createElement("h3")
        nameTag.innerHTML = park["name"]
        parkTag.append(nameTag)

        
        getParkInfo(parkCode).then(parkInfo => {
            const imageTag = document.createElement("img")
            const details = parkInfo["data"][0]

            imageTag.src = details["images"][0]["url"]
            imageTag.style.width = "180px"
            imageTag.style.height = "180px"
            parkTag.prepend(imageTag)

            const fee = details["entranceFees"][0]["cost"]
            const p = document.createElement("p")
            if (fee === "0.00") {
                p.innerHTML = `$${fee}`
            } else {
                p.innerHTML = `$${fee}`
            }
            parkTag.append(p)


            // add event listener to parkTag
            parkTag.addEventListener("click", () => {
                parksContainer.style.display = "none";

                const detailsTag = document.querySelector("#details")

                // add close pop-up btn
                const closeBtn = document.createElement("button")
                closeBtn.setAttribute("id", "x")
                closeBtn.innerHTML = "X"
                closeBtn.addEventListener("click", () => {
                    detailsTag.innerHTML = ""
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


                // show descriotion
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

                detailsTag.append(closeBtn, detailImgTag, nameDiv, feeDiv, descriptionTag, operatingHoursTag, closureTag)

            })
                
        })

        parksContainer.append(parkTag)
        
        
    }

    let vaParks = []
    function getVAParks(parks) {
        
        parks.forEach(park => {
            if (park.states === "VA") {
                vaParks.push(park)
                renderEachPark(park)
            }
        })

        // add filter event listener on 'select' tag
        const select = document.querySelector("#park-dropdown")
        select.addEventListener("change", (event) => {
            const currentOption = event.target.value
            console.log(currentOption)
            filter(currentOption)
        })
        
        
        
        // filter function
        // #parks-collection > div:nth-child(1) > p
        function filter(currentOption) {
            const parksContainer = document.querySelector("#parks-collection")
            console.log(parksContainer)
            for (let i = 0; i<parksContainer.length; i++) {
                if (currentOption === "Price") {
                    console.log(parksContainer[i])
                    // parksContainer[i].style.display = ""
                } else {
                    parksContainer[i].style.display = "none"
                }
            }
        }
    }
   


    function getParks() {
        return fetch(parkUrl)
        .then(response => response.json())
        .then(data => data["data"][0]["parks"])
        
    }

    getParks().then(parks => getVAParks(parks))
})

