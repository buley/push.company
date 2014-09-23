define(['q', 'react', 'underscore'], function(Q, React, _) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      instance,
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
          return React.DOM.section({
            id: "ads-banner-top"
          }, React.DOM.div({
            id: "div-gpt-ad-1411489889191-0"
          }, React.DOM.script({
            type: "text/javascript"
          })) );
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
