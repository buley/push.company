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
      onResize = _.debounce(function() {
        var node = document.getElementById("footer-container") || {};
        context.footer = context.footer || {};
        context.footer = _.extend(context.footer, {
          height: node ? node.clientHeight : 0,
          width: node ? node.clientWidth : 0
        });
        deferred.notify(context);
      }),
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          return React.DOM.section({
            id: "footer-container",
            style: {
              top: this.props.header && this.props.content && this.props.ads && this.props.ads['banner-bottom'] && this.props.ads['banner-top'] ? this.props.header.height + this.props.content.height + this.props.ads['banner-bottom'].height + this.props.ads['banner-top'].height : 0
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
          context = _.extend({}, state);
        } else {
          context = _.extend({}, state);
          if (context.screen) {
            if (context.screen.width !== prev.width) {
              onResize(context.screen.width, context.screen.height, prev.width, prev.height);
              prev.width = context.screen.width;
              prev.height = context.screen.height;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
