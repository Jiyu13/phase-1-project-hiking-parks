const url = `https://developer.nps.gov/api/v1/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=${API_KEY}`


function getVAParks(parks) {
    console.log("show va parks")
    let vaParks = []
    parks.forEach(park => {
        if (park.states === "VA") {
            vaParks.push(park)
        }
    })
}


function getParks() {
    return fetch(url)
    .then(response => response.json())
    .then(data => data["data"][0]["parks"])
    
}

const promise = getParks().then(parks => getVAParks(parks))
console.log(promise)