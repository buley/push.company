define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      instance,
      footer,
      first = true,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var node = document.getElementById("footer-container") || {};
        footer = {
          height: node ? node.clientHeight : 0
        };
        ctx.footer = footer;
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "footer-container",
            style: {
              "top": (current.content_top + current.content_height + current.bottom_height + (2 * padding.top) + (2 * padding.bottom)) + "px",
            }
          }, React.DOM.section({
            id: "footer"
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
          if (!state.footer) {
            state.footer = footer;
            deferred.notify(footer);
          } else if (state.screen) {
            if (state.screen.width !== prev.width) {
              onResize(state);
              prev.width = state.screen.width;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
