define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
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
          var current = layout.current();
          return React.DOM.section({
            id: "right-container",
            style: {
              top: current.box_top - padding.top,
              height: current.sidebar,
              display: current.has_right ? 'inline' : 'none'
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
