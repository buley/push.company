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
          var top_el = document.getElementById("ads-banner-top") || {},
              top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
              top_width = top_el.offsetWidth ? top_el.offsetWidth : 0;

          return React.DOM.section({
            id: "footer-container",
            style: {
              "top": ((this.props.header && this.props.header.height ? this.props.header.height : 0) + top_height + padding.top + padding.bottom + ( this.props.content ? this.props.content.height : 0 ) + padding.bottom + (this.props.ads && this.props.ads['banner-bottom'] ? this.props.ads['banner-bottom'].height : 0 ) ) + "px",
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
