define(['q', 'react', 'mapbox', 'underscore'], function(Q, React, L, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context = {},
      instance,
      nodeHeight = function(el, sum) {
        if (!el) {
          return NaN;
        }
        var x, xlen;
        sum = sum || 0;
        if (!!el.children && el.children.length > 0) {
          for (x = 0, xlen = el.children.length; x < xlen; x += 1) {
            sum += nodeHeight(el.children[x], 0);
          }
        }
        sum += el.offsetHeight;
        return sum;
      },
      nodeWidth = function(el, sum) {
        if (!el) {
          return NaN;
        }
        var x, xlen;
        sum = sum || 0;
        if (!!el.children && el.children.length > 0) {
          for (x = 0, xlen = el.children.length; x < xlen; x += 1) {
            sum += nodeWidth(el.children[x], 0);
          }
        }
        sum += el.offsetWidth;
        return sum;
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          //TODO: Render map
          //renderMap.apply(this, arguments);
          var mounted = this.isMounted(),
              node = mounted ? this.getDOMNode() : null,
              height = mounted ? nodeHeight(node) : 0,
              width = mounted ? nodeWidth(node) : 0;
          console.log("PROPS",this.props);
          return React.DOM.header({
            id: "header-container",
            "data-height": height,
            "data-width": width,
          }, React.DOM.div({
            id: "header-inner"
          }, React.DOM.div({
            id: "header"
          })));
        }
      });

  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        context = _.extend({}, state);
        if (!!state.route && !!state.route.hash && !!state.route.hash.overlay) {
          overlays = _.unique(state.route.hash.overlay.split(","));
          map_state.overlays = overlays;
          delete context.route.hash.overlay;
          deferred.notify(context);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
