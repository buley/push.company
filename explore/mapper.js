define(['q', 'react', 'mapbox'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      map,
      context = {},
      marker,
      component = React.createClass({
        componentWillMount: function() {
            L.mapbox.accessToken = 'pk.eyJ1IjoiYnVsZXkiLCJhIjoiZWwySzE4cyJ9.tKVH4x1b-W4ag-s7jqRKlA';
            map = L.mapbox.map('map', 'buley.j737pbkc').setView(L.latLng(this.props.location.longitude, this.props.location.longitude), 14);
            if (!marker) {
              marker = L.circleMarker( L.latLng(this.props.location.longitude, this.props.location.longitude), { radius: this.props.location.radius }).addTo(map);
            } else {
              marker.setLatLng(L.latLng(this.props.location.longitude, this.props.location.longitude));
              marker.setRadius({ radius: this.props.location.radius })
            }
        },
        componentWillReceiveProps: function(props) {
          marker.setLatLng(L.latLng(props.location.longitude, props.location.longitude));
        },
        render: function() {
          console.log('map',map._el, map);
          return React.DOM.div({id: "mapper"}, (this.props.init - this.props.timestamp).toString());
        }
      });

  module.resolve(component);

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
