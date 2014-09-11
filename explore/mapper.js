define(['q', 'react', 'mapbox'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      map,
      context = {},
      layers = {},
      vicinities = {},
      marker,
      component = React.createClass({
        componentDidMount: function() {
            map = L.mapbox.map(this.getDOMNode(), 'buley.j737pbkc')
        },
        render: function() {
          var key,
              layer,
              control_layers = {};
          if (!marker && !!this.props && !!this.props.location) {
            marker = L.circleMarker( [this.props.location.latitude, this.props.location.longitude], {
              color: '#000',
              fill: false,
              radius: this.props.location.radius
            } );
            marker.addTo(map);
          } else if (!!marker && !!this.props && !!this.props.location) {
            marker.setLatLng([this.props.location.latitude, this.props.location.longitude]);
            marker.setRadius(this.props.location.radius);
          }
          if (!!this.props.neighborhood) {
            key = [
                this.props.location.latitude,
                this.props.location.longitude,
                this.props.location.radius,
              ].join("|");
            if (!layers[key]) {
              layer = { data: [] };
              if (!!this.props.neighborhood && this.props.neighborhood.length > 0) {
                this.props.neighborhood.forEach(function(place) {
                  layer.data.push(
                    L.marker([place.Latitude, place.Longitude])
                      .bindPopup(place.Name)
                  );
                });
              }
              if (layer.data.length > 0) {
                layer.group = L.featureGroup(layer.data);
                layer.group.addTo(map);
                map.fitBounds(layer.group.getBounds())
                layers[key] = layer;
                control_layers["Local"] = layer.group;
              }
            }
          }
          if (!!this.props.previous_location) {
            key = [
                this.props.previous_location.latitude,
                this.props.previous_location.longitude,
                this.props.previous_location.radius,
              ].join("|");
            if (!!layers[key]) {
              map.removeLayer(layers[key].group);
              delete layers[key];
            }
          }
          if (!!this.props.vicinity) {
            key = [
                this.props.location.latitude,
                this.props.location.longitude,
                this.props.location.radius,
              ].join("|");
            if (!vicinities[key]) {
              layer = { data: [] };
              if (!!this.props.vicinity && this.props.vicinity.length > 0) {
                this.props.vicinity.forEach(function(item) {
                  if (!!item.Places && item.Places.length > 0) {
                    item.Places.forEach(function(place) {
                      layer.data.push(L.marker([item.Location.Latitude, item.Location.Longitude]).bindPopup(place.Name));
                    });
                  }
                });
              }
              if (layer.data.length > 0) {
                layer.group = L.featureGroup(layer.data);
                layer.group.addTo(map);
                control_layers["Hyperlocal"] = layer.group;
                map.fitBounds(layer.group.getBounds())
                vicinities[key] = layer;
              }
            }
          }
          if (!!this.props.previous_location) {
            key = [
                this.props.previous_location.latitude,
                this.props.previous_location.longitude,
                this.props.previous_location.radius,
              ].join("|");
            if (!!vicinities[key]) {
              map.removeLayer(vicinities[key].group);
              delete vicinities[key];
            }
          }

          console.log('CONTROL',control_layers);

          L.control({'position': 'topright'}).addTo(map);

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
