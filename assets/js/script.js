//const clearHistory = document.getElementById("#btnClearhistory");
let searchCity = document.getElementById('searchCity').value;
const uviEl = document.getElementById("uvi");
const todayweatherEl = document.getElementById("today-weather");
const fiveDayContainer = document.getElementById("fiveday-header");
const fiveDayEl = document.getElementById("weather-forecast");
const clearEl = document.getElementById("btnClearhistory");
const searchEl = document.getElementById("btnSearch");


let APIKey = "41d95db3e8a81f9edfd2e2e5a2abf949";


//START APP
let app = {
    init: () => {
        document
            .getElementById('btnSearch')
            .addEventListener('click', app.fetchWeather);
    },
    fetchWeather: () => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${APIKey}`;
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
        todayweatherEl.classList.remove("d-none");
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
        document.querySelector("#temp").innerHTML = Math.round(temp) + "°C";
        document.querySelector("#humidity").innerHTML = humidity + "%";
        document.querySelector("#wind").innerHTML = Math.round(speed) + " km/h";
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
        console.log("uvData")
        console.log(uvData)
        let {
            uvi
        } = uvData.current;
        let {
            lon,
            lat
        } = uvData;

        //UV Scale 1-2 Low GREEN //3-5 MED YELLOW //6-7 High ORANGE //8-10 Very High RED // 11+ EXTREME PURPLE
        uvi = Math.round(uvi)
        switch (uvi) {
            case 0:
            case 1:
            case 2:
                uviEl.innerHTML = "Low Intensity";
                uviEl.setAttribute("class", "badge badge-success");
                break;
            case 3:
            case 4:
            case 5:
                uviEl.innerHTML = "Medium Intensity";
                uviEl.setAttribute("class", "badge badge-warning");
                break;
            case 6:
            case 7:
                uviEl.innerHTML = "High Intensity";
                uviEl.setAttribute("class", "badge badge-danger");
                break;
            case 8:
            case 9:
            case 10:
                uviEl.innerHTML = "Very High Intensity";
                uviEl.setAttribute("class", "badge badge-info");
                break;
            case 11:
                uviEl.innerHTML = "Extreme Intensity";
                uviEl.setAttribute("class", "badge badge-primary");
                break;
        }
        console.log("Current UV After Rounding: " + uvi)
    
        let fiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;
        fetch(fiveDay)
            .then(resp => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then(fiveDayData => {
                app.forecast(fiveDayData);
            })
            .catch(console.err);
    },
    forecast: (fiveDayData) => {
        fiveDayContainer.classList.remove("d-none");
        console.log(fiveDayData)
        //Retrieve Data from fiveDayData  
        fiveDayData.list.forEach((item) => {
            if (item.dt_txt.includes("00:00:00")) {
                console.log("I am here");
                console.log(item);
                const newDiv = document.createElement("div");
                newDiv.setAttribute("class", "col-md-2 bg-primary text-white m-2 rounded");
                newDiv.innerHTML = item.dt_txt.replace("00:00:00", "");
                const temp = document.createElement("div");
                temp.innerHTML = "Temp: " + Math.round(item.main.temp) + "°C";
                const wind = document.createElement("div");
                wind.innerHTML = "Wind: " + Math.round(item.wind.speed) + "km/h";
                const humidity = document.createElement("div");
                humidity.innerHTML = "Humidity: " + Math.round(item.main.humidity) + "%";
                const icon = document.createElement("div");
                icon.innerHTML = "<img src='http://openweathermap.org/img/wn/" + item.weather[0].icon + ".png' alt=''>";
                //humidity.innerHTML = Math.round(item.main.humidity);
             
                newDiv.appendChild(humidity);
                newDiv.appendChild(wind);
                newDiv.appendChild(temp);
                newDiv.appendChild(icon);
                fiveDayEl.appendChild(newDiv);
             
            }

        })
    }
}
// temp / wind / humidity / icon  http://openweathermap.org/img/wn/${data.weather[0].icon}.png"


       // Get history from local storage if any
       searchEl.addEventListener("click", function () {
           const searchTerm = searchCity.value;
           app.showWeather(searchTerm);
           searchHistory.push(searchTerm);
           localStorage.setItem("search", JSON.stringify(searchHistory));
           renderSearchHistory();
       }),
        // Clear History button
        clearEl.addEventListener("click", function () {
            localStorage.clear();
            searchHistory = [];
            renderSearchHistory();
        }),
function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    }
app.init();