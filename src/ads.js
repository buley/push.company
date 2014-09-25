define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
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
      adjustAds = function(props) {

        if (!props) {
          return;
        }

        var box_ad_padding = 20,
            y = y = window.scrollY,
            orig,
            bottom_box_top,
            top_el = document.getElementById("ads-banner-top") || {},
            top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
            top_width = top_el.offsetWidth ? top_el.offsetWidth : 0,
            bottom_el = document.getElementById("ads-banner-bottom") || {},
            bottom_height = bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
            bottom_width = bottom_el.offsetWidth ? bottom_el.offsetWidth : 0,
            total_width = document.body.offsetWidth || 0,
            total_width_padding = total_width - top_width,
            total_width_padding_bottom = total_width - bottom_width,
            top_width_base = Math.floor(total_width_padding/2),
            bottom_width_base = Math.floor(total_width_padding_bottom/2),
            box_top = (props.header && props.header.height ? props.header.height + top_height + padding.top + padding.bottom + box_ad_padding: 0),
            sidebar_height_base = props.header && props.header.height ? props.header.height + top_height + padding.top + padding.bottom + padding.top: 0;
            bottom_height_base = props.header && props.header.height ? props.header.height + top_height + padding.top + padding.bottom + ( props.content ? props.content.height : 0 ) + padding.top: 0,
            box_bottom_el = document.getElementById("ads-box-bottom") || {},
            box_bottom_height = box_bottom_el.offsetHeight ? box_bottom_el.offsetHeight : 0,
            box_bottom_width = box_bottom_el.offsetWidth ? box_bottom_el.offsetWidth : 0,
            box_top_el = document.getElementById("ads-box-top") || {},
            box_top_height = box_top_el.offsetHeight ? box_top_el.offsetHeight : 0,
            box_top_width = box_top_el.offsetWidth ? box_top_el.offsetWidth : 0,
            total = (this.props.header ? this.props.header.height : 0) + (this.props.ads ? this.props.ads['banner-top'].height + this.props.ads['banner-bottom'].height : 0) + (this.props.content ? this.props.content.height : 0) + (this.props.footer ? this.props.footer.height : 0);

        if (y > total) {
          y = total;
        } else if (y < 0) {
          y = 0;
        };

        /*
        if (props.header && ((y + props.header.height) >= ( box_top + box_ad_padding ))) {
          //orig = box_top;
          if ( props.content && (y + box_ad_padding + props.header.height + box_top_height) > ((props.header && props.header.height && props.ads && props.ads['banner-top'] ? props.header.height + props.ads['banner-top'].height + box_ad_padding: 0) + props.content.height)) {
            console.log('too far');
          } else {
            box_top = y + box_ad_padding + props.header.height;
          }
          //if (y > (sidebar_height_base + (props.sidebar ? props.sidebar.height : 0))) {
          //  box_top = (sidebar_height_base + (props.sidebar ? props.sidebar.height : 0)) - ( props.ads ? props.ads['box-top'].height : 0 );
          //}
        }

        */
        bottom_box_top = box_top + box_top_height + ((props.stream && props.stream.height > 20 ? 2 : 1) * box_ad_padding );

        props.ads = props.ads || {};
        props.ads = _.extend(props.ads, {
          "banner-top": {
            height: top_height + padding.top + padding.bottom,
            width: top_width + padding.left + padding.right,
            top: (props.header && props.header.height ? props.header.height + padding.top: padding.top),
            left: top_width_base,
            right: null
          },
          "banner-bottom": {
            height: bottom_height + padding.top + padding.bottom,
            width: bottom_width + padding.left + padding.right,
            top: bottom_height_base,
            left: bottom_width_base,
            right: null
          },
          "box-top": {
            height: box_bottom_height,
            width: box_bottom_width,
            top: box_top,
            left: null,
            right: box_ad_padding
          },
          "box-bottom": {
            height: box_bottom_height,
            width: box_bottom_width,
            top: bottom_box_top,
            left: null,
            right: box_ad_padding
          }
        });

        deferred.notify(props);

      },
      onResize = function() {
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
              total = (this.props.header ? this.props.header.height : 0) + (this.props.ads ? this.props.ads['banner-top'].height + this.props.ads['banner-bottom'].height : 0) + (this.props.content ? this.props.content.height : 0) + (this.props.footer ? this.props.footer.height : 0);
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
              "left": (this.props.ads ? this.props.ads['banner-top'].left : 0) + "px",
              "top": (this.props.ads ? this.props.ads['banner-top'].top : 0)
            }
          }, React.DOM.div({
            id: "ads-banner-top-ad"
          }) ), React.DOM.section({
            id: "ads-banner-bottom",
            style: {
              "left": (this.props.ads ? this.props.ads['banner-bottom'].left : 0) + "px",
              "top": (this.props.ads ? this.props.ads['banner-bottom'].top : 0)
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
              "right": (this.props.ads ? this.props.ads['box-top'].right : 0) + "px",
              "top": (this.props.ads ? this.props.ads['box-top'].top : 0)
            }
          }, React.DOM.div({
            id: "ads-box-top-ad"
          }) ), React.DOM.section({
            id: "ads-box-bottom",
            style: {
              "right": (this.props.ads ? this.props.ads['box-bottom'].right : 0) + "px",
              "top": (this.props.ads ? this.props.ads['box-bottom'].top : 0)
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
      adjustAds(context);
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
    bottom_banner =googletag.defineSlot('/270461283/Banner', [], "ads-banner-bottom-ad")
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
        if (!context) {
          context = _.extend({}, state);
        } else {
          var refresh = false,
              adjust = false;

          context = _.extend({}, _.extend(state, { ads: context.ads}));

          if (context.screen) {
            if (context.screen.updated !== prev.xupdated) {
              refresh = true;
              adjust = true;
              prev.xupdated = context.screen.updated;
            }
          }

          if (context.scroll) {
            if (context.scroll.updated !== prev.yupdated) {
              adjust = true;
              prev.yupdated = context.scroll.updated;
            }
          }

          if (false === refresh && true === adjust) {
            adjustAds(context);
          } else if (true === refresh && true === adjust) {
            onResize();
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
