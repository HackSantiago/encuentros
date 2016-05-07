$(document).ready(function() {

  var map = L.map('welcome-map').setView([-33.435960, -70.646306], 12);
  L.tileLayer('https://api.mapbox.com/styles/v1/creedarky/cinxcugqq0000b1nub2sxmq2h/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3JlZWRhcmt5IiwiYSI6ImNpbnhjdGZ6dTE3NHJ1YW0zb3Z4Z242M3QifQ.o0bJWPmReYxFiL1VVR_f3g', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
  function success(position) {
    console.log(position);
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    map.setView([latitude, longitude], 14);
  }

  function error(error) {
    console.log(error)
  }

});
