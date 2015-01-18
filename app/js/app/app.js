$(document).on('ready', function() {

  // Function to GET results from API endpoint

  function searchFoursquare(exactPosition, radius, searchTerm) {

    var topResult = $('#top-result')
    var errorText = $('.error')

    var baseUrl = 'https://api.foursquare.com/v2/venues/explore'
    var token = 'VN4Y3OWHFGUGYXOGB2KDS4A50PZP31RG1DNSDWDGK0NVW0ZZ';
    var secret = 'IZQHG5ZVLA3M220YAJAOJN4O2RR45BBGWXJT2JXOJU00JBHU';
    var url = baseUrl + 
              '?client_id=' + token + 
              '&client_secret=' + secret + 
              '&v=20130815' + 
              '&ll=' + exactPosition + 
              '&radius=' + radius + 
              '&query=' + searchTerm;
    
    topResult.css('display', 'none');
    errorText.css('display', 'none');

    // API call (what you put in, callbackfunction(returnedobject))

    $.getJSON(url, function(json) {

      var response = json.response
      var venueList = response.groups[0].items;
      var topVenue = venueList[0];
      var venue = {
        name : topVenue.venue.name,
        address : topVenue.venue.location.address,
        url : topVenue.venue.url,
        icon : topVenue.venue.categories[0].icon.prefix 
      };

      // Check to make sure there's a result

      if (response.hasOwnProperty('warning')) { 

        errorText.fadeIn().text(response.warning.text);

      } else {

        $('#top-result').fadeIn();
        $('#result').text(venue.name);
        $('#location').text(venue.address);
        $('#url').html('<a href="' + venue.url + '" target="_blank">Vist website</a>');
        $('#category').html('<img src="' + venue.icon + '64.png">');

      };

    });

  };

  // Get user's location (start by checking if you can / are allowed)

  function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    } else {

        $('.error').fadeIn().text('Sorry, your browser does not support location sharing');

    }

  };

  // If permission granted, do something with the location

  function successCallback(position) {
    
    // Can now run API call on form submit

    $('.search-form').on('submit', function() {

      // Get position from html5 api call
      // Get radius in meters by converting text to integer and multiplying back by 100
      // Get query from search input, and lose whitespace
      
      var latAndLong = position.coords.latitude + ',' + position.coords.longitude;
      var radiusInMeters = parseInt( $('.radius__output--val').text() ) * 100;
      var searchQuery = $('.search-field').val().trim();

      searchFoursquare(latAndLong, radiusInMeters, searchQuery);
      
      return false;

    });

  };

  // If something weird, handle errors

  function errorCallback(error) {

    var errorText = $('.error')

    switch(error.code) {

      case error.PERMISSION_DENIED:
        errorText.fadeIn().text('In order to see the best things near you, we need permission to see your location')
        break;

      case error.POSITION_UNAVAILABLE:
        errorText.fadeIn().text('Location information is unavailable.')
        break;

      case error.TIMEOUT:
        errorText.fadeIn().text('The request to get your location timed out.')
        break;

      case error.UNKNOWN_ERROR:
        errorText.fadeIn().text('A crazy, unknown error occurred.')
        break;

    }

  };

  // Run the function to get user's location

  getLocation();

});