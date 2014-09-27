define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      context,
      min = 0,
      first = true,
      instance,
      content,
      prev = {},
      component = React.createClass({
        componentDidMount: function() {
            instance = this;
        },
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "content-container",
            style: {
              top: (current.content_top) + "px"
            }
          }, React.DOM.section({
            id: "content",
            style: {
              height: current.height + "px"
            }
          } ) );
        }
      });

  module.resolve(component);


  return {
    outgoing: function(interface) {
      interface(promise);
    },
    ready: module.promise.then.bind(module.promise)
  };
});
