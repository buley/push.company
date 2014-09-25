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
      onResize = function(ctx) {
        var node = document.getElementById("footer-container") || {};
        ctx.footer = _.extend((ctx.footer || {}), {
          height: node ? node.clientHeight : 0
        });
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          return React.DOM.section({
            id: "footer-container",
            style: {
              top: this.props.header && this.props.content ? this.props.header.height + this.props.content.height + ( this.props.ads && this.props.ads['banner-bottom'] && this.props.ads['banner-top'] ? this.props.ads['banner-bottom'].height + this.props.ads['banner-top'].height : 0 ) : 0
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
        if (!context) {
          onResize(state);
        } else {
          if (state.screen) {
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
