    const APIKey = "43b5b86a3681230a45961cc32737a765";
    const citySearch = $('#citySearchID');
    const savedCitiesSidebar = $('#savedCitiesSidebar');
    let cityName = $("#cityName");
    let tempSlot = $("#tempSlot");
    let humiditySlot = $("#humiditySlot");
    let windSpeedSlot = $("#windSpeedSlot");
    let uvSlot = $('#uvSlot');
    var searchedCities = [];
    const forecastCardCell = $('#forecastCardCell');

    const runWeather = function () {
        getWeather((this).innerHTML);
        getForecast((this).innerHTML);
    };

    getSavedCities();

    $("#citySearchBtn").click(function (){
        const city = (citySearch).val();
        getWeather(city);
        getForecast(city);
    })

    function getWeather(city){
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                saveCity(city);
                console.log(response);
                (cityName).text(response.name + " " + (moment().format("M/D/YY")));
                tempSlot.text("Temperature: " + (Math.floor(response.main.temp)) +'°F');
                humiditySlot.text("Humidity: " + response.main.humidity + '%');
                windSpeedSlot.text("Wind Speed: " + response.wind.speed + ' MPH');
                let imageUrl = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
                $("#weatherIcon").attr("src", imageUrl);
                let lat = response.coord.lat;
                let lon = response.coord.lon;
                let name = response.name
                getUV(lat, lon, name);
            })
        .catch(function(err){console.log(err)});
    }

    function saveCity (city) {
        if (searchedCities.indexOf(city) === -1) {
            searchedCities.push(city);
            makeCityBtn(city);
        } else {
            console.log("already got 'im!")
            }
        window.localStorage.setItem("cities", JSON.stringify(searchedCities))        
    }

    function getSavedCities () {
        let savedCities = JSON.parse(localStorage.getItem('cities')) || [];
        for (let i = 0; i < savedCities.length; i++) {
            searchedCities.push(savedCities[i]);
            makeCityBtn(savedCities[i]);  
        }
    };
  
    function makeCityBtn (city) {
        $("<button>").text(city).addClass('secondary button cityBtn').on("click", runWeather).appendTo(savedCitiesSidebar)
    };

    function getForecast (city) {
        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=" + 5 + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                forecastCardCell.empty();
                const forecastList = response.list
                Object.keys(forecastList).forEach(key => {
                    console.log("Value: ", forecastList[key]);
                    let FCCard = $('<div>').addClass('card flex-align-self')
                    let cardHead = $('<h5>').text((moment().add((parseInt(key) + 1), 'days').format("M/D/YY"))).appendTo(FCCard);
                    let iconDiv = $('<div>').addClass('iconDiv cell small-auto').appendTo(FCCard);
                    let iconUrl = "http://openweathermap.org/img/wn/" + forecastList[key].weather[0].icon + ".png";
                    let iconImg = $("<img>").addClass("iconImg").attr("src", iconUrl).appendTo(iconDiv);
                    let temp = $('<div>').text("Temp: " + Math.floor(forecastList[key].main.temp) + '°F').appendTo(FCCard);
                    let humidity = $('<div>').text("Humidity: " + forecastList[key].main.humidity + '%').appendTo(FCCard);
                    forecastCardCell.append(FCCard);
                  });   
        })
    };

    function getUV (lat, lon, name) {
        let queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey
        $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
              uvSlot.text("UV Index: " + response.value);
              if (response.value <= 3) {
                  uvSlot.css("background-color", "green");
              } else if (response.value >= 8) {
                    uvSlot.css("background-color", "red");
              } else if (response.value > 3 && response.value <= 6) {
                    uvSlot.css("background-color", "yellow");
              } else {
                uvSlot.css("background-color", "orange");
              }
        })
    }

    let savedCities = JSON.parse(localStorage.getItem('cities')) || [];  
    if (savedCities.length) {
      getWeather(savedCities[savedCities.length - 1]);
      getForecast(savedCities[savedCities.length - 1]);
    } else {
      getWeather('Nashville');
      getForecast('Nashville');
    }
