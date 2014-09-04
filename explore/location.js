define(['q', 'react'], function(Q, React, L) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      getParams = function() {
        return [ 38.538901, -121.700335, 15 ];
      },
      params = getParams(),
      lat = params[0],
      lon = params[1],
      radius = params[2],
      current = {
        latutude: lat,
        longitude: lon,
        radius: radius
      },
      map,
      context = {},
      component = React.createClass({
        render: function() {
          return React.DOM.div({id: "location"}, JSON.stringify(this.props.location));
        }
      });
  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        console.log('incoming',state.location);
        if (!state.location) {
          state.location = current;
          console.log('notify', state.location);
          deferred.notify(state);
        } else {
          context = state;
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
