let history = [];

//api key = 03a5b4d212ab01cae7f89d574ca482bc

function myFunction(event) {
    event.preventDefault();
    let search = document.querySelector("#name").value;
    history.push(search)
    localStorage.setItem('history', JSON.stringify(history))
    renderHistory();
    fetchWeather(search);
}

const fetchWeather = (search) => {
    console.log('called fetch')
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=03a5b4d212ab01cae7f89d574ca482bc`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            //showData(data)
            //showWeatherDetails(data)
            let lat = data.city.coord.lat;
            let lon = data.city.coord.lon;
            console.log('lat, lon:', lat, lon);
            fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=03a5b4d212ab01cae7f89d574ca482bc`)
                .then(response => response.json())
                .then(uvData => {
                    console.log('uvData:', uvData)
            let uvIndex = uvData.value;
            console.log('uvIndex:', uvIndex);
            localStorage.setItem('uvIndex',uvIndex);
            console.log(data)
            showData(data)
            showWeatherDetails(data)
                })
                .catch(error => {
                    console.log(error)
                })
        })
        .catch(error => {
            console.log(error)
        })
}

const showData = (data) => {
    
    let weatherInfo = data.list[0]
    if (weatherInfo.weather[0].main === 'Rain') {
        document.querySelector(".weather__icon").innerHTML = `<i class="fas fa-cloud-showers-heavy"></i>`
    }
    else if (weatherInfo.weather[0].main === 'Clouds') {
        document.querySelector(".weather__icon").innerHTML = `<i class="fas fa-cloud"></i>`
    }
    else if (weatherInfo.weather[0].main === 'Clear') {
        document.querySelector(".weather__icon").innerHTML = `<i class="fas fa-sun"></i>`
    }
    let fTemp = ((weatherInfo.main.temp - 273.15) * 9 / 5) + 32;
    document.querySelector(".location").textContent = `${data.city.name} ${weatherInfo.dt_txt.slice(0, 10)}`
    //document.querySelector(".weather__icon").innerHTML =  `${weatherInfo.weather[0].main === 'Rain' ? '<i class="fas fa-cloud-showers-heavy"></i>' : '<i class="fas fa-cloud"></i>' }`
    document.querySelector(".temp").textContent = ' ' + fTemp.toFixed(1) + ' Farenheit';
    document.querySelector(".hum").textContent = weatherInfo.main.humidity;
    document.querySelector(".wind").textContent = ' ' + weatherInfo.wind.speed;
    document.querySelector(".uv-index").textContent = localStorage.getItem('uvIndex');
}

const showWeatherDetails = (data) => {
    let weatherInfo = data.list[0]
    if (weatherInfo.weather[0].main === 'Rain') {
        forecastIcon = `<i class="fas fa-cloud-showers-heavy"></i>`
    }
    else if (weatherInfo.weather[0].main === 'Clouds') {
        forecastIcon = `<i class="fas fa-cloud"></i>`
    }
    else if (weatherInfo.weather[0].main === 'Clear') {
        forecastIcon = `<i class="fas fa-sun"></i>`
    }
    
    let container = document.getElementById("weather__container")
    container.innerHTML = ""
    let div = document.createElement('div');
    div.className = "weather__boxes";

    let list = data.list.filter((x, i) => i % 8 === 0).map((weatherInfo) => {
        let fTemp = ((weatherInfo.main.temp - 273.15) * 9 / 5) + 32;
        return `
            <div class="weather__box">
                <p> Date: ${weatherInfo.dt_txt.slice(0, 11)}</p>
                <p><img>${forecastIcon}</img> </p>
                <p> Temp: ${fTemp.toFixed(1)} &#8457;</p>
                <p> Humidity: ${weatherInfo.main.humidity} %</p>
            </div>
        `
    })

    div.innerHTML = list.join(" ")
    container.appendChild(div)
}

const renderHistory = () => {
    let box = document.getElementById('history__box')
    document.querySelector("#name").value = ""
    box.innerHTML = ""
    const ul = document.createElement('ul')

    ul.className = 'history__list'

    let list = history.map((item) => {
        return `
            <li onclick="fetchWeather('${item}')">${item}</li>
        `
    })

    let data = list.join(' ')
    ul.innerHTML = data

    box.appendChild(ul)
}

const startApp = () => {
    fetchWeather('London')
    if (localStorage.getItem('history')) {
        let data = JSON.parse(localStorage.getItem('history'))
        history = data
        renderHistory()
    }
}

document.onload = startApp()
