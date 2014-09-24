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
      getLogo = function(width, height, x, y) {
        var large = {
          width: 220,
          height: 68
        }, small = {
          width: 142,
          height: 44
        };
        if (y > 0) {
          return small;
        }
        return large;
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
              logo = getLogo(height, width, this.props.scroll ? this.props.scroll.y : 0);

          return React.DOM.header({
            id: "header-container",
            "data-height": height,
            "data-width": width,
            style: {
              top: this.props.scroll ? this.props.scroll.y : 0
            }
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
          }, !!this.props.header && !!this.props.header.logo && !!this.props.header.logo.text ? this.props.header.logo.text : ""), React.DOM.div({
            id: "header-menu-button",
            onClick: function(e) {

              if (true === anim) {
                return;
              }

              anim = true;
              animate();

              var tween = new Tween.Tween( { height: instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? 200 : 0 } )
                .to( { height: instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? 0 : 200 }, instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? 300 : 300 )
                .easing( instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? Tween.Easing.Quadratic.InOut : Tween.Easing.Elastic.InOut )
                .onUpdate(function() {
                    context.header = context.header || {};
                    context.header.drawer = _.extend(context.header.drawer, {
                      height: Math.round(this.height),
                      selected: instance.props.header.drawer.selected,
                      showing: instance.props.header.drawer.showing
                    });
                    deferred.notify(context);
                })
                .onComplete(function() {
                  anim = false;
                  context.header.drawer = _.extend(context.header.drawer, {
                    height: instance.props.header.drawer.height,
                    selected: instance.props.header.drawer.selected,
                    showing: instance.props.header && instance.props.header.drawer && instance.props.header.drawer.showing ? false : true
                  });
                  deferred.notify(context);
                })
                .start();

            },
            style: {
              background: (this.props.header && this.props.header.drawer && ( this.props.header.drawer.showing || true === anim) ? "#d0d0d0": "#b2b2b2")
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
            id: "header-drawer-container",
            style: {
              display: (this.props.header && this.props.header.drawer && ( this.props.header.drawer.showing || true === anim)) ? "block" : "none",
              top: (this.props.header ? this.props.header.height : 0) + "px",
              height: ( this.props.header && this.props.header.drawer && this.props.header.drawer.height ? this.props.header.drawer.height : 0 ) + "px"
            }
          }, React.DOM.div({
            id: "header-drawer-header"
          }), React.DOM.div({
            id: "header-drawer-inner"
          }, React.DOM.div({
            id: "header-drawer"
          })), React.DOM.div({
            id: "header-drawer-footer"
          }, React.DOM.div({
            id: "header-drawer-tabbar"
          }, React.DOM.nav({
            id: "header-drawer-tabbar-tabs"
          }, React.DOM.section({
            id: "header-drawer-tabbar-tab-categories"
          }, React.DOM.a({
            id: "header-drawer-tabbar-tab-categories-link",
            href: "#",
            className: ( this.props.header && this.props.header.drawer && "categories" === this.props.header.drawer.selected) ? "selected" : ""
          }, "Categories"), " | ", React.DOM.a({
            id: "header-drawer-tabbar-tab-people-link",
            href: "#"
          }, "People"), " | ", React.DOM.a({
            id: "header-drawer-tabbar-tab-places-link",
            href: "#"
          }, "Places"), " | ", React.DOM.a({
            id: "header-drawer-tabbar-tab-classifieds-link",
            href: "#"
          }, "Classifieds"), " | ", React.DOM.a({
            id: "header-drawer-tabbar-tab-recommended-link",
            href: "#"
          }, "Recommended")))))));
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
          state.header = _.extend((state.header || {}), { height: 44, zoom: mult, drawer: {
            showing: false,
            height: 0,
            selected: "categories"
          }, logo: {
            text: "Lipsum Daily"
          } } );
          deferred.notify(state);

        } else {
          context = _.extend(_.extend(state, { header: context.header}), context);
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
