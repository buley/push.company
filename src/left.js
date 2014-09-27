define(['q', 'react', 'underscore', 'layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      first = true,
      instance,
      prev = {},
      left,
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = function(ctx) {
        var el = document.getElementById("left-container"),
            style = window.getComputedStyle(el);
        ctx.left = {
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
          return React.DOM.section({
            id: "left-container",
            style: {
              top: (this.props.header && this.props.header.height ? this.props.header.height : 0) + ( this.props.ads && this.props.ads['banner-top'] ? this.props.ads['banner-top'].height : 0 ) + "px",//this.props.left ? this.props.left.top : 0,
              height: ( this.props.ads && this.props.ads['banner-top'] ? (this.props.ads['banner-bottom'].top + this.props.ads['banner-bottom'].height) - this.props.ads['banner-top'].top : 0 ) + "px"//this.props.left ? this.props.left.height : 0
            }
          }, React.DOM.section({
            id: "left"
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
          if (!state.left) {
            state.left = left;
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
