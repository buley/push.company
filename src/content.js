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
        var node = document.getElementById("content-container");
        content = {
          height: node ? node.clientHeight : 0
        };
        ctx.content = content;
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var sidebar_height = this.props.ads ? (this.props.ads['box-top'].top - 20) - (this.props.ads['box-bottom'].top + this.props.ads['box-bottom'].height + 20) : 0;
          if (min > sidebar_height) {
            sidebar_height = min;
          }
          return React.DOM.section({
            id: "content-container",
            style: {
              top: this.props.header && this.props.header.height && this.props.ads && this.props.ads['banner-top'] ? this.props.header.height + this.props.ads['banner-top'].height : 0
            }
          }, React.DOM.section({
            id: "content",
            style: {
              height: sidebar_height + "px"
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
            deferred.notify(ctx);
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
