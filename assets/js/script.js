let app = {
    init: () => {
        document
            .getElementById('btnSearch')
            .addEventListener('click', app.fetchWeather);
    },
    fetchWeather: () => {
        //Values from Inputs
        let searchCity = document.getElementById('searchCity').value;
        let units = document.getElementById('units').value;
        let APIKey = "41d95db3e8a81f9edfd2e2e5a2abf949";
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=${units}&appid=${APIKey}`;
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
        let { name } = weatherData;
        let {
            icon,description
        } = weatherData.weather[0];
        let {
            temp,
            humidity
        } = weatherData.main;
        let {
            speed
        } = weatherData.wind;
        console.log(name, icon, description, temp, humidity, speed);
        


    }
}


app.init();