define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      first = true,
      instance,
      prev = {},
      right,
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        return;
        var el = document.getElementById("right-container"),
            style = window.getComputedStyle(el);
        ctx.right = {
          height: parseFloat(el.height.replace(/px$/, ''),10),
          top: parseFloat(el.top.replace(/px$/, ''),10)
        };
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          return React.DOM.section({
            id: "right-container",
            style: {
              top: 0,
              height: 0
            }
          }, React.DOM.section({
            id: "right"
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
        var json;
        if (first) {
          first = false;
          if (state.screen) {
            prev.updated = state.screen.updated;
          }
          onResize(state);
        } else {
          if (!state.right) {
            state.right = right;
            deferred.notify(state);
          } else if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              prev.updated = state.screen.updated;
              onResize(state);
            }
          } else {
            json = JSON.stringify(state.ads);
            if (json !== prev.json) {
              prev.json = json;
              onResize(state);
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
