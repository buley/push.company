define(['q', 'react'], function(Q, React) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      render = function() {
        console.log('mapper render');
        return React.DOM.div(null, !!context ? context.init - context.timestamp : 'TK');
      },
      component = React.createClass({
        getInitialState: function() {
          console.log('getInitialState');
          return {};
        },
        componentWillMount: function() {
          console.log('componentWillMount');
        },
        componentDidMount: function() {
          console.log('did mount');
        },
        componentWillReceiveProps: function() {
          console.log('mapper componentWillReceiveProps');
        },
        render: render
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
