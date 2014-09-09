define(['q', 'jquery' ], function(Q, $) {
  return {
    distance: function(one, two) {
      if (!one || !two) {
        return Infinity;
      }
      var lat1 = one.latitude,
          lon1 = one.longitude,
          radius1 = one.radius,
          lat2 = two.latitude,
          lon2 = two.longitude,
          radius2 = two.radius,
          distance,
          deltaLat,
          deltaLon;
        if (!lat1 || !lon1 || !lat2 || !lon2 ) {
          return Infinity;
        }
        console.log('DISTANCE', lat1, lon1, radius, lat2, lon2, radius);
        R = 6371;
        deltaLat = (lat2-lat1).toRadians();
        deltaLon = (lon2-lon1).toRadians();
        a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1.toRadians()) * Math.cos(lat2.toRadians()) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
        console.log("DISTANCE",distance);
        if (!radius1 || !radius2) {
          return distance;
        }
        console.log("RADIUS",radius1,radius2);
    }
  }
});
