define(['q', 'react'], function(Q, React) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      component,
      exported = React.createClass({
        render: function() {
          component = this;
          return React.DOM.div(null, !!context ? context.init - context.timestamp : null);
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
        if (!!component) {
          component.replaceProps(state);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
