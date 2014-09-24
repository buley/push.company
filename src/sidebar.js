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
        var node = document.getElementById("sidebar-container");
        context.sidebar = _.extend((context.sidebar || {}), {
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
            id: "sidebar-container",
            style: {
              top: this.props.header && this.props.header.height && this.props.ads && this.props.ads.sizes && this.props.ads.sizes['banner-top'] ? this.props.header.height + this.props.ads.sizes['banner-top'].height: 0
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
          context = _.extend({}, _.extend(state, { sidebar: { loaded: true }}));
          deferred.notify(context);
        } else {
          context = _.extend({}, state);
          if (context.screen) {
            if (context.screen.width !== prev.width || context.screen.height !== prev.height) {
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
