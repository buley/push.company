define(['q', 'react' ], function(Q, React) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      component = React.createClass({
        render: function() {
          return 'WHY NOT';
        }
      });
  module.resolve(component);
  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        component.replaceProps(state);
        console.log("presence.js: dynamism", state);
        state.interfaces = state.interfaces || {};
        state.interfaces.presence = {
          bar: 'bar'
        };
        deferred.notify(state);
      })
    },
    ready: module.promise.then.bind(module.promise)
  }
});
