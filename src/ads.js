define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      ads,
      first = true,
      instance,
      mapping = [
        [ [1010, 1], [ [970, 250], [970, 90], [728, 90], [468, 60], [120, 60], [180, 150], [320, 50], [234, 60] ] ],
        [ [768, 1], [ [728, 90], [468, 60], [120, 60], [180, 150], [320, 50], [234, 60] ] ],
        [ [508, 1], [ [468, 60], [120, 60], [180, 150], [320, 50], [234, 60] ] ],
        [ [0, 0], [ [120, 60], [180, 150], [320, 50], [234, 60] ] ]
      ],
      boxmapping = [
        [ [768, 1], [ [300, 250], [300, 600], [120, 60], [180, 150], [320, 50], [234, 60] ] ],
        [ [0, 0], [] ]
      ],
      expecting = 0,
      seen = 0,
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
      onResize = function(ctx) {
        context = ctx;
        expecting = slots.length;
        seen = 0;
        if (expecting > 0) {
          window.googletag.pubads().refresh(slots);
        }
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

          var y = window.scrollY,
              header = document.getElementById("header"),
              header_height = header ? header.offsetHeight : 0,
              footer = document.getElementById("footer-container"),
              footer_height = footer ? footer.offsetHeight : 0,
              top_el = document.getElementById("ads-banner-top") || {},
              top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
              top_width = top_el.offsetWidth ? top_el.offsetWidth : 0,
              content = document.getElementById("content-container"),
              height = content ? content.offsetHeight : 0,
              bottom_el = document.getElementById("ads-banner-bottom") || {},
              bottom_height = bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
              bottom_width = bottom_el.offsetWidth ? bottom_el.offsetWidth : 0,
              box_bottom_el = document.getElementById("ads-box-bottom") || {},
              box_bottom_height = box_bottom_el.offsetHeight ? box_bottom_el.offsetHeight : 0,
              box_bottom_width = box_bottom_el.offsetWidth ? box_bottom_el.offsetWidth : 0,
              box_top_el = document.getElementById("ads-box-top") || {},
              box_top_height = box_top_el.offsetHeight ? box_top_el.offsetHeight : 0,
              box_top_width = box_top_el.offsetWidth ? box_top_el.offsetWidth : 0,
              total_width = document.body.offsetWidth || 0,
              total_width_padding = total_width - top_width,
              total_width_padding_bottom = total_width - bottom_width,
              bottom_width_base = Math.floor(total_width_padding_bottom/2),
              top_width_base = Math.floor(total_width_padding/2),
              box_top = (header_height + padding.top + top_height + padding.bottom + padding.top),
              sidebar = padding.top + box_top_height + padding.bottom + padding.top + box_bottom_height + padding.bottom,
              content_top = header_height + padding.top + top_height + padding.bottom,
              total = header_height + padding.top + top_height + padding.bottom + height + padding.top + bottom_height + padding.bottom + footer_height;

          if (sidebar > height) {
            height = sidebar;
          }
          if (y > total) {
            y = total;
          } else if (y < 0) {
            y = 0;
          }

          return React.DOM.section({
            id: "ads"
          }, React.DOM.section({
            id: "ads-banner-top",
            style: {
              "left": top_width_base + "px",
              "top": (header_height + padding.top) + "px"
            }
          }, React.DOM.div({
            id: "ads-banner-top-ad"
          }) ), React.DOM.section({
            id: "ads-banner-bottom",
            style: {
              "top": (content_top + height + padding.bottom) + "px",
              "left": bottom_width_base + "px",
            }
          }, React.DOM.div({
            id: "ads-banner-bottom-ad"
          }) ), React.DOM.section({
            id: "ads-box-header",
            style: {
              right: "50px",
              top: ( y + 5 ) + "px"
            }
          }, React.DOM.div({
            id: "ads-box-header-ad"
          }) ), React.DOM.section({
            id: "ads-box-top",
            style: {
              "right": padding.right + "px",
              "top": box_top + "px"
            }
          }, React.DOM.div({
            id: "ads-box-top-ad"
          }) ), React.DOM.section({
            id: "ads-box-bottom",
            style: {
              "right": padding.right + "px",
              "top": (box_top + box_top_height + padding.bottom + padding.top) + "px" //stream TK
            }
          }, React.DOM.div({
            id: "ads-box-bottom-ad"
          }) ) );
        }
      });

  module.resolve(component);

  googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    if (!_.contains(slots, event.slot)) {
      slots.push(event.slot);
    }
    if (expecting > 0 && ++seen >= expecting) {
      seen = 0;
      expecting = 0;
      context.ads = context.ads || {};
      context.ads.updated = Date.now();
      deferred.notify(context);
      console.log('updated ads',context.ads.updated);
    }
  });

  googletag.cmd.push(function() {

    var top_banner,
        bottom_banner,
        top_box,
        bottom_box;

    googletag.pubads().enableSingleRequest();
    googletag.pubads().disableInitialLoad();
    googletag.pubads().collapseEmptyDivs();

    top_banner = googletag.defineSlot('/270461283/Banner', [], "ads-banner-top-ad")
      .addService(googletag.pubads());
    slots.push( top_banner );
    bottom_banner = googletag.defineSlot('/270461283/Banner', [], "ads-banner-bottom-ad")
      .addService(googletag.pubads());
    slots.push( bottom_banner );

    top_banner.defineSizeMapping(mapping);
    bottom_banner.defineSizeMapping(mapping);

    slots.push( googletag.defineSlot('/270461283/Box', [[88, 31]], "ads-box-header-ad")
        .addService(googletag.pubads()) );

    top_box = googletag.defineSlot('/270461283/Box', [[88, 31]], "ads-box-top-ad")
        .addService(googletag.pubads());
    top_box.defineSizeMapping(boxmapping);
    slots.push(top_box);

    bottom_box = googletag.defineSlot('/270461283/Box', [[88, 31]], "ads-box-bottom-ad")
        .addService(googletag.pubads());
    slots.push(bottom_box);
    bottom_box.defineSizeMapping(boxmapping);

    expecting = slots.length;

    googletag.enableServices();

  });

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        if (first) {
          first = false;
          onResize(state);
        } else {
          var refresh = false,
              adjust = false;

          if (state.ads) {

            if (state.screen) {
              if (prev.xupdated && state.screen.updated !== prev.xupdated) {
                refresh = true;
                adjust = true;
                prev.xupdated = state.screen.updated;
              } else if (!prev.xupdated) {
                prev.xupdated = state.screen.updated;
              }
            }

            if (state.scroll) {
              if (prev.yupdated && state.scroll.updated !== prev.yupdated) {
                adjust = true;
                prev.yupdated = state.scroll.updated;
              } else if (!prev.yupdated) {
                prev.yupdated = state.scroll.updated;
              }
            }

            if (true === refresh && true === adjust) {
              onResize(state);
            }
          }

        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
