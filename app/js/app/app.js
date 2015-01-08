$(document).on('ready', function() {

  // Get user's location

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('this didn\'t work');
    }
  };

  function showPosition(position) {
    console.log('Latitude: ' + position.coords.latitude + ', Longitude: ' + position.coords.longitude); 
  };

  console.log(getLocation());

  // Api GET function

  // function debug() {
    
  //   $.getJSON('https://api.foursquare.com/v2/venues/explore?client_id=VN4Y3OWHFGUGYXOGB2KDS4A50PZP31RG1DNSDWDGK0NVW0ZZ&client_secret=IZQHG5ZVLA3M220YAJAOJN4O2RR45BBGWXJT2JXOJU00JBHU&v=20130815&ll=51.562771299999994,-0.0792068&radius=100&query=sushi', function(theResponse) {

  //     if (theResponse.response.hasOwnProperty('warning')) {
  //       console.log(theResponse.response.warning.text);
  //     } else {
  //       console.log(theResponse);
  //     };

  //   });

  // };

  // debug();

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

  // Run above function on form submit

  $('#search-form').on('submit', function() {

    var latAndLong = '51.5627849,-0.0791954';
    var radiusInMeters = '100';
    var searchQuery = $('.search-field').val().trim();

    searchFoursquare(latAndLong, radiusInMeters, searchQuery);
    
    return false;

  });

});