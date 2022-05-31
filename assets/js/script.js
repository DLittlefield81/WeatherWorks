let app = {
    init: () => {
        document
            .getElementById('btnSearch')
            .addEventListener('click', app.fetchWeather);
    },
    fetchWeather: () => {
        //Values from Inputs
        let searchCity = document.getElementById('searchCity').value;
        let APIKey = "41d95db3e8a81f9edfd2e2e5a2abf949";
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${APIKey}`;
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
    showWeather: (resp) => {
        console.log(resp); //Incoming Data
        let row = document.querySelector('.weather.row');
        row.innerHTML =  resp
        //     .map((day, numberOfDays) => {
        //         if (numberOfDays <= 4) {
        //           return 
        `<div class="card-body">
        <h3 class = "card-title" > Weather Label < /h3> <
            p class = "card-text" > High Temp Low Temp < /p> <
            p class = "card-text" > HighFeels like < /p> <
            p class = "card-text" > Pressure < /p> <
            p class = "card-text" > Humidty < /p> <
            p class = "card-text" > UV Index < /p> <
            p class = "card-text" > Precipitation < /p> <
            p class = "card-text" > Dew Point < /p> <
            p class = "card-text" > Wind speed and direction < /p> <
            p class = "card-text" > Sunrise < /p> <
            p class = "card-text" > Sunset < /p> <
            /div>`;
        //        };

    }
}
// .join(' ');

app.init();