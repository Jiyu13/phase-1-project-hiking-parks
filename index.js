const url = `https://developer.nps.gov/api/v1/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=${API_KEY}`

const parksContainer = document.createElement("div")
parksContainer.setAttribute("id", "parks-collection")

document.body.append(parksContainer)


function renderEachPark(park) {
    const parkTag = document.createElement("div")
    parkTag.className = "park"

    const nameTag = document.createElement("h3")
    const a = document.createElement("a")
    a.href = park["url"]
    a.innerHTML = park["fullName"]
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
    return fetch(url)
    .then(response => response.json())
    .then(data => data["data"][0]["parks"])
    
}

 getParks().then(parks => getVAParks(parks))
