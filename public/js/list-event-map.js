$(document).ready(function() {

  var $map = document.getElementById('list-event-map');

  if (!$map) {
    return ;
  }

  $("#search-box").on('keypress', function (e) {
    if (e.which == 13) {
      $(this).parent("form").submit();
      return false;    //<---- Add this line
    }
  });

  var santiagoLocation = {lat: -33.435960, lng: -70.646306},
    map = new google.maps.Map($map, {
      center: santiagoLocation,
      zoom: 12
    });

  if (window.searchResults && window.searchResults.length > 0) {
    for(var i = 0; i < window.searchResults.length; i++) {
      var marker = new google.maps.Marker({
        map: map,
        position: searchResults[i].location,
        anchorPoint: new google.maps.Point(0, -29)
      });
      marker.setVisible(true);
    }
    map.setCenter(window.searchResults[0].location);
    map.setZoom(14);
  } else {
    centerInCurrentLocation();
  }

});

function centerInCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        var lat  = position.coords.latitude,
          lng = position.coords.longitude,
          currentLocation = {lat: lat, lng: lng};
        map.setCenter(currentLocation);
        map.setZoom(14);
      }
    );
  }
}