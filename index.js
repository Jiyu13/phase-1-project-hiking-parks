const BASE_URL = `https://developer.nps.gov/api/v1`
const parkUrl = `${BASE_URL}/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=${API_KEY}`


document.addEventListener("DOMContentLoaded", () => {

    const selectedPark = document.querySelector("#selectedPark")
    const parksContainer = document.createElement("div")
    parksContainer.setAttribute("id", "parks-collection")

    document.body.append(parksContainer)


    function getParkInfo(parkCode) {
        return fetch(`${BASE_URL}/parks?parkCode=${parkCode}&api_key=${API_KEY}`)
        .then(response => response.json())
    }
    

    function renderEachPark(park) {
        const parkCode = park["parkCode"]

        const parkTag = document.createElement("div")
        parkTag.className = "park"

        

        getParkInfo(parkCode).then(parkInfo => {
            const imageTag = document.createElement("img")
            imageTag.src = parkInfo["data"][0]["images"][0]["url"]
            imageTag.style.width = "200px"
            imageTag.style.height = "200px"

            parkTag.prepend(imageTag)
        })

        
        const nameTag = document.createElement("h3")
        const a = document.createElement("a")
        a.href = park["url"]
        a.innerHTML = park["name"]
        nameTag.append(a)


        parkTag.append(nameTag)


        parksContainer.append(parkTag)
    }


    function getVAParks(parks) {
        let vaParks = []
        parks.forEach(park => {
            if (park.states === "VA") {
                vaParks.push(park)
                renderEachPark(park)
            }
        })
    }


    function getParks() {
        return fetch(parkUrl)
        .then(response => response.json())
        .then(data => data["data"][0]["parks"])
        
    }

    getParks().then(parks => getVAParks(parks))
})

