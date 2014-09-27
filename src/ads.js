define(['q', 'react', 'underscore', 'src/layout' ], function(Q, React, _, layout) {
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
          var current = layout.current();
          return React.DOM.section({
            id: "ads"
          }, React.DOM.section({
            id: "ads-banner-top",
            style: {
              "left": current.top_width_base + "px",
              "top": (current.header_height + padding.top) + "px"
            }
          }, React.DOM.div({
            id: "ads-banner-top-ad"
          }) ), React.DOM.section({
            id: "ads-banner-bottom",
            style: {
              "top": (current.content_top + current.height + padding.bottom) + "px",
              "left": current.bottom_width_base + "px",
            }
          }, React.DOM.div({
            id: "ads-banner-bottom-ad"
          }) ), React.DOM.section({
            id: "ads-box-header",
            style: {
              right: "50px",
              top: ( current.y + 5 ) + "px"
            }
          }, React.DOM.div({
            id: "ads-box-header-ad"
          }) ), React.DOM.section({
            id: "ads-box-top",
            style: {
              "right": padding.right + "px",
              "top": current.box_top + "px"
            }
          }, React.DOM.div({
            id: "ads-box-top-ad"
          }) ), React.DOM.section({
            id: "ads-box-bottom",
            style: {
              "right": padding.right + "px",
              "top": (current.box_top + current.box_top_height + padding.bottom + padding.top) + "px" //stream TK
            }
          }, React.DOM.div({
            id: "ads-box-bottom-ad"
          }) ), React.DOM.section({
            id: "ads-box-top-left",
            style: {
              "left": padding.left + "px",
              "top": current.box_top + "px"
            }
          }, React.DOM.div({
            id: "ads-box-top-ad-left"
          }) ), React.DOM.section({
            id: "ads-box-bottom-left",
            style: {
              "left": padding.left + "px",
              "top": (current.box_top + current.left_box_top_height + padding.bottom + padding.top) + "px" //stream TK
            }
          }, React.DOM.div({
            id: "ads-box-bottom-ad-left"
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
        bottom_box,
        top_box_left,
        bottom_box_left;

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

    top_box_left = googletag.defineSlot('/270461283/Box', [[88, 31]], "ads-box-top-ad-left")
        .addService(googletag.pubads());
    top_box_left.defineSizeMapping(boxmapping);
    slots.push(top_box_left);

    bottom_box_left = googletag.defineSlot('/270461283/Box', [[88, 31]], "ads-box-bottom-ad-left")
        .addService(googletag.pubads());
    slots.push(bottom_box_left);
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
