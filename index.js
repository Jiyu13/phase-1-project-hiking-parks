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

        const nameTag = document.createElement("h3")
        const a = document.createElement("a")
        a.href = park["url"]
        a.innerHTML = park["name"]
        nameTag.append(a)
        parkTag.append(nameTag)
        

        getParkInfo(parkCode).then(parkInfo => {
            const imageTag = document.createElement("img")
            const details = parkInfo["data"][0]
            imageTag.src = details["images"][0]["url"]
            imageTag.style.width = "300px"
            imageTag.style.height = "300px"
            parkTag.prepend(imageTag)

            const fee = details["entranceFees"][0]["cost"]
            const operatingHour = details["operatingHours"]
            const p = document.createElement("p")
            if (fee === "0.00") {
                p.innerHTML = `Park Code:${parkCode} | Free`
            } else {
                p.innerHTML = `Park Code:${parkCode}| $${fee}`
            }
            parkTag.append(p)
            
        })

        
        


        

        // parkTag.addEventListener("click", () => {
        //     selectedPark.innerHTML = park.parkCode;
        //     fetch(getParkUrl(park.parkCode))
        //     .then(response => response.json())
        //     .then(data => 
        //         {
        //         const parkData = data.data[0];
        //         const images = parkData.images;
        //         selectedPark.innerHTML = parkData.description + "</p>" + `<img src="${images[0].url}" width=400 height=400/>`
        //         console.log(data)
        //     })
        // })

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

