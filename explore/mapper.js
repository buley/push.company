define(['q', 'react', 'mapbox'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      map,
      context = {},
      layers,
      marker,
      component = React.createClass({
        componentDidMount: function() {
            map = L.mapbox.map(this.getDOMNode(), 'buley.j737pbkc')
        },
        render: function() {
          var key;
          if (!marker && !!this.props && !!this.props.location) {
            marker = L.circleMarker( L.latLng(this.props.location.latitude, this.props.location.longitude), { radius: this.props.location.radius } );
            marker.addTo(map);
          } else if (!!marker && !!this.props && !!this.props.location) {
            marker.setLatLng(L.latLng(this.props.location.latitude, this.props.location.longitude));
            marker.setRadius(this.props.location.radius);
          }
          if (!!this.props.neighborhood) {
            key = [
                this.props.location.latitude,
                this.props.location.longitude,
                this.props.location.radius,
              ].join("|");
            if (!layers[key]) {
              console.log("DO NEIGHBORHOOD MAP",this.props.neighborhood);
            }
          }
          map.fitWorld();
          return React.DOM.div({id: "map"});
        }
      });

  module.resolve(component);

  L.mapbox.accessToken = 'pk.eyJ1IjoiYnVsZXkiLCJhIjoiZWwySzE4cyJ9.tKVH4x1b-W4ag-s7jqRKlA';

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        context = state;
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
