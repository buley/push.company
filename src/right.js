define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      first = true,
      instance,
      prev = {},
      right,
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        return;
        var el = document.getElementById("right-container"),
            style = window.getComputedStyle(el);
        ctx.right = {
          height: parseFloat(el.height.replace(/px$/, ''),10),
          top: parseFloat(el.top.replace(/px$/, ''),10)
        };
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
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
            id: "right-container",
            style: {
              top: box_top,
              height: (box_top_height + box_bottom_height + (2 * padding.top) + (2 * padding.bottom))
            }
          }, React.DOM.section({
            id: "right"
          } ) );
        }
      });

  module.resolve(component);

  return {
    outgoing: function(interface) {
      interface(promise);
    },
    incoming: function(interface) {
      interface.then(null, null, function(state) {
        var json;
        if (first) {
          first = false;
          if (state.screen) {
            prev.updated = state.screen.updated;
          }
          onResize(state);
        } else {
          if (!state.right) {
            state.right = right;
            deferred.notify(state);
          } else if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              prev.updated = state.screen.updated;
              onResize(state);
            }
          } else {
            json = JSON.stringify(state.ads);
            if (json !== prev.json) {
              prev.json = json;
              onResize(state);
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
