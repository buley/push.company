define(['q', 'react', 'mapbox', 'underscore'], function(Q, React, L, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      map,
      context = {},
      layers = {},
      control_layers,
      map_state = {},
      vicinities = {},
      marker,
      control,
      present = [],
      was_present = [],
      overlays = [ "Local", "Hyperlocal" ],
      instance,
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
            map = L.mapbox.map(this.getDOMNode(), 'buley.j737pbkc');
            map.on('baselayerchange', onBaseLayerChange);
            map.on('overlayadd', onOverlayAdd);
            map.on('overlayremove', onOverlayRemove);
        },
        render: function() {
          renderMap.apply(this, arguments);
          return React.DOM.div({id: "map"});
        }
      }),
      renderMap = function() {
        var key,
			that = this,
            layer,
            ids = [],
            next_present = [];
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
        if (!!this.props.vicinity) {
          key = [
              this.props.location.latitude,
              this.props.location.longitude,
              this.props.location.radius,
            ].join("|");
          if (!!vicinities[key]) {
            //map.removeLayer(vicinities[key].group);
            delete vicinities[key];
          }
          layer = { data: [] };
          if (!!this.props.vicinity && this.props.vicinity.length > 0) {
            this.props.vicinity.forEach(function(item) {
              if (!!item.Places && item.Places.length > 0) {
                item.Places.forEach(function(place) {
                  ids.push(item.Id);
                  layer.data.push(L.marker([item.Location.Latitude, item.Location.Longitude]).bindPopup(place.Name));
                  if(item.Location.Distance < that.props.location.radius) {
                    next_present.push(item.Id);
                  }
                });
              }
            });
          }
          was_present = present;
          present = next_present;
          context = _.extend(context, {presence: present, previous_presence: was_present});
          if (layer.data.length > 0) {
            layer.group = L.featureGroup(layer.data);
            if (_.contains(overlays, "Hyperlocal")) {
              layer.group.addTo(map);
            }
            control_layers = control_layers || {};
            control_layers["Hyperlocal"] = layer.group;
            vicinities[key] = layer;
          }
        }
        if (!!this.props.neighborhood) {
          key = [
              this.props.location.latitude,
              this.props.location.longitude,
              this.props.location.radius,
            ].join("|");
          if (!!layers[key]) {
            //map.removeLayer(layers[key].group);
            delete layers[key];
          }
          layer = { data: ( !!layer ? layer.data || [] : [] ) };
          if (!!this.props.neighborhood && this.props.neighborhood.length > 0) {
            this.props.neighborhood.forEach(function(place) {
              if (false === _.contains(overlays, "Hyperlocal") || false === _.contains(ids, place.Id)) {
                layer.data.push(
                  L.marker([place.Latitude, place.Longitude]).bindPopup(place.Name)
                );
              }
            });
          }
          if (layer.data.length > 0) {
            layer.group = L.featureGroup(layer.data);
            map.fitBounds(layer.group.getBounds());
            if (_.contains(overlays, "Local")) {
              layer.group.addTo(map);
            }
            layers[key] = layer;
            control_layers = control_layers || {};
            control_layers["Local"] = layer.group;
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
          if (!!layers[key]) {
            //map.removeLayer(layers[key].group);
            delete layers[key];
          }
        }

      },
      onBaseLayerChange = function(e) {
        console.log('onBaseLayerChange',e);
      },
      onOverlayRemove = function(e) {
        overlays = _.without(overlays, e.name);
        map_state.overlays = overlays;
        context = _.extend(context, { map: map_state});
        deferred.notify(context);
        console.log('onOverlayRemove',e.name, overlays);
      },
      onOverlayAdd = function(e) {
        overlays.push(e.name);
        overlays = _.unique(overlays);
        map_state.overlays = overlays;
        context = _.extend(context, { map: map_state});
        deferred.notify(context);
        console.log('onOverlayAdd',e.name, overlays);
      };

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
