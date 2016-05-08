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

  var $startButton = $('.js-record');
  var $stopButton = $('.js-record-stop');
  var audioStarted = false
  var audio_context;
  var recorder;
  var localStream;
  if ($startButton.length) {
    $startButton.click(startRecording);
    $stopButton.click(stopRecording);
  }

  function startRecording() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext;
    } catch (e) {
      console.log('No web audio support in this browser!');
    }
    var a = navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      console.log('No live audio input: ' + e);
    });
    console.log(a);
  }

  function startUserMedia(stream, a) {
    console.log(stream, a);
    var input = audio_context.createMediaStreamSource(stream);
    localStream = stream;
    console.log(input);
    // input.connect(audio_context.destination);
    recorder = new Recorder(input);
    recorder.record();
    $startButton.hide();
    $stopButton.show();
    $stopButton.removeClass('hidden');
  }



  function stopRecording() {
    console.log('stopRecording');
    recorder && recorder.stop();
    console.log(localStream.getAudioTracks());
    var track = localStream.getAudioTracks()[0];
    track.stop();
    console.log(track)
    $startButton.show();
    $stopButton.hide();
    // create WAV download link using audio data blob
    createDownloadLink();
  }

  function createDownloadLink() {
    recorder.exportWAV(function(blob) {
      recorder.clear();
      var url = URL.createObjectURL(blob);

      var name = moment().format('DD-MM-YYYY HH:mm:ss');
      var html =
        `<li class="list-group-item row">
          <p class="col-sm-12">
            Grabación:  ${name} 
            <a class="btn" href="${url}" download filename="${name}.wav" target="_blank">
              <i class="fa fa-download"></i>
            </a>
          </p>
          <div class="col-sm-12">
            <audio src="${url}" controls ></audio>
          </div>
        </li>`;

      $('.download').append(html);
    });
  }
});
