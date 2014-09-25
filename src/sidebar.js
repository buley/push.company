define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      first = true,
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
        var min = ctx.content ? ctx.content.height : 0,
          sidebar_height = ctx.ads ? ctx.ads['box-bottom'].top + ctx.ads['box-bottom'].height + 20 ) - (ctx.ads['box-top'].top - 20) : 0;
        ctx.sidebar = {
          height:  Math.max(min, sidebar_height),
          top: (ctx.header && ctx.header.height ? ctx.header.height : 0) + ( ctx.ads && ctx.ads['banner-top'] ? ctx.ads['banner-top'].height : 0 ) : 0
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
              top: this.props.sidebar.top,
              height: this.props.sidebar.height
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
        if (first) {
          first = false;
          onResize(state);
        } else {
          if (!state.sidebar) {
            state.sidebar = sidebar;
            deferred.notify(state);
          } else if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              prev.updated = state.screen.updated;
              onResize(state);
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
