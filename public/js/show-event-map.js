$(document).ready(function() {

  if($('#show-event-map').size() > 0) {
    var coords = $('#show-event-map').data('coords');
    var map = L.map('show-event-map').setView(coords, 16);
    L.tileLayer('https://api.mapbox.com/styles/v1/creedarky/cinxcugqq0000b1nub2sxmq2h/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3JlZWRhcmt5IiwiYSI6ImNpbnhjdGZ6dTE3NHJ1YW0zb3Z4Z242M3QifQ.o0bJWPmReYxFiL1VVR_f3g', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20
    }).addTo(map);

    L.marker(coords).addTo(map);
  }

});
