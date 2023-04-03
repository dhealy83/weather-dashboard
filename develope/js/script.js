var APIkey = "7bf7f64189595f977e6ba12b82dac79d";
var citySearch = document.querySelector("#inputSearch");
var buttonAction = document.querySelector(".btn");
let dateEl = document.getElementById("date");
var temp = document.getElementById("weatherNowTemp");
var rh = document.getElementById("weatherNowRH");
var ws = document.getElementById("weatherNowWS");
var uv = document.getElementById("weatherNowUV");
var icon = document.getElementById("weatherNowICON");
var dateCall = Date();
var searchHistory = document.querySelector("#prevSearch");
let cityEl = document.querySelector("#city");
var myCityValue = citySearch.value.trim();

function fiveDay(data, container) {
  this.data = data;
  this.container = container;
  this.container.innerHTML = "";
  this.render = function () {
    var loopDay = document.createElement("loopDay");
    loopDay.className = "col fs-4  col-4 my-1";

    var loopTemp = document.createElement("loopTemp");
    loopTemp.className = "col fs-3  col-4 my-1 d-flex justify-content-start";

    var images = document.createElement("img");
    images.className = "col col-4 d-flex justify-content-start pe-4";

    var loopRh = document.createElement("loopRh");
    loopRh.className = "col col-4 my-1 mb-2 d-flex justify-content-start";

    var loopWs = document.createElement("loopWs");
    loopWs.className = "col col-4 my-1 row d-flex justify-content-center";

    var loopUv = document.createElement("loopUv");
    loopUv.className = "col col-4 m-2 d-flex justify-content-center";

    var date = new Date(this.data.dt * 1000);

    var icons = this.data.weather[0].icon;
    icons.className = " row col-4";

    var iconUrl = "http://openweathermap.org/img/w/" + icons + ".png";

    images.src = iconUrl;
    loopDay.textContent = date.toLocaleDateString();
    loopTemp.textContent = Math.round(this.data.temp.day) + "°";
    loopRh.textContent = "Humidity: " + this.data.humidity;
    loopWs.textContent = "Wind: " + Math.round(this.data.wind_speed);
    loopUv.textContent = "UV Index: " + Math.round(this.data.uvi);

    if (this.data.uvi <= 2.99) {
      loopUv.style =
        "background-color: rgba(0,255,0,0.3); border-radius: 12px;";
    } else if (this.data.uvi >= 3 && this.data.uvi <= 5.99) {
      loopUv.style =
        "background-color:rgba(255,255,0,0.3); border-radius: 12px;";
    } else if (this.data.uvi >= 6 && this.data.uvi <= 7.99) {
      loopUv.style =
        "background-color: rgba(255, 165, 0, 0.3); border-radius: 12px;";
    } else if (this.data.uvi > 8) {
      loopUv.style =
        "background-color: rgba(255,0,0,0.3); border-radius: 12px;";
    }

    this.container.append(loopDay, loopTemp, images);
    this.container.className = "col fiveDayRow1 bg-dark";
    this.container.append(loopRh, loopWs, loopUv);
    this.container.className =
      "row fiveDayRow2 bg-dark d-flex justify-content-between";
  };
}

const getWeatherData = function (event) {
  var myCityValue = citySearch.value.trim() || event.target.innerHTML;
  var savedCities = JSON.parse(localStorage.getItem("cities")) ?? [];
  console.log(savedCities);
  if (citySearch.value === "") {
    return;
  }
  if (!savedCities.includes(citySearch.value)) {
    var updatedCities = [...savedCities, citySearch.value];
    localStorage.setItem("cities", JSON.stringify(updatedCities));
  }
  var queryURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    myCityValue +
    "&appid=" +
    APIkey +
    "&units=imperial";
  citySearch.value;
  fetch(queryURL)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      var queryURL002 =
        "https://api.openweathermap.org/data/3.0/onecall?lat=" +
        data[0].lat +
        "&lon=" +
        data[0].lon +
        "&appid=" +
        APIkey +
        "&units=imperial";
      fetch(queryURL002)
        .then(function (data) {
          return data.json();
        })
        .then(function (data) {
          console.log(data);
          console.log(queryURL002);

          var date = document.createElement("h1");
          dateEl.textContent = "";
          date.textContent = myCityValue;
          dateEl.appendChild(date);
          console.log(date);

          var temp01 = document.createElement("h3");
          temp.textContent = "";
          temp01.textContent = Math.round(data.current.temp) + "°";
          weatherNowTemp.appendChild(temp01);

          var rh01 = document.createElement("h3");
          rh.textContent = "";
          rh01.textContent = "Humidity:" + data.current.humidity;
          weatherNowRH.appendChild(rh01);

          var ws01 = document.createElement("h3");
          ws.textContent = "";
          ws01.textContent = "Wind:" + data.current.wind_speed;
          weatherNowWS.appendChild(ws01);

          var uv01 = document.createElement("h3");
          uv.textContent = "";
          uv01.textContent = "UV Index:" + data.current.uvi;
          weatherNowUV.appendChild(uv01);

          icon.src =
            "http://openweathermap.org/img/w/" +
            data.current.weather[0].icon +
            ".png";
          "http://openweathermap.org/img/w/" +
            data.current.weather[0].icon +
            ".png";

          for (let index = 0; index < 5; index++) {
            var dailyPull = new fiveDay(
              data.daily[index],
              document.getElementById("day" + (index + 1))
            );
            dailyPull.render();
            citySearch.value = "";
          }
        });
    });
};

function renderSearchHistory() {
  var savedCities = JSON.parse(localStorage.getItem("cities")) ?? [];
  if (savedCities.length < 1) {
    return;
  }
  for (let index = 0; index < savedCities.length; index++) {
    var searchItem = document.createElement("li");
    var searchListItem = document.createElement("li");
    searchListItem.className = "m-1 border-bottom";
    searchListItem.textContent = savedCities[index];
    searchListItem.addEventListener("click", function (event) {
      citySearch.value = savedCities[index];
      getWeatherData(event);
    });
    searchItem.appendChild(searchListItem);
    searchHistory.appendChild(searchItem);
  }
}

renderSearchHistory();

buttonAction.addEventListener("click", getWeatherData);
buttonAction.addEventListener("click", renderSearchHistory);

citySearch.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    buttonAction.click();
  }
});

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});
