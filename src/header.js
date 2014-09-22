define(['q', 'react', 'mapbox', 'underscore'], function(Q, React, L, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      instance,
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
            console.log("header mounted");
        },
        render: function() {
          //TODO: Render map
          //renderMap.apply(this, arguments);
          console.log('header render');
          return React.DOM.header({id: "header"}, React.DOM.div({
            id: "header-container"
          }, React.DOM.div({
            id: "header-inner"
          })));
        }
      });

  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        context = _.extend({}, state);
        if (!!state.route && !!state.route.hash && !!state.route.hash.overlay) {
          overlays = _.unique(state.route.hash.overlay.split(","));
          map_state.overlays = overlays;
          delete context.route.hash.overlay;
          deferred.notify(context);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
