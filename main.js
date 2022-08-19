const DAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Calculating time
const calculateTime = () => {  
    let meridiem = '';
    let hour = '';
        if (new Date().getHours() > 12) {
            hour = new Date().getHours() - 12;
            meridiem = ' pm';
        } else {
            hour = new Date().getHours();
            meridiem = ' am';
        }
    let minute = '';
        if (new Date().getMinutes() < 10) {
            minute = '0' + new Date().getMinutes();
        } else {
            minute = new Date().getMinutes();
        }

    return `${hour}:${minute}${meridiem}`;
}

const capitalizeDescription = (description) => {
    description = description.split(' ');
    
    for (let i = 0; i < description.length; i++ ) {
        description[i] = description[i][0].toUpperCase().concat(description[i].substr(1));
    }
    return description = description.join(' ');
}

// Fetch API
const fetchAPI = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=80a85c03ef32aed0fddf03c326c06d1b`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (!response.ok){
                console.log('error hays');
            }
        })
        .then((API) => {
            // Temperature
            document.querySelector('#temperature_value').innerText = Math.round(API.main.temp);
            document.querySelector('#temperature_unit').innerText = '°C';

            // Date
            document.querySelector('#day').innerText = DAY[new Date().getDay() - 1];
            document.querySelector('#time').innerText = calculateTime();

            // Weather Description
            document.querySelector('.weather_description > span').innerText = capitalizeDescription(API.weather[0].description);

            // Temp Feels like
            document.querySelector('.feelsLike > span').innerText = Math.round(API.main.feels_like) + '°C';

            // Cloudiness 
            document.querySelector('.cloudiness > span').innerText = Math.round(API.clouds.all) + '% Cloudiness';
            
            // Location
            document.querySelector('.location > span').innerText = API.name;

            // Atmospheric Pressure
            document.querySelector('.atmosphericPressure > div > span').innerText = API.main.pressure + ' hPa';

            // Humidity
            document.querySelector('.humidity > div > span').innerText = API.main.humidity + '%';

            // Visibility
            document.querySelector('.visibility > div > span').innerText = API.visibility + ' meter';

            // Wind Speed
            document.querySelector('#wind_speed_value').innerText = API.wind.speed  + ' meter/sec';

            // Wind Direction
            document.querySelector('#wind_direction_value').innerText = API.wind.deg + ' degree';

            // Wind Gust
            document.querySelector('#wind_gust_value').innerHTML = API.wind.gust + ' meter/sec';
        })
}

// Getting the user location
const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject('err');
        }
    })
}
getUserLocation()
    .then((position) => {
        sessionStorage.setItem('latitude', position.coords.latitude);
        sessionStorage.setItem('longitude', position.coords.longitude);

        // Calling the function for fetch from a API
        fetchAPI(sessionStorage.getItem('latitude'), sessionStorage.getItem('longitude'));
    })
    .catch((err) => { 
        console.log(err.message);
    })
