define(['q', 'react', 'underscore', 'src/layout'], function(Q, React, _, layout) {
  var deferred = Q.defer(),
      promise = deferred.promise,
      module = Q.defer(),
      component = React.createClass({
        render: function() {
          var current = layout.current();
          return React.DOM.section({
            id: "content-container",
            style: {
              top: (current.content_top) + "px",
              right: current.right_width + "px",
              left: current.left_width + "px",
              "max-height": current.height + "px"
            }
          }, React.DOM.section({
            id: "content",
            style: {
              "max-width": current.width + "px",
              "min-height": current.height + "px"
            }
          }, React.DOM.section({ id: "content-header"},
            React.DOM.div({id: "content-header-title"}, React.DOM.h1({}, "Biltong tail spare ribs turkey prosciutto hamburger pig sausage")),
            React.DOM.div({id: "content-header-description"}, React.DOM.div({}, "Bacon ipsum dolor sit amet capicola shoulder meatball, bacon tenderloin salami ham short loin frankfurter rump.")),
            React.DOM.div({id: "content-header-pubdate"}, React.DOM.div({}, "August 20, 2014")),
            React.DOM.div({id: "content-header-byline"}, React.DOM.div({}, "Andouille Meatloaf"))
          ) ) );
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
