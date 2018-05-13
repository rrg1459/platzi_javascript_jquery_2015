(function() {

console.log("Clase 13 V2");

  var API_WORLDTIME_KEY = "f8c8af1bbac3456b82b184948181205"
  var API_WORLDTIME_URL = "https://api.worldweatheronline.com/premium/v1/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";

  var API_WEATHER_KEY = "3f09bace6eaba41fbe129f8390ef1913";
  var API_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
  var IMG_WEATHER_URL = "http://openweathermap.org/img/w/";

  var  today = new Date();
  var timeNow = today.toLocaleTimeString();
//var timeNow = today.toLocaleTimeString().split(" ")[0]; // sin el pm p am

// http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=3f09bace6eaba41fbe129f8390ef191322&mode=html

  var $body             = $("body");
  var $loader           = $(".loader");
  var nombreNuevaCiudad = $("[data-input='cityAdd']");
  var buttonAdd         = $("[data-buttom='add']");
  var buttonLoad        = $("[data-saved-cities]");

  var cities = [];
  var cityWeather = {};
  cityWeather.zone;
  cityWeather.icon;
  cityWeather.temp;
  cityWeather.temp_max;
  cityWeather.temp_min;
  cityWeather.main;

  $( buttonAdd ).on("click", addNewCity);

  $( nombreNuevaCiudad ).on("keypress", function(event) {
//  console.log(event.which);
    if(event.which == 13) {
      addNewCity(event);
    }
  });

  $( buttonLoad ).on("click", loadSavedCities);


  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCoords, errorFound);
  } else {
    alert("Por favor, actualiza tu navegador");
  }

  function errorFound(error) {
    alert("Un error ocurrió: " + error.code);
    // 0: Error desconocido
    // 1: Permiso denegado
    // 2: Posición no está disponible
    // 3: Timeout
  };

  function getCoords(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
//  console.log("Tu posición ... es: " + lat + "," + lon);
    $.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
  };

  function getCurrentWeather(data) {

//    console.log(data);
      cityWeather.zone     = data.name;
      cityWeather.icon     = IMG_WEATHER_URL + data.weather[0].icon + ".png";
      cityWeather.temp     = data.main.temp - 273.75;
      cityWeather.temp_max = data.main.temp_max - 273.75;
      cityWeather.temp_min = data.main.temp_min - 273.75;
      cityWeather.main     = data.weather[0].main;
 //   console.log(cityWeather);

      renderTemplate(cityWeather);

  };

  function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
  };
  
  function renderTemplate (cityWeather, locatltime) {
    var clone = activateTemplate("#template--city"); // como es un template dd html se tiene que poner #

    var timeToShow;
    if (locatltime) {
      timeToShow = locatltime.split(" ")[1];
    } else {  
      timeToShow = timeNow;
    }

    clone.querySelector("[data-time]").innerHTML = timeToShow;
    clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
    clone.querySelector("[data-icon]").src = cityWeather.icon;
    clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
    clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
    clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
    $( $loader ).hide();
    $( $body ).append(clone); // inyectar el codigo en el html

  }

  function addNewCity(event) {
    event.preventDefault(); // con esto quitamos la funcionalidad al submit y podemos programar lo que queremos que haga al hacer click con el mouse
    $.getJSON(API_WEATHER_URL + "q=" + $( nombreNuevaCiudad ).val(), getWeatherNewCity);
  }

  function getWeatherNewCity(data) {


console.log(API_WORLDTIME_URL + $( nombreNuevaCiudad ).val());


    $.getJSON(API_WORLDTIME_URL + $( nombreNuevaCiudad ).val(), function(response) {

    $(nombreNuevaCiudad).val("");

    //console.log(data);
    cityWeather = {};
    cityWeather.zone     = data.name;
    cityWeather.icon     = IMG_WEATHER_URL + data.weather[0].icon + ".png";
    cityWeather.temp     = data.main.temp - 273.75;
    cityWeather.temp_max = data.main.temp_max - 273.75;
    cityWeather.temp_min = data.main.temp_min - 273.75;
    cityWeather.main     = data.weather[0].main;

      renderTemplate(cityWeather, response.data.time_zone[0].localtime);

      cities.push(cityWeather);
      localStorage.setItem("cities", JSON.stringify(cities));

    });

  }

  function loadSavedCities(event) {
    event.preventDefault();

    var cities = JSON.parse( localStorage.getItem("cities") );

    function renderCities(cities) {
      cities.forEach(function(city) {
        renderTemplate(city);
      });
    };

    renderCities(cities);
  }
})();
