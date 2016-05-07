$(document).ready(function() {
  var $mapContainer = $('#show-event-map')
  if($mapContainer.size() > 0) {
    var coords  = $mapContainer.data('coords'),
        address = $mapContainer.data('address'),
        address = address !== 'undefined' ? address : '';
        title   = $mapContainer.data('title');
    var position = new google.maps.LatLng(coords[1], coords[0]);
    var map = map = new google.maps.Map($mapContainer[0], {
      center: position,
      zoom: 16
    });

    var marker = new google.maps.Marker({
      position: position,
      title:"Hello World!"
    });
    marker.setMap(map);
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent('<div><strong>' + title + '</strong><br>' + address);

    marker.addListener('click', function() {
      openInfo();
    });
    function openInfo() {
      infowindow.open(map, marker);
    }
    openInfo();
  }

});
