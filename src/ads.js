define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
      padding = {
        top: 20,
        bottom: 20
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
            window.googletag.cmd.push(function() {
              window.googletag.display("div-gpt-ad-1411489889191-0");
            });
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
              height = mounted ? nodeHeight(node) : 0,
              width = mounted ? nodeWidth(node) : 0,
              total_width = mounted && this.props.screen ? this.props.screen.width : 0,
              total_height = mounted && this.props.screen ? this.props.screen.height : 0,
              total_width_padding = total_width - width,
              total_height_padding = total_height - height,
              height_base = Math.floor((padding.top + padding.bottom + total_height_padding)/2);
          if (total_width_padding < 0) {
            total_width_padding = 0;
          }
          if (total_width_padding > total_width) {
            total_width_padding = total_width;
          }
          if (total_height_padding > 0) {
            total_height_padding = 0;
          }
          if (total_height_padding > total_height) {
            total_height_padding = total_height;
          }
          return React.DOM.section({
            id: "ads-banner-top",
            "data-height": height,
            "data-width": width,
            style: {
              "left": Math.floor(total_width_padding/2) + "px",
              "top": (this.props.header && this.props.header.height ? this.props.header.height + height_base: height_base) + "px"
            }
          }, React.DOM.div({
            id: "div-gpt-ad-1411489889191-0"
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
        }
      });
    },
    ready: module.promise.then.bind(module.promise)
  };
});
