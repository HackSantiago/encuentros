$(document).ready(function() {

  var $map = document.getElementById('welcome-map');
  if (!$map) {
    return ;
  }

  var santiagoLocation = {lat: -33.435960, lng: -70.646306},
      map = new google.maps.Map($map, {
        center: santiagoLocation,
        zoom: 10
      });


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        var lat  = position.coords.latitude,
            lng = position.coords.longitude,
            currentLocation = {lat: lat, lng: lng};
        map.setCenter(currentLocation);
        map.setZoom(12);

        fetchEventsNearToLocation(currentLocation)
        .then(function(result) {
          R.map(setMarker, result.events);
        });
      },
      function error(error) {
        console.log(error)
      }
    );
  }


  function fetchEventsNearToLocation(location) {
    var distance = getCurrentDistance();
    return $.ajax({
      method: 'GET',
      url: '/event/near',
      data: {
        location: location,
        distance: distance
      }
    });
  }

  function setMarker(event) {
    var latlng = new google.maps.LatLng(event.location[1], event.location[0]),
        marker = new google.maps.Marker({
          position: latlng,
          title: event.title
        }),
        infowindow = eventInfoWindow(event);
    marker.setMap(map);
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }

  function eventInfoWindow(event) {
    var content = _.template('<a href="/event/<%= event._id %>"><%= event.title %></a>')
      ({event: event});
    return new google.maps.InfoWindow({
      content: content
    });
  }

  function getCurrentDistance() {
    var bounds = map.getBounds(),
        northEast = bounds.getNorthEast(),
        center = map.getCenter();
    return google.maps.geometry.spherical.computeDistanceBetween(center, northEast);
  }

});
