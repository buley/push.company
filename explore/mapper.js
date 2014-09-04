define(['q', 'react'], function(Q, React) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      render = function() {
        console.log('props',this.props, context);
        return React.DOM.div(null, (this.props.init - this.props.timestamp).toString());
      },
      comp,
      component = React.createClass({
        componentWillReceiveProps: function() {
          comp = this;
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
