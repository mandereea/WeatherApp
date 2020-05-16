const url = 'https://api.openweathermap.org/data/2.5/onecall?'     //?lat={lat}&lon={lon}     &appid={your api key}

const fetchApi = new FetchApi(url)

if(!navigator.geolocation) {
    console.log("refused")
  } else {
      //retrieving and using coordinates to get weather data
    navigator.geolocation.getCurrentPosition(success, error); 
  }

//fct for successfully retrieving coordinates 
function success (position){
     
        const lat = position.coords.latitude.toFixed(2);
        const long = position.coords.longitude.toFixed(2);
        
        console.log("lat and long are: ",lat, long);
        //retrieving weather data for these coordinates + using it to render on page
        const weatherResponse = getWeatherHere(lat,long);
        
        weatherResponse.then((response)=>{
            //const temp = response.current.temp;
           displayShortDataTitle(lat,long,response.current.temp)
           const current = response.current;
           displaySunRiseSet(current);
           const hourly = response.hourly;
           displayHourlyComplete(hourly)
           
        })
        //console.log(weatherResponse);
}
//fct for error
function error(){
    console.log("error")
}

//requesting weather data from server based on coordinatees
async function getWeatherHere(lat, long){

    const currentWeather = await fetchApi.getApiResponse(lat,long);
    return currentWeather;
}

//fct for rendering lat, long and temp -C/F in header
function displayShortDataTitle(lat, long, temp){
    const shortData = document.querySelector('.short-data');
    const celsius = toCelsius(temp) // ((5/9) * (temp - 32)).toFixed(2);
    const fahr = toFahrenheit(temp);
    shortData.innerHTML = `for lat: ${lat} & long ${long}, today temperature is ${celsius}&deg;C / ${fahr}F`
}
//fct to render sunrise / sunset data
function displaySunRiseSet(currentObj){
    const wrapper = document.querySelector('.sun-wrapper');
    
    const rise = timeConverter(currentObj.sunrise)[3] +"." + timeConverter(currentObj.sunrise)[4];
    const sunRise = document.createElement('span');
    sunRise.classList.add('sunrise');
    sunRise.innerText = `Sun rises at ${rise}`;

    const set = timeConverter(currentObj.sunset)[3] +"." + timeConverter(currentObj.sunset)[4];
    const sunSet = document.createElement('span');
    sunSet.classList.add('sunset');
    sunSet.innerText = `Sun sets at ${set} o'clock.`;    

    wrapper.appendChild(sunRise);
    wrapper.appendChild(sunSet);
}


//fct for rendering one hour forecast Div
function displayHourlyDiv(hourObj){
    const hour = timeConverter(hourObj.dt)[3]
    const iconId = hourObj.weather[0].icon;
    const iconSource =`http://openweathermap.org/img/wn/${iconId}@2x.png`
    const celsius = toCelsius(hourObj.temp)
    const celsiusFeel = toCelsius(hourObj.feels_like);
    const sky = capitalize(hourObj.weather[0].description);
    
    const hourlyDiv = document.createElement('div');
    hourlyDiv.classList.add("hour-div");

    hourlyDiv.innerHTML = `<span class="time">${hour}.00</span>
                            <img src="${iconSource}"class="icon"/>
                           <span class="hour-temp">${celsius}&deg;C</span>
                           <span class ="hour-temp">Real feel ${celsiusFeel}&deg;C</span>
                           <span class="sky">${sky}</span>`
    //console.log(celsius, icon, celsiusFeel, sky);
    return hourlyDiv;
}

//fct for rendering all hourly Divs
 function displayHourlyComplete(array){
    for(let i=0; i<array.length; i++){
       const container = document.querySelector('.hour-forecast');
        const hourlyDiv =  displayHourlyDiv(array[i]);
        container.appendChild(hourlyDiv);
        
    }
}

//HELPERS
//temperature converting fct
const toCelsius = temp => Math.floor(temp - 273.15);
const toFahrenheit = temp => Math.floor(temp * 9/5 - 459.67);
//capitalize fct
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)
//converting timestamp fct
function timeConverter(timestamp){
    var a = new Date(timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = a.getDate();
    var hour = a.getHours();
    if(hour<10){
        hour = "0"+hour;
    }
    var min = a.getMinutes();
    //var sec = a.getSeconds();
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var timeData =[year, month, day, hour, min]
    return timeData;
  }
  //console.log(timeConverter(0));