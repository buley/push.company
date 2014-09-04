define(['q', 'react' ], function(Q, React) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      component = React.createClass({
        render: function() {
          return React.DOM.div(null, 'WHY NOT');
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
      })
    },
    ready: module.promise.then.bind(module.promise)
  }
});
