"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(options) {
    _classCallCheck(this, App);

    this._listenToWindow();
    this.render();
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      //Loading data...
    }
  }, {
    key: "_listenToWindow",
    value: function _listenToWindow() {

      $(window).on('hashchange', function () {
        if (window.location.hash && window.location.hash.length > 0) {
          var hash = $.deparam(window.location.hash.substring(1));
        }
      });
      $(window).trigger("hashchange");
    }
  }]);

  return App;
}();

window.AppManager = new App({});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJvcHRpb25zIiwiX2xpc3RlblRvV2luZG93IiwicmVuZGVyIiwiJCIsIndpbmRvdyIsIm9uIiwibG9jYXRpb24iLCJoYXNoIiwibGVuZ3RoIiwiZGVwYXJhbSIsInN1YnN0cmluZyIsInRyaWdnZXIiLCJBcHBNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFDTUE7QUFDSixlQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBRW5CLFNBQUtDLGVBQUw7QUFDQSxTQUFLQyxNQUFMO0FBQ0Q7Ozs7NkJBRVE7QUFDUDtBQUNEOzs7c0NBRWlCOztBQUVoQkMsUUFBRUMsTUFBRixFQUFVQyxFQUFWLENBQWEsWUFBYixFQUEyQixZQUFJO0FBQzdCLFlBQUlELE9BQU9FLFFBQVAsQ0FBZ0JDLElBQWhCLElBQXdCSCxPQUFPRSxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsTUFBckIsR0FBOEIsQ0FBMUQsRUFDQTtBQUNFLGNBQU1ELE9BQU9KLEVBQUVNLE9BQUYsQ0FBVUwsT0FBT0UsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJHLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBYjtBQUNEO0FBQ0YsT0FMRDtBQU1BUCxRQUFFQyxNQUFGLEVBQVVPLE9BQVYsQ0FBa0IsWUFBbEI7QUFDRDs7Ozs7O0FBR0hQLE9BQU9RLFVBQVAsR0FBb0IsSUFBSWIsR0FBSixDQUFRLEVBQVIsQ0FBcEIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBBcHAge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgXG4gICAgdGhpcy5fbGlzdGVuVG9XaW5kb3coKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vTG9hZGluZyBkYXRhLi4uXG4gIH1cblxuICBfbGlzdGVuVG9XaW5kb3coKSB7XG5cbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCAoKT0+e1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKHdpbmRvdykudHJpZ2dlcihcImhhc2hjaGFuZ2VcIik7XG4gIH1cbn1cblxud2luZG93LkFwcE1hbmFnZXIgPSBuZXcgQXBwKHt9KTtcbiJdfQ==
