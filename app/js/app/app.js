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
      var topVenue = venueList[0].venue;
      var venue = {
        name : topVenue.name,
        address : topVenue.location.address,
        url : topVenue.url,
        icon : topVenue.categories[0].icon.prefix,
        position : topVenue.location.lat + ',' + topVenue.location.lng
      };
      var mapUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=' + 
                    venue.position + 
                   '&zoom=14' + 
                   '&size=300x250' + 
                   '&markers=color:blue%7C' + venue.position + 
                   '&sensor=false';

      
      // function that adds response results into DOM

      function displayResults() {

        $('#top-result').fadeIn();
        $('.container__outside--output').fadeIn();
        $('#map').html('<img src=' + mapUrl + '>');
        $('#result').text(venue.name);
        $('#location').text(venue.address);
        $('#url').html('<a href="' + venue.url + '" target="_blank">Vist website</a>');
        $('#category').html('<img src="' + venue.icon + '64.png">');
      
      };

      // run different conditionals depending on browser width
      // firstly, if it's > 700px

      if ( $('.container__inside--input').css('margin-top') != '50px' ) {

        // Check to make sure there's a venue in results

        if (response.hasOwnProperty('warning')) { 

          errorText.fadeIn().text(response.warning.text);

        } else {

          // if so, slide output view in, and fade in results function as callback

          $('.container__outside--input').animate({
            'position' : 'relative',
            'width' : '50%'
          }, 
            400, 
            displayResults()
          );

        };

        // if it's < 700px, do same, but scroll to section, don't animate
      } else {

        if (response.hasOwnProperty('warning')) { 

          errorText.fadeIn().text(response.warning.text);

        } else {

          displayResults();
          $('body, html').scrollTo(500); 

        }

      }; 

    }); // close ajax call

  }; //close main function

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