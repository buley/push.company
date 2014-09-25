define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      prev = {},
      sidebar,
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var node = document.getElementById("sidebar-container");
        ctx.sidebar = {
          height: node ? node.clientHeight : 0,
          width: node ? node.clientWidth : 0
        };
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          return React.DOM.section({
            id: "sidebar-container",
            style: {
              top: this.props.header && this.props.header.height && this.props.ads && this.props.ads['banner-top'] ? this.props.header.height + this.props.ads['banner-top'].height: 0,
              height: this.props.content ? this.props.content.height : 0
            }
          }, React.DOM.section({
            id: "sidebar"
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
          if (!state.sidebar) {
            state.sidebar = sidebar;
            deferred.notify(state);
          } else if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              onResize(state);
              prev.updated = state.screen.updated;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
