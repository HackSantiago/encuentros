$(document).ready(function() {

  var $map = document.getElementById('map');
  if (!$map) {
    return ;
  }

  var santiagoLocation = {lat: -33.435960, lng: -70.646306},
    map = new google.maps.Map($map, {
      center: santiagoLocation,
      zoom: 12
    }),
    $latitude = $('#latitude'),
    $longitude = $('#longitude');
  var input = document.getElementById('address');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  autocomplete.setTypes(['address']);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("Autocomplete's returned place contains no geometry");
      return;
    }
    $latitude.val(place.geometry.location.lat())
    $longitude.val(place.geometry.location.lng())
    map.setCenter(place.geometry.location);
    map.setZoom(13);
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });


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


  $(window).keydown(function(event){
    if( (event.keyCode == 13)) {
      event.preventDefault();
      return false;
    }
  });

  $('#date').datetimepicker({
    format: 'DD-MM-YYYY hh:mm a',
    icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    }
  });


});
