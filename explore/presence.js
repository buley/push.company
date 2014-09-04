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
        console.log("presence.js: incoming", state);
        state.interfaces = state.interfaces || {};
        state.interfaces.presence = {
          bar: 'bar'
        };
        deferred.notify(state);
        context = state;
      })
    },
    ready: module.promise.then.bind(module.promise)
  }
});
