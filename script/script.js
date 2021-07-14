var userInputEl = document.getElementById("user-input");
var inputFormEl = document.getElementById("input-form");
var showingResultsDiv = document.getElementById("showing-results");
var citiesDiv = document.getElementById("cities");

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

var renderHistory = function () {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  citiesDiv.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    if (searchHistory[i] !== "") {
      citiesDiv.innerHTML += `<button class="btn btn-primary w-100 my-1" type="button">${searchHistory[i]}</button>`;
    }
  }
};

var getWeatherApi = function (userInput) {
  var requestUrl =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    userInput +
    "&units=imperial&appid=5259fc0e54d33813248bd91f72b795bd";
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderJumbotron(data);
    });
};

var renderJumbotron = function (data) {
  showingResultsDiv.innerHTML = `
  <div class="jumbotron ">
  <h1 class="display-4"><b>${data.city.name}</b>(${moment
    .unix(data.list[0].dt)
    .format("MM/DD/YYYY")})</h1>
  <p class="lead">Temp: ${data.list[0].main.temp} &#8457;<br></p>
  <p>Wind: ${data.list[0].wind.speed} MPH<br></p>
  <p>Humidity: ${data.list[0].main.humidity} %<br></p>
  <p>UV index: <span id="uvIndexEl"></span> <p/>
  </div>
<div id="fiveDaysForCast"></div>
  `;
  renderUvIndex(data.city.coord.lat, data.city.coord.lon);
  renderFiveDaysForCast(data);
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${data.city.name}')`;
};

var renderUvIndex = function (lat, lon) {
  console.log(lat, lon);
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=5259fc0e54d33813248bd91f72b795bd`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var uvIndex = data.current.uvi;
      document.getElementById("uvIndexEl").innerHTML =
        uvIndex < 3
          ? `<button type="button" class="btn btn-success">${uvIndex}</button>`
          : uvIndex < 6
          ? `<button type="button" class="btn btn-warning">${uvIndex}</button>`
          : `<button type="button" class="btn btn-danger">${uvIndex}</button>`;
    });
};




inputFormEl.addEventListener("submit", userFormHandler);

// 5259fc0e54d33813248bd91f72b795bd

// api.openweathermap.org/data/2.5/forecast?q=raleigh&appid=5259fc0e54d33813248bd91f72b795bd

// https://source.unsplash.com/1600x900/?raleigh
