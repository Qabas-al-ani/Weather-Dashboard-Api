// created a variables that i will use to create the functionality of javascript
var userInputEl = document.getElementById("user-input");
var inputFormEl = document.getElementById("input-form");
var showingResultsDiv = document.getElementById("showing-results");
var citiesDiv = document.getElementById("cities");
var apiKey = "5259fc0e54d33813248bd91f72b795bd";

// I created two functions! first one that will not make the page reload… …and second one will get the info from the user and save it to the local storage and save in an array so we can see it later when it needed
var userFormHandler = function (event) {
  event.preventDefault();

  var userInput = userInputEl.value.trim();

  if (localStorage.getItem("searchHistory") == null) {
    localStorage.setItem("searchHistory", "[]");
  }

  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  searchHistory.unshift(userInput);

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  userInputEl.value = "";

  renderHistory();
  getWeatherApi(userInput);
};

// added render history function that will render cities from the local storage and show it on the actual web page after user made his choice
var renderHistory = function () {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  citiesDiv.innerHTML = "";
  for (var i = 0; i < searchHistory.length && i < 8; i++) {
    if (searchHistory[i] !== "") {
      citiesDiv.innerHTML += `<button data-city='${searchHistory[i]}' class="btn btn-secondary bg-gradient w-100 my-1" type="button">${searchHistory[i]}</button>`;
    }
  }
};

// I created a get weather api function that will make an api call and get the weather data needed
var getWeatherApi = function (userInput) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userInput +
    "&units=imperial&appid=" +
    apiKey;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderJumbotron(data);
    });
};

// I added a bootstrap jumbotron to my javascript that will render info from the api weather and show it on a web page for each city needed and will make a call to a function that will render a uv index
var renderJumbotron = function (data) {
  showingResultsDiv.innerHTML = `
  <div class="jumbotron p-3 m-2 bg-dark bg-gradient rounded ">
  <h3 ><b>${data.city.name}</b>(${moment
    .unix(data.list[0].dt)
    .format("MM/DD/YYYY")})</h3>
  <p class="lead">Temp: ${data.list[0].main.temp} &#8457;<br></p>
  <p>Wind: ${data.list[0].wind.speed} MPH<br></p>
  <p>Humidity: ${data.list[0].main.humidity} %<br></p>
  <p>UV index: <span id="uvIndexEl"></span><p/>
  </div>
  <h1 class="text-white ms-3 ">5-Day Forecast</h1>
<div id="fiveDaysForCast" class='row d-flex justify-content-around p-3'></div>
  `;
  renderUvIndex(data.city.coord.lat, data.city.coord.lon);
  renderFiveDaysForCast(data);
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${data.city.name}')`;
};

// This function will get the data from the api and render the button depend on the conditions 
var renderUvIndex = function (lat, lon) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var uvIndex = data.current.uvi;
      document.getElementById("uvIndexEl").innerHTML =
        uvIndex < 3
          ? `<button type="button" class="btn btn-success bg-gradient">${uvIndex}</button>`
          : uvIndex < 6
          ? `<button type="button" class="btn btn-warning bg-gradient">${uvIndex}</button>`
          : `<button type="button" class="btn btn-danger bg-gradient">${uvIndex}</button>`;
    });
};

// i added five days forecast function that will render five cards with an information needed for any city the user chose
var renderFiveDaysForCast = function (data) {
  var neededWeather = [1, 6, 14, 22, 30];

  for (var i = 0; i < neededWeather.length; i++) {
    var icon = `https://openweathermap.org/img/w/${
      data.list[neededWeather[i]].weather[0].icon
    }.png`;
    document.getElementById("fiveDaysForCast").innerHTML += `
  <div class="card col-lg-2 col-md-5  mt-5 customCard bg-dark bg-gradient text-white"  >

  <div class="card-body">
    <h5 class="card-title">${moment
      .unix(data.list[neededWeather[i]].dt)
      .format("MM/DD/YYYY")}</h5><br>
      <img src='${icon}'/>
      <p class="lead">Temp: ${
        data.list[neededWeather[i]].main.temp
      } &#8457;<br></p>
      <p>Wind: ${data.list[neededWeather[i]].wind.speed} MPH<br></p>
      <p>Humidity: ${data.list[neededWeather[i]].main.humidity} %<br></p>
    </div>
</div>
`;
  }
};

// i added a button Click Handler function that will render the targeted button city
var buttonClickHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getWeatherApi(city);
  }
};

// added an event listener
citiesDiv.addEventListener("click", buttonClickHandler);
inputFormEl.addEventListener("submit", userFormHandler);
