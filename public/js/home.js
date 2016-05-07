$(document).ready(function() {

  $map = $('#welcome-map');
  if (!$map.length) {
    return ;
  }

  var santiagoLocation = [-33.435960, -70.646306],
      map = L.map('welcome-map').setView(santiagoLocation, 12);

  L.tileLayer('https://api.mapbox.com/styles/v1/creedarky/cinxcugqq0000b1nub2sxmq2h/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3JlZWRhcmt5IiwiYSI6ImNpbnhjdGZ6dTE3NHJ1YW0zb3Z4Z242M3QifQ.o0bJWPmReYxFiL1VVR_f3g', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        var lat  = position.coords.latitude,
            lng = position.coords.longitude,
            currentLocation = [lat, lng];
        map.setView(currentLocation, 14);
      },
      function error(error) {
        console.log(error)
      }
    );
  }

});
