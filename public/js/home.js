$(document).ready(function() {

  var $map = document.getElementById('welcome-map');
  if (!$map) {
    return ;
  }

  var santiagoLocation = {lat: -33.435960, lng: -70.646306},
      map = new google.maps.Map($map, {
        center: santiagoLocation,
        zoom: 12
      });


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        var lat  = position.coords.latitude,
            lng = position.coords.longitude,
            currentLocation = {lat: lat, lng: lng};
        map.setCenter(currentLocation);
        map.setZoom(14);
      },
      function error(error) {
        console.log(error)
      }
    );
  }

});
