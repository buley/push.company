define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      instance,
      footer,
      first = true,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var node = document.getElementById("footer-container") || {};
        footer = {
          height: node ? node.clientHeight : 0
        };
        ctx.footer = footer;
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var content = document.getElementById("content-container"),
              height = content ? content.offsetHeight : 0,
              header = document.getElementById("header"),
              header_height = header ? header.offsetHeight : 0,
              box_bottom_el = document.getElementById("ads-box-bottom") || {},
              box_bottom_height = box_bottom_el.offsetHeight ? box_bottom_el.offsetHeight : 0,
              box_bottom_width = box_bottom_el.offsetWidth ? box_bottom_el.offsetWidth : 0,
              box_top_el = document.getElementById("ads-box-top") || {},
              box_top_height = box_top_el.offsetHeight ? box_top_el.offsetHeight : 0,
              box_top_width = box_top_el.offsetWidth ? box_top_el.offsetWidth : 0,
              top_el = document.getElementById("ads-banner-top") || {},
              top_height = top_el.offsetHeight ? top_el.offsetHeight : 0,
              top_width = top_el.offsetWidth ? top_el.offsetWidth : 0,
              bottom_el = document.getElementById("ads-banner-bottom") || {},
              bottom_height = bottom_el.offsetHeight ? bottom_el.offsetHeight : 0,
              bottom_width = bottom_el.offsetWidth ? bottom_el.offsetWidth : 0,
              sidebar = padding.top + box_top_height + padding.bottom + padding.top + box_bottom_height + padding.bottom,
              content_top = header_height + top_height;

          if (sidebar > height) {
            height = sidebar;
          }
          return React.DOM.section({
            id: "footer-container",
            style: {
              "top": (content_top + height + bottom_height + 80) + "px",
            }
          }, React.DOM.section({
            id: "footer"
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
        if (first) {
          first = false;
          onResize(state);
        } else {
          if (!state.footer) {
            state.footer = footer;
            deferred.notify(footer);
          } else if (state.screen) {
            if (state.screen.width !== prev.width) {
              onResize(state);
              prev.width = state.screen.width;
            }
          }
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
