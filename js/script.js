let apiData = null
const daysButtons = document.getElementById('days-buttons')
const cityDataset = document.getElementById('citynames')
const weatherImage = document.getElementById('weather-image-id')
let apiDays = null
let myChart = null
let city = null
let citiesArr = []

function getCities() {
    axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
        country: "Kazakhstan"
    }).then(res => {
        citiesArr = res.data.data
        console.log(citiesArr)
        setCityDataset(citiesArr)
    })
}

function getWeather() {
    city = document.getElementById('cityInput').value

    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=42cc6f1bcc090913a88f48a5eff93fb1`)
    .then(function(res) {
        console.log(res)

        apiData = res.data.list
        console.log(apiData)
        //console.log(res.data.forecast.forecastday)
        //console.log(apiData.length)
        
        apiDays = getApiDays()

        console.log(apiDays)
        addDaysButton()

        myChart = drawChart(0)
        setWeatherImage(0)
    })
    .catch(function(err){
        console.log(err)
    })
    /*
    axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
            country: "Kazakhstan"
    }).then(res => {
        console.log(res)
        
    })
    */
}

function setCityDataset(arr) {
    cityDataset.innerHTML = '';
    for(let i = 0; i < arr.length; i++)
    {
        cityDataset.innerHTML += 
        `
            <option value="${arr[i]}">
        `
    }  
}

function getApiDays() {
    let apiDays = []
    console.log(apiData.length)
    for (let i = 0; i < apiData.length;) {
        console.log('outside', i)
        let dayTimeTemp = {
            day: '',
            time: [],
            temp: [],
            weatherType: ''
        }

        dayTimeTemp.day = apiData[i].dt_txt.substring(0,10)
        dayTimeTemp.weatherType = apiData[i].weather[0].main
        /** clouds, snow, clear, rain */
        console.log(dayTimeTemp.weatherType)
        console.log(apiData[i].dt_txt)

        while(apiData[i].dt_txt.substring(0,10) === dayTimeTemp.day) {
            dayTimeTemp.time.push(apiData[i].dt_txt.substring(11))
            dayTimeTemp.temp.push(apiData[i].main.temp - 273.15)
            //console.log(dayTimeTemp.time)
            i++
            //console.log(dayTimeTemp.time)
            //console.log('inside', i)
            if(i == apiData.length) break
        }

        console.log(apiData.length)
        console.log('doing')
        apiDays.push(dayTimeTemp)
    }
    return apiDays
}


function changeDay(newDate) {
    console.log(apiDays)
    //console.log(apiData)
    for(let z = 0; z < apiDays.length; z++) {
        if(apiDays[z].day == newDate) {
            console.log('Same', apiDays[z].day, newDate, z)
            myChart.destroy()
            myChart = drawChart(z)

            setWeatherImage(z)

            break
        }
    }
}

function addDaysButton() {
    daysButtons.innerHTML = null
    for(let i = 0; i < apiDays.length; i++)
    {
        daysButtons.innerHTML += 
        `
            <button onclick=changeDay('${apiDays[i].day}')>${apiDays[i].day}</button>
        `
    }
    
}

function drawChart(index) {
    if (myChart !== null) {
        myChart.destroy()
    }
    
    let time = [
        ...apiDays[index].time
    ];
    
    console.log(index)
    //console.log('this shit', [...apiDays[index].temp])

    const data = {
        labels: time,
        datasets: [{
          label: `${city} ${apiDays[index].day}`,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [...apiDays[index].temp],
        }]
    };
    
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: false
        }
    };

    //console.log(apiData)
    
    return new Chart(
        document.getElementById('myChart'),
        config
    );
    
    
    
}

/*

let timeApiData = [apiData.hour.time]

*/

function setWeatherImage(i) {
    let weatherImg = apiDays[i].weatherType
    let wt = ''
    switch(weatherImg) {
        case 'Clouds':
            wt = 'cloudy.png'
            break
        case 'Snow':
            wt = 'snowy.png'
            break
        case 'Rain':
            wt = 'rainy.png'
            break
        default:
            wt = 'sunny.png'
    }
    weatherImage.innerHTML = 
        `
            <img src="img/${wt}" alt="">            
        `
}

getCities()