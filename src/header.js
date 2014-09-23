define(['q', 'react', 'mapbox', 'underscore'], function(Q, React, L, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      mult = 0.9,
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
      getLogo = function(width, height) {
        return {
          width: 180,
          height: 60
        }
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
              width = mounted ? nodeWidth(node) : 0,
              logo = getLogo(height, width);
          return React.DOM.header({
            id: "header-container",
            "data-height": height,
            "data-width": width,
          }, React.DOM.div({
            id: "header-over",
            style: {
              height: (this.props.header ? this.props.header.height : 0) + "px"
            }
          }, React.DOM.div({
            id: "header-logo",
            style: {
              background: '#000',
              height: logo.height,
              width: logo.width
            }
          })), React.DOM.div({
            id: "header-inner",
            style: {
              height: (this.props.header ? this.props.header.height : 0) + "px"
            }
          }, React.DOM.div({
            id: "header"
          })), React.DOM.div({
            id: "header-under",
            style: {
              height: ( this.props.header ? this.props.header.height : 0 ) + "px"
            }
          }));
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
          context = _.extend({}, _.extend({header: { height: 44, zoom: mult } }, state));
          deferred.notify(context);
        } else {
          context = _.extend({}, state);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
