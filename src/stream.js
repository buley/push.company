define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      first = true,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
          var node = document.getElementById("stream-container");
          ctx.stream = _.extend((ctx.stream || {}), {
            height: node ? node.clientHeight : 0,
            width: node ? node.clientWidth : 0
          });
          deferred.notify(ctx);
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
        if (first) {
          first = false;
          onResize(state);
        } else {
          state = _.extend(state, { stream: context.stream});
          if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              onResize(state);
              prev.updated = context.screen.updated;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
