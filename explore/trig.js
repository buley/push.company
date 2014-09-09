define(['q', 'jquery' ], function(Q, $) {
  return {
    distance: function(one, two) {
      var lat1 = one.latitude,
          lon1 = one.longitude,
          radius1 = one.radius,
          lat2 = two.latitude,
          lon2 = two.longitude,
          radius2 = two.radius;
        console.log('DISTANCE', lat1, lon1, radius, lat2, lon2, radius);
        if (!lat1 || !lon1 || !lat2 || !lon2 ) {
          return Infinite;
        }
    }
  }
});
