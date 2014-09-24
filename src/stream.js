define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      prev = {},
      padding = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      onResize = _.debounce(function() {
        if (context) {
          var node = document.getElementById("stream-container");
          context.stream = _.extend((context.stream || {}), {
            height: node ? node.clientHeight : 0,
            width: node ? node.clientWidth : 0
          });
          deferred.notify(context);
        }
      }),
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {

          var y,
              orig,
              box_top = (this.props.header && this.props.header.height && this.props.ads && this.props.ads['banner-top'] ? this.props.header.height + this.props.ads['banner-top'].height + padding.top: 0),
              padding = {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
              },
              box_ad_padding = 20,
              sidebar_height_base = this.props.header && this.props.header.height && this.props.ads && this.props.ads['banner-top'] ? this.props.header.height + this.props.ads['banner-top'].height + padding.top: 0;

          y = this.props.scroll && this.props.scroll.y ? this.props.scroll.y : 0;
          if (this.props.header && ((y + props.header.height) > ( box_top - padding.bottom ))) {
            orig = box_top;
            box_top = y + box_ad_padding + this.props.header.height;
            if (y > (sidebar_height_base + (this.props.sidebar ? this.props.sidebar.height : 0))) {
              box_top = (sidebar_height_base + (this.props.sidebar ? this.props.sidebar.height : 0)) - ( this.props.ads && this.props.ads['box-top'] ? this.props.ads['box-top'].height : 0 );
            }
          }

          return React.DOM.section({
            id: "stream-container",
            style: {
              top: (box_top + this.props.ads['box-top'].height + padding.bottom) + "px",
              height: "200px"
            }
          }, React.DOM.section({
            id: "stream"
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
        if (!context) {
          context = _.extend({}, state);
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
