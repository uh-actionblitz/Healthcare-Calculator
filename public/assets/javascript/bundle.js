"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnnualSalaryControl = function () {
  function AnnualSalaryControl() {
    _classCallCheck(this, AnnualSalaryControl);

    this.target = d3.select('#annual-salary-slider');
    this.control = new CentralController();
    this.render();
  }

  _createClass(AnnualSalaryControl, [{
    key: "render",
    value: function render() {
      var that = this;
      var x = d3.scale.log();
      var commasFormatter = d3.format(",.0f");
      this.target.call(d3.slider().axis(d3.svg.axis().tickValues([1, 3, 5, 7, 10]).tickFormat(function (d) {
        return "$" + commasFormatter(d / 10 * 300) + "k";
      })).scale(x).on("slide", function (evt, value) {
        that.control.update({ salary: parseInt(value / 10 * 300000) });
      }));
    }
  }]);

  return AnnualSalaryControl;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CentralController = function () {
  function CentralController() {
    _classCallCheck(this, CentralController);

    this.options = {};
  }

  _createClass(CentralController, [{
    key: "update",
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      console.log(options);
      if (window.location.hash && window.location.hash.length > 0) {
        var hash = $.deparam(window.location.hash.substring(1));
        window.location.hash = $.param(Object.assign(hash, options));
      } else {
        console.log(options);
        window.location.hash = $.param(options);
      }
    }
  }]);

  return CentralController;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PremiumsControl = function () {
  function PremiumsControl() {
    _classCallCheck(this, PremiumsControl);

    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.render();
  }

  _createClass(PremiumsControl, [{
    key: "render",
    value: function render() {
      var that = this;
      var x = d3.scale.log();
      this.target.call(d3.slider().min(0).max(5000).on("slide", function (evt, value) {
        that.control.update({ premium: value });
      }).orientation("vertical"));
    }
  }]);

  return PremiumsControl;
}();
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
      this.AnnualSalaryControl = new AnnualSalaryControl();
      this.PremiumsControl = new PremiumsControl();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvY29udHJvbHMvQW5udWFsU2FsYXJ5Q29udHJvbC5qcyIsImNsYXNzZXMvY29udHJvbHMvQ2VudHJhbENvbnRyb2xsZXIuanMiLCJjbGFzc2VzL2NvbnRyb2xzL1ByZW1pdW1zQ29udHJvbC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJBbm51YWxTYWxhcnlDb250cm9sIiwidGFyZ2V0IiwiZDMiLCJzZWxlY3QiLCJjb250cm9sIiwiQ2VudHJhbENvbnRyb2xsZXIiLCJyZW5kZXIiLCJ0aGF0IiwieCIsInNjYWxlIiwibG9nIiwiY29tbWFzRm9ybWF0dGVyIiwiZm9ybWF0IiwiY2FsbCIsInNsaWRlciIsImF4aXMiLCJzdmciLCJ0aWNrVmFsdWVzIiwidGlja0Zvcm1hdCIsImQiLCJvbiIsImV2dCIsInZhbHVlIiwidXBkYXRlIiwic2FsYXJ5IiwicGFyc2VJbnQiLCJvcHRpb25zIiwiY29uc29sZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsImxlbmd0aCIsIiQiLCJkZXBhcmFtIiwic3Vic3RyaW5nIiwicGFyYW0iLCJPYmplY3QiLCJhc3NpZ24iLCJQcmVtaXVtc0NvbnRyb2wiLCJtaW4iLCJtYXgiLCJwcmVtaXVtIiwib3JpZW50YXRpb24iLCJBcHAiLCJfbGlzdGVuVG9XaW5kb3ciLCJ0cmlnZ2VyIiwiQXBwTWFuYWdlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQU1BO0FBRUosaUNBQWM7QUFBQTs7QUFDWixTQUFLQyxNQUFMLEdBQWNDLEdBQUdDLE1BQUgsQ0FBVSx1QkFBVixDQUFkO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLEVBQWY7QUFDQSxTQUFLQyxNQUFMO0FBQ0Q7Ozs7NkJBRVE7QUFDUCxVQUFNQyxPQUFPLElBQWI7QUFDQSxVQUFJQyxJQUFJTixHQUFHTyxLQUFILENBQVNDLEdBQVQsRUFBUjtBQUNBLFVBQUlDLGtCQUFrQlQsR0FBR1UsTUFBSCxDQUFVLE1BQVYsQ0FBdEI7QUFDQSxXQUFLWCxNQUFM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LE9BQUYsQ0FBVUwsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJJLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBYjtBQUNEO0FBQ0YsT0FMRDtBQU1BRixRQUFFSixNQUFGLEVBQVVpQixPQUFWLENBQWtCLFlBQWxCO0FBQ0Q7Ozs7OztBQUdIakIsT0FBT2tCLFVBQVAsR0FBb0IsSUFBSUgsR0FBSixDQUFRLEVBQVIsQ0FBcEIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQW5udWFsU2FsYXJ5Q29udHJvbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSBkMy5zZWxlY3QoJyNhbm51YWwtc2FsYXJ5LXNsaWRlcicpO1xuICAgIHRoaXMuY29udHJvbCA9IG5ldyBDZW50cmFsQ29udHJvbGxlcigpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHggPSBkMy5zY2FsZS5sb2coKTtcbiAgICB2YXIgY29tbWFzRm9ybWF0dGVyID0gZDMuZm9ybWF0KFwiLC4wZlwiKVxuICAgIHRoaXMudGFyZ2V0LmNhbGwoXG4gICAgICBkMy5zbGlkZXIoKVxuICAgICAgICAuYXhpcyhkMy5zdmcuYXhpcygpLnRpY2tWYWx1ZXMoWzEsIDMsIDUsIDcsIDEwXSkudGlja0Zvcm1hdCgoZCkgPT4gXCIkXCIgKyBjb21tYXNGb3JtYXR0ZXIoZC8xMCAqIDMwMCkrXCJrXCIpKVxuICAgICAgICAuc2NhbGUoeClcbiAgICAgICAgLm9uKFwic2xpZGVcIiwgKGV2dCwgdmFsdWUpPT57XG4gICAgICAgICAgdGhhdC5jb250cm9sLnVwZGF0ZSh7IHNhbGFyeTogcGFyc2VJbnQodmFsdWUvMTAgKiAzMDAwMDApIH0pO1xuICAgICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiIsImNsYXNzIENlbnRyYWxDb250cm9sbGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICBpZiAoXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCAmJlxuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2gubGVuZ3RoID4gMFxuICAgICkge1xuICAgICAgdmFyIGhhc2ggPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJC5wYXJhbShPYmplY3QuYXNzaWduKGhhc2gsIG9wdGlvbnMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICQucGFyYW0ob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbn1cbiIsImNsYXNzIFByZW1pdW1zQ29udHJvbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSBkMy5zZWxlY3QoJyNwcmVtaXVtcycpO1xuICAgIHRoaXMuY29udHJvbCA9IG5ldyBDZW50cmFsQ29udHJvbGxlcigpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHggPSBkMy5zY2FsZS5sb2coKTtcbiAgICB0aGlzLnRhcmdldC5jYWxsKFxuICAgICAgZDMuc2xpZGVyKClcbiAgICAgICAgLm1pbigwKS5tYXgoNTAwMClcbiAgICAgICAgLm9uKFwic2xpZGVcIiwgKGV2dCwgdmFsdWUpPT57XG4gICAgICAgICAgdGhhdC5jb250cm9sLnVwZGF0ZSh7IHByZW1pdW06IHZhbHVlIH0pO1xuICAgICAgICB9KVxuICAgICAgICAub3JpZW50YXRpb24oXCJ2ZXJ0aWNhbFwiKVxuICAgICk7XG4gIH1cbn1cbiIsImNsYXNzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuX2xpc3RlblRvV2luZG93KCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL0xvYWRpbmcgZGF0YS4uLlxuICAgIHRoaXMuQW5udWFsU2FsYXJ5Q29udHJvbCA9IG5ldyBBbm51YWxTYWxhcnlDb250cm9sKCk7XG4gICAgdGhpcy5QcmVtaXVtc0NvbnRyb2wgPSBuZXcgUHJlbWl1bXNDb250cm9sKCk7XG4gIH1cblxuICBfbGlzdGVuVG9XaW5kb3coKSB7XG5cbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCAoKT0+e1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKHdpbmRvdykudHJpZ2dlcihcImhhc2hjaGFuZ2VcIik7XG4gIH1cbn1cblxud2luZG93LkFwcE1hbmFnZXIgPSBuZXcgQXBwKHt9KTtcbiJdfQ==
