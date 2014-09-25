define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function() {
          var node = document.getElementById("stream-container");
          context.stream = context.stream || {};
          context.stream = _.extend(context.stream, {
            height: node ? node.clientHeight : 0,
            width: node ? node.clientWidth : 0
          });
          deferred.notify(context);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {

          return React.DOM.section({
            id: "stream-container",
            style: {
              top: (this.props.ads['box-top'].top + padding.bottom) + "px",
              height: "200px"
            }
          }, React.DOM.section({
            id: "stream"
          } ) );
        }
      });

  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        if (!context) {
          context = _.extend({}, state);
          onResize();
        } else {
          context = _.extend({}, _.extend(state, { stream: context.stream}));
          if (context.screen) {
            if (context.screen.updated !== prev.updated) {
              onResize();
              prev.updated = context.screen.updated;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
