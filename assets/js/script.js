//const clearHistory = document.getElementById("#btnClearhistory");
let searchCity = document.getElementById('searchCity').value;
const uviEl = document.getElementById("uvi");
let APIKey = "41d95db3e8a81f9edfd2e2e5a2abf949";
let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${APIKey}`;

//START APP
let app = {
    init: () => {
        document
            .getElementById('btnSearch')
            .addEventListener('click', app.fetchWeather);
    },
    fetchWeather: () => {
        //        localStorage.setItem("search", JSON.stringify(searchHistory));
        console.log(url)
        fetch(url)
            .then(resp => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then(data => {
                app.showWeather(data);

            })
            .catch(console.err);
    },
    showWeather: (weatherData) => {

        console.log(weatherData); //Incoming Data
        //Extract Data

        let {
            name
        } = weatherData;
        let {
            lon,
            lat
        } = weatherData.coord;
        let {
            icon,
            description
        } = weatherData.weather[0];
        let {
            temp,
            humidity
        } = weatherData.main;
        let {
            speed
        } = weatherData.wind;
        //Pull Data from weatherData
        console.log(name, lon, lat, icon, description, temp, humidity, speed);
        //Set Data to HTML
        document.querySelector("#city").innerHTML = "Current Weather in " + name;
        document.querySelector("#icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector("#description").innerHTML = description;
        document.querySelector("#temp").innerHTML = "Temperature: " + Math.round(temp) + "°C";
        document.querySelector("#humidity").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector("#wind").innerHTML = "Wind Speed: " + Math.round(speed) + " km/h";
        //Set UVQueryURL 
        let uvQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
        fetch(uvQueryURL)
            .then(resp => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then(data => {
                app.showUV(data);
            })
            .catch(console.err);
    },
    showUV: (uvData) => {
        console.log(uvData)
        let {
            uvi
        } = uvData.current;
        
        
        //UV Scale 1-2 Low GREEN //3-5 MED YELLOW //6-7 High ORANGE //8-10 Very High RED // 11+ EXTREME PURPLE
         uvi = Math.round(uvi)
        switch (uvi) {
            case 0:
            case 1:
            case 2:
                uviEl.innerHTML = "UV Index: " + uvi + " Low";
                uviEl.setAttribute("class", "badge badge-success");
                break;
            case 3:
            case 4:
            case 5:
                uviEl.innerHTML = "UV Index: " + uvi + " Medium";
                uviEl.setAttribute("class", "badge badge-warning");
                break;
            case 6:
            case 7:
               uviEl.innerHTML = "UV Index: " + uvi + " High";
               uviEl.setAttribute("class", "badge badge-danger");
                break;
            case 8:
            case 9:
            case 10:
                uviEl.innerHTML = "UV Index: " + uvi + " Very High";
                uviEl.setAttribute("class", "badge badge-info");
                break;
            case 11:
               uviEl.innerHTML = "UV Index: " + uvi + " Extreme";
               uviEl.setAttribute("class", "badge badge-primary");
                break;
        }
        console.log("Current UV After Rounding: " + uvi)
        
        //uviEl.append(uvi);
        //document.querySelector("#uvi").innerHTML = "UV Index: " + Math.round(uvi);
        

    }
    // // Clear History button
    // clearHistory.addEventListener("click", function () {
    //     localStorage.clear();
    //     searchHistory = [];
    //     renderSearchHistory();
    // })
}
app.init();