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
        var min = ctx.content ? ctx.content.height : 800,
          sidebar_height = ctx.ads ? (ctx.ads['box-bottom'].top + ctx.ads['box-bottom'].height + 20 ) - (ctx.ads['box-top'].top - 20) : 0;
        ctx.sidebar = {
          height:  Math.max(min, sidebar_height),
          top: (ctx.header && ctx.header.height ? ctx.header.height : 0) + ( ctx.ads && ctx.ads['banner-top'] ? ctx.ads['banner-top'].height : 0 )
        };
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var min = this.props.content ? this.props.content.height : 800,
            sidebar_height = this.props.ads ? (this.props.ads['box-bottom'].top + this.props.ads['box-bottom'].height + 20 ) - (this.props.ads['box-top'].top - 20) : 0;

          return React.DOM.section({
            id: "sidebar-container",
            style: {
              top: (this.props.header && this.props.header.height ? this.props.header.height : 0) + ( this.props.ads && this.props.ads['banner-top'] ? this.props.ads['banner-top'].height : 0 ),//this.props.sidebar ? this.props.sidebar.top : 0,
              height: (this.props.header && this.props.header.height ? this.props.header.height : 0) + ( this.props.ads && this.props.ads['banner-top'] ? this.props.ads['banner-top'].height : 0 )//this.props.sidebar ? this.props.sidebar.height : 0
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
        var json;
        if (first) {
          first = false;
          if (state.screen) {
            prev.updated = state.screen.updated;
          }
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
