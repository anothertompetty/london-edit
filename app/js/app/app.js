$(document).on('ready', function() {

  // Function to GET results from API endpoint

  function searchFoursquare(exactPosition, radius, searchTerm) {

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

        $('.error').fadeIn().text(response.warning.text);

      } else {

        $('.top-result').fadeIn();
        $('.result strong').text(venue.name);
        $('.location').text(venue.address);
        $('.url').text(venue.url);
        $('.category').html('<img src="' + venue.icon + '64.png">');

      };

    });

  };

  // Get user's location (start by checking if you can / are allowed)

  function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        $('.error').fadeIn().text('Sorry, your browser doesn\'t support location sharing');
    }

  };

  // If permission granted, do something with the location

  function successCallback(position) {

    var myPosition = position.coords.latitude + ',' + position.coords.longitude;
    
    // Run API call on form submit

    $('#search-form').on('submit', function() {

      var latAndLong = myPosition;
      var radiusInMeters = $('.radius__output').text();
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