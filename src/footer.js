define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      instance,
      footer,
      first = true,
      prev = {},
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
          var height = 800,
              sidebar = (this.props.ads && this.props.ads['box-top'] && this.props.ads['box-bottom'] ? this.props.ads['box-top'].height + this.props.ads['box-top'].height : 0),
              bottom_el = document.getElementById("ads-banner-bottom") || {},
              bottom_height = bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
              bottom_width = bottom_el.offsetWidth ? bottom_el.offsetWidth : 0;

          if (sidebar > height) {
            height = sidebar;
          }
          return React.DOM.section({
            id: "footer-container",
            style: {
              "top": (height + bottom_height ) + "px",
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
