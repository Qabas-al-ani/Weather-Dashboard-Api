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
    citiesDiv.innerHTML += `<button class="btn btn-primary w-100 my-1" type="button">${searchHistory[i]}</button>`;
  }
};

var getWeatherApi = function (userInput) {
  var requestUrl =
    "api.openweathermap.org/data/2.5/forecast?q=" +
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

inputFormEl.addEventListener("submit", userFormHandler);

// 5259fc0e54d33813248bd91f72b795bd

// api.openweathermap.org/data/2.5/forecast?q=raleigh&appid=5259fc0e54d33813248bd91f72b795bd

// https://source.unsplash.com/1600x900/?raleigh
