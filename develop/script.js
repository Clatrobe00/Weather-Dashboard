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
                saveCity(city);//console.log(response);
                (cityName).text(response.name);
                tempSlot.text("Temperature: " + (response.main.temp));
                humiditySlot.text("Humidity: " + response.main.humidity);
                windSpeedSlot.text("Wind Speed: " + response.wind.speed);
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
        function test () {
          console.log('hello');
        }     
        function makeCityBtn (city) {
          $("<button>").text(city).addClass('success button cityBtn').on("click", runWeather).appendTo(savedCitiesSidebar)
        }

        function getForecast (city) {
          console.log(city);
          let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=" + 5 + "&units=imperial&appid=" + APIKey;
          $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
              console.log(typeof(response.list));
              Object.keys(response.list).forEach(key => {
	              //console.log("key: ", key);
                //console.log("Value: ", response.list[key]);
                
              });
            })
        }

        function getUV (lat, lon, name) {
          let queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey
          $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
              uvSlot.text("UV Index: " + response.value);
        })}

    let savedCities = JSON.parse(localStorage.getItem('cities')) || [];  
    if (savedCities.length) {
      getWeather(savedCities[savedCities.length - 1]);
      getForecast(savedCities[savedCities.length - 1]);
    } else {
      getWeather('Nashville');
      getForecast('Nashville');
    }