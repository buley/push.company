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
          height: el.offsetHeight,
          width: el.offsetWidth
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
              sidebar = (this.props.ads && this.props.ads['box-top'] && this.props.ads['box-bottom'] ? this.props.ads['box-top'].height + this.props.ads['box-bottom'].height : 0);
          if (sidebar > height) {
            height = sidebar;
          }
          return React.DOM.section({
            id: "content-container",
            style: {
              top: ( this.props.header && this.props.header.height ? this.props.header.height : 0) + (this.props.ads && this.props.ads['banner-top'] ? this.props.ads['banner-top'].height : 0) + "px"
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
