define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      min = 800,
      first = true,
      instance,
      content,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var sidebar_height = ctx.sidebar ? ctx.sidebar.height : 0;
        if (min > sidebar_height) {
          sidebar_height = min;
        }
        content = {
          height: sidebar_height,
          top:  ( ctx.header && ctx.header.height ? ctx.header.height : 0) + (ctx.ads && ctx.ads['banner-top'] ? ctx.ads['banner-top'].height : 0)
        };
        ctx.content = content;
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          return React.DOM.section({
            id: "content-container",
            style: {
              top: (this.props.content ? this.props.content.top : 0) + "px"
            }
          }, React.DOM.section({
            id: "content",
            style: {
              height: (this.props.content ? this.props.content.height : 0) + "px"
            }
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
          if (!state.content) {
            state.content = content;
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
