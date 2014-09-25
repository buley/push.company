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
        var node = document.getElementById("content-container");
        ctx.content = _.extend((ctx.content || {}), {
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
            id: "content-container",
            style: {
              top: this.props.header && this.props.header.height && this.props.ads && this.props.ads['banner-top'] ? this.props.header.height + this.props.ads['banner-top'].height : 0
            }
          }, React.DOM.section({
            id: "content",
            style: {
              height: "800px"
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
        if (!context) {
          onResize(state);
        } else {
          state = _.extend(state, { content: context.content} ) );
          if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              onResize(state);
              prev.updated = context.screen.updated;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
