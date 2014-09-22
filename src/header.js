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
            sum += nodeHeight(el.children[x], sum);
          }
        } else {
          sum += el.offsetHeight;/* +
           (parseFloat(el.style.getPropertyValue('margin-top')) || 0) +
           (parseFloat(el.style.getPropertyValue('margin-bottom')) || 0);*/
        }
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
            sum += nodeWidth(el.children[x], 0) +
             (parseFloat(el.style.getPropertyValue('padding-top')) || 0) +
             (parseFloat(el.style.getPropertyValue('padding-bottom')) || 0);
          }
        } else {
          sum += el.offsetWidth;/* +
           (parseFloat(el.style.getPropertyValue('margin-top')) || 0) +
           (parseFloat(el.style.getPropertyValue('margin-bottom')) || 0);*/
        }
        return sum;
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          //TODO: Render map
          //renderMap.apply(this, arguments);
          return React.DOM.header({
            id: "header-container",
            "data-header-container-height": this.isMounted() ? nodeHeight(this.getDOMNode()) : 0,
            "data-header-container-width": this.isMounted() ? nodeWidth(this.getDOMNode()) : 0
          }, React.DOM.div({
            id: "header-inner"
          }, React.DOM.div({
            id: "header",
            "data-header-height": this.isMounted() ? nodeHeight(this.getDOMNode()) : 0,
            "data-header-width": this.isMounted() ? nodeWidth(this.getDOMNode()) : 0

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
