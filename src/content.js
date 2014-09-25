define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      min = 800,
      first = true,
      instance,
      content,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var el = document.getElementById("content");
        content = {
          height: el ? el.offsetHeight : 0,
          width: el ? el.offsetWidth : 0
        };
        ctx.content = content;
        deferred.notify(ctx);
      },
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var height = 800,
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
              height = 800,
              sidebar = box_top_height + box_bottom_height, //plus stream TK
              content_top = header_height + top_height;

          if (sidebar > height) {
            height = sidebar;
          }
          return React.DOM.section({
            id: "content-container",
            style: {
              top: (padding.top + content_top + padding.bottom)  "px"
            }
          }, React.DOM.section({
            id: "content",
            style: {
              height: height + "px"
            }
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
          onResize(state);
        } else {
          if (!state.content) {
            state.content = content;
            deferred.notify(state);
          } else if (state.screen) {
            if (state.screen.updated !== prev.updated) {
              prev.updated = state.screen.updated;
              onResize(state);
            }
          } else {
            json = ads.json;
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
