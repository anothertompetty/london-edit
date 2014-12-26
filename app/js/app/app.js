$(document).on('ready', function() {

  console.log('scripts loading!');

  // Foursquare client ID VN4Y3OWHFGUGYXOGB2KDS4A50PZP31RG1DNSDWDGK0NVW0ZZ
  // Foursquare App secret IZQHG5ZVLA3M220YAJAOJN4O2RR45BBGWXJT2JXOJU00JBHU

  function searchFoursquare(searchTerm) {

    var token = 'VN4Y3OWHFGUGYXOGB2KDS4A50PZP31RG1DNSDWDGK0NVW0ZZ';
    var secret = 'IZQHG5ZVLA3M220YAJAOJN4O2RR45BBGWXJT2JXOJU00JBHU';
    var url = 'https://api.foursquare.com/v2/venues/explore?client_id=' + token + '&client_secret=' + secret + '&v=20130815&near=london&query=' + searchTerm;
    
    $.getJSON(url, function(json) {

      var venueList = json.response.groups[0].items;
      var topVenue = venueList[0];
      var venue = {
        name : topVenue.venue.name,
        address : topVenue.venue.location.address,
        url : topVenue.venue.url,
        icon : topVenue.venue.categories[0].icon.prefix 
      };

      console.log(topVenue);

      $('.result strong').text(venue.name);
      $('.location').text(venue.address);
      $('.url').text(venue.url);
      $('.category').html('<img src="' + venue.icon + 'bg_32.png">');

    });

  };

  $('#search-form').on('submit', function() {

    var searchQuery = $('#search-field').val().trim();
    searchFoursquare(searchQuery);
    console.log(searchQuery);

    return false;

  });

});