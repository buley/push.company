define(['q', 'react', 'mapbox', 'underscore', 'tween'], function(Q, React, L, _, Tween) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      mult = 0.9,
      anim = false;
      animate = function (time) {
        if (true === anim) {
          window.requestAnimationFrame( animate );
        }
        Tween.update(time);
      },
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
          width: 110,
          height: 68
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
              height: logo.height,
              width: logo.width
            }
          }), React.DOM.div({
            id: "header-menu-button",
            onClick: function(e) {

              anim = true;
              animate();

              var tween = new Tween.Tween( { height: instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? 200 : 0 } )
                .to( { height: instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? 0 : 200 }, 2000 )
                .easing( Tween.Easing.Elastic.InOut )
                .onUpdate(function() {
                    context = _.extend(context, {header: {drawer: {
                      height: this.height,
                      showing: instance.props.header.drawer.showing
                    }}});
                    deferred.notify(context);
                })
                .onComplete(function() {
                  anim = false;
                  context = _.extend(context, {header: {drawer: {
                    showing: instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? false : true
                  }}});
                  deferred.notify(context);
                })
                .start();

            },
            style: {
              background: (this.props.header && this.props.header.drawer && this.props.header.drawer.showing ? "#d0d0d0": "#b2b2b2")
            }
          }, React.DOM.img({
            src: '/img/tab_white_list.png'
          }))), React.DOM.div({
            id: "header-inner",
            style: {
              height: (this.props.header ? this.props.header.height : 0) + "px"
            }
          }, React.DOM.div({
            id: "header"
          }), React.DOM.div({
            id: "header-under",
            style: {
              height: ( this.props.header ? this.props.header.height : 0 ) + "px"
            }
          })), React.DOM.div({
            id: "header-drawer",
            style: {
              top: (this.props.header ? this.props.header.height : 0) + "px",
              height: ( this.props.header && this.props.header.drawer && this.props.header.drawer.showing ? this.props.header.drawer.height : 0 ) + "px"
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
          context = _.extend({}, _.extend({header: { height: 44, zoom: mult, drawer: {
            showing: false,
            height: 0
          } } }, state));
          deferred.notify(context);
        } else {
          context = _.extend({}, state);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
