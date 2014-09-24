define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      prev = {},
      slots = [],
      banners = [
        [234, 60],
        [320, 50],
        [468, 60],
        [728, 90],
        [970, 90]
      ],
      sizes = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      interval,
      adjustAds = function(props) {
        console.log('adjust ads');
        var top_el = document.getElementById("ads-banner-top") || {},
            top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
            top_width = top_el.offsetWidth ? top_el.offsetWidth : 0,
            header_el = document.getElementById("ads-box-header") || {},
            bottom_el = document.getElementById("ads-banner-bottom") || {},
            bottom_height = bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
            bottom_width = bottom_el.offsetWidth ? bottom_el.offsetWidth : 0,
            total_width = instance.props.screen ? instance.props.screen.width : 0,
            total_width_padding = total_width - top_width,
            total_width_padding_bottom = total_width - bottom_width,
            top_height_base = Math.floor((padding.top + padding.bottom)/2),
            top_width_base = Math.floor((padding.right + padding.left + total_width_padding)/2),
            bottom_width_base = Math.floor((padding.right + padding.left + total_width_padding_bottom)/2),
            bottom_height_base = 20;

        context.ads = context.ads || {};
        context.ads.sizes = _.extend((context.ads.sizes || {}), {
          "banner-top": {
            height: top_height,
            width: top_width
          },
          "banner-bottom": {
            height: bottom_height,
            width: bottom_width
          }
        });
        deferred.notify(context);
      },
      onResizeWindow = function() {
        expecting = slots.length;
        seen = 0;
        window.googletag.pubads().refresh(slots);
      },
      usable = [],
      first = false,
      expecting = 3,
      seen = 0,
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
            window.googletag.cmd.push(function() {
              window.googletag.display("ads-banner-top-ad");
            });
            window.googletag.cmd.push(function() {
              window.googletag.display("ads-banner-bottom-ad");
            });
            window.googletag.cmd.push(function() {
              window.googletag.display("ads-box-header-ad");
            });
        },
        render: function() {
          /*
          <div id='div-gpt-ad-1411489889191-0'>
            <script type='text/javascript'>
            googletag.cmd.push(function() { googletag.display('div-gpt-ad-1411489889191-0'); });
            </script>
          </div>
          */
          var mounted = this.isMounted(),
              top_el = document.getElementById("ads-banner-top") || {},
              top_height = mounted && top_el.offsetHeight ? top_el.offsetHeight : 0,
              top_width = mounted && top_el.offsetWidth ? top_el.offsetWidth : 0,
              bottom_el = document.getElementById("ads-banner-bottom") || {},
              bottom_height = mounted && bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
              bottom_width = mounted && bottom_el.offsetWidth ? bottom_el.offsetWidth : 0,
              total_width = mounted && this.props.screen ? this.props.screen.width : 0,
              total_width_padding = total_width - top_width,
              total_width_padding_bottom = total_width - bottom_width,
              top_height_base = Math.floor((padding.top + padding.bottom)/2),
              top_width_base = Math.floor((padding.right + padding.left + total_width_padding)/2),
              bottom_width_base = Math.floor((padding.right + padding.left + total_width_padding_bottom)/2),
              bottom_height_base = 20;

          if (total_width_padding < 0) {
            total_width_padding = 0;
          }
          if (total_width_padding > total_width) {
            total_width_padding = total_width;
          }

          return React.DOM.section({
            id: "ads"
          }, React.DOM.section({
            id: "ads-banner-top",
            style: {
              "left": top_width_base + "px",
              "top": (this.props.header && this.props.header.height ? this.props.header.height + top_height_base: top_height_base) + "px"
            }
          }, React.DOM.div({
            id: "ads-banner-top-ad"
          }) ), React.DOM.section({
            id: "ads-banner-bottom",
            style: {
              "left": bottom_width_base + "px",
              "bottom": bottom_height_base + "px"
            }
          }, React.DOM.div({
            id: "ads-banner-bottom-ad"
          }) ), React.DOM.section({
            id: "ads-box-header"
          }, React.DOM.div({
            id: "ads-box-header-ad"
          }) ) );
        }
      });

  module.resolve(component);

  googletag.pubads().addEventListener('slotRenderEnded', function(event) {

    if (!_.contains(slots, event.slot)) {
      slots.push(event.slot);
    }

    if (expecting > 0 && ++seen >= expecting) {
      console.log('finsihed');
      seen = 0;
      expecting = 0;
      adjustAds();
    } else {
      console.log(seen, expecting);
    }

  });

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        if (!context) {
          context = _.extend({}, _.extend({ ads: { loaded: false }}, state));
          deferred.notify(context);
        } else {
          context = _.extend({}, state);
          if (context.screen) {
            if (context.screen.width !== prev.width || context.screen.height !== prev.height) {
              onResizeWindow(context.screen.width, context.screen.height, prev.width, prev.height);
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
