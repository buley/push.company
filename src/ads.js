define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      prev = {},
      slots = {},
      getSlotId = function(sizes) {
        var pieces = [],
            x,
            xlen = sizes.length,
            key,
            x,
            width,
            height,
            size,
            y,
            ylen = banners.length,
            ok = [];
        for (x = 0; x < xlen; x += 1) {
          size = sizes[x];
          for (y = 0; y < ylen; y += 1) {
            if (banners[y][0] < width && banners[y][1] < height) {
              ok.push(banners[y]);
            }
          }
          pieces.push(sizes[x].join("x"));
        }
        if (!slots[key]) {
          slots[key] = {
            node: document.createElement('div'),
            sizes: ok
          };
          slots[key].node.id = key;
        }
        return key;
      },
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
      onResize = function() {
        startCheck();
        updateAvailable();
      },
      usable = [],
      updateAvailable = _.debounce( function() {
        var node = instance.getDOMNode(),
            width = node.clientWidth,
            height = node.clientHeight,
            notify = false,
            x,
            xlen = banners.length,
            ok = [];
        for (x = 0; x < xlen; x += 1) {
          if (banners[x][0] < width && banners[x][1] < height) {
            ok.push(banners[x]);
          }
        }
        usable = ok;
        console.log("WHAT WORKS?", width, height, usable);
        stopCheck();
      }, 1000 ),
      stopCheck = function() {
        if (interval) {
          window.clearInterval(interval);
        }
      },
      startCheck = function() {
        if (!context) {
          return;
        }
        if (!interval) {
          interval = window.setInterval(function() {
            if (instance && instance.isMounted()) {
              var node = instance.getDOMNode(),
                  width = node.clientWidth,
                  height = node.clientHeight,
                  notify = false;
              sizes["top-banner"] = sizes["top-banner"] || {};
              if ( sizes["top-banner"].width !== width) {
                notify = true;
                sizes["top-banner"].width = width;
              }
              if ( sizes["top-banner"].height !== height) {
                notify = true;
                sizes["top-banner"].height = height;
              }
              if (true === notify) {
                context.ads = context.ads || {};
                context.ads.sizes = _.extend((context.ads.sizes || {}), sizes);
                deferred.notify(context);
                updateAvailable(width, height);
              }
            }
          }, 100);
        }
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
            var node = this.getDOMNode(),
                width = node.parentNode.offsetWidth,
                height = node.parentNode.offsetHeight,
                x,
                xlen = banners.length,
                ok = [];
            for (x = 0; x < xlen; x += 1) {
              if (banners[x][0] < width && (0 === height || banners[x][1] < height)) {
                ok.push(banners[x]);
              }
            }
            usable = ok;
            window.googletag.cmd.push(function() {
              window.googletag.display(getSlotId(usable));
            });
            startCheck();
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
              node = mounted ? this.getDOMNode() : null,
              el = node ? document.getElementById("ads-banner-top") : {},
              height = mounted && el.offsetHeight ? el.offsetHeight : 0,
              width = mounted && el.offsetWidth ? el.offsetWidth : 0,
              total_width = mounted && this.props.screen ? this.props.screen.width : 0,
              total_width_padding = total_width - width,
              height_base = Math.floor((padding.top + padding.bottom)/2),
              width_base = Math.floor((padding.right + padding.left + total_width_padding)/2);

          if (total_width_padding < 0) {
            total_width_padding = 0;
          }
          if (total_width_padding > total_width) {
            total_width_padding = total_width;
          }

          return React.DOM.section({
            id: "ads-banner-top",
            "data-height": height,
            "data-width": width,
            style: {
              "left": width_base + "px",
              "top": (this.props.header && this.props.header.height ? this.props.header.height + height_base: height_base) + "px"
            }
          }, React.DOM.div({
            id: getSlotId(usable)
          }) );
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
          context = _.extend({}, _.extend({ ads: { loaded: false }}, state));
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
