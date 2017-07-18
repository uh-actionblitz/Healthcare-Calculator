"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnnualSalaryControl = function () {
  function AnnualSalaryControl() {
    _classCallCheck(this, AnnualSalaryControl);

    this.target = d3.select('#annual-salary');
    this.control = new CentralController();
    this.timeout = null;
    this.render();
  }

  _createClass(AnnualSalaryControl, [{
    key: "render",
    value: function render() {
      var _this = this;

      var that = this;
      var x = d3.scale.log();
      var commasFormatter = d3.format(",.0f");
      this.target.call(d3.slider().axis(d3.svg.axis().tickValues([1, 3, 5, 7, 10]).tickFormat(function (d) {
        return "$" + commasFormatter(d / 10 * 300) + "k";
      })).scale(x).on("slide", function (evt, value) {
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          that.control.update({ salary: parseInt(value / 10 * 300000) });
        }, 300);
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PremiumsControl = function () {
  function PremiumsControl() {
    _classCallCheck(this, PremiumsControl);

    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.timeout = null;
    this.render();
  }

  _createClass(PremiumsControl, [{
    key: 'render',
    value: function render() {
      var _this = this;

      var that = this;
      var x = d3.scale.linear().invert();
      this.target.call(d3.slider().min(1000).max(0).axis(d3.svg.axis().tickFormat(function (d) {
        return '$' + d;
      }).orient('right')).on("slide", function (evt, value) {
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          that.control.update({ premium: Math.floor(1000 - value) });
        }, 300);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvY29udHJvbHMvQW5udWFsU2FsYXJ5Q29udHJvbC5qcyIsImNsYXNzZXMvY29udHJvbHMvQ2VudHJhbENvbnRyb2xsZXIuanMiLCJjbGFzc2VzL2NvbnRyb2xzL1ByZW1pdW1zQ29udHJvbC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJBbm51YWxTYWxhcnlDb250cm9sIiwidGFyZ2V0IiwiZDMiLCJzZWxlY3QiLCJjb250cm9sIiwiQ2VudHJhbENvbnRyb2xsZXIiLCJ0aW1lb3V0IiwicmVuZGVyIiwidGhhdCIsIngiLCJzY2FsZSIsImxvZyIsImNvbW1hc0Zvcm1hdHRlciIsImZvcm1hdCIsImNhbGwiLCJzbGlkZXIiLCJheGlzIiwic3ZnIiwidGlja1ZhbHVlcyIsInRpY2tGb3JtYXQiLCJkIiwib24iLCJldnQiLCJ2YWx1ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ1cGRhdGUiLCJzYWxhcnkiLCJwYXJzZUludCIsIm9wdGlvbnMiLCJjb25zb2xlIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwibGVuZ3RoIiwiJCIsImRlcGFyYW0iLCJzdWJzdHJpbmciLCJwYXJhbSIsIk9iamVjdCIsImFzc2lnbiIsIlByZW1pdW1zQ29udHJvbCIsImxpbmVhciIsImludmVydCIsIm1pbiIsIm1heCIsIm9yaWVudCIsInByZW1pdW0iLCJNYXRoIiwiZmxvb3IiLCJvcmllbnRhdGlvbiIsIkFwcCIsIl9saXN0ZW5Ub1dpbmRvdyIsInRyaWdnZXIiLCJBcHBNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTUE7QUFFSixpQ0FBYztBQUFBOztBQUNaLFNBQUtDLE1BQUwsR0FBY0MsR0FBR0MsTUFBSCxDQUFVLGdCQUFWLENBQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUMsaUJBQUosRUFBZjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsTUFBTDtBQUNEOzs7OzZCQUVRO0FBQUE7O0FBQ1AsVUFBTUMsT0FB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LEVBQUVxQixTQUFTQyxLQUFLQyxLQUFMLENBQVcsT0FBSzFCLEtBQWhCLENBQVgsRUFBcEI7QUFDRCxTQUZjLEVBRVosR0FGWSxDQUFmO0FBR0QsT0FSSCxFQVNHMkIsV0FUSCxDQVNlLFVBVGYsQ0FERjtBQVlEOzs7Ozs7Ozs7OztJQ3hCR0M7QUFDSixlQUFZdEIsT0FBWixFQUFxQjtBQUFBOztBQUVuQixTQUFLdUIsZUFBTDtBQUNBLFNBQUs3QyxNQUFMO0FBQ0Q7Ozs7NkJBRVE7QUFDUDtBQUNBLFdBQUtQLG1CQUFMLEdBQTJCLElBQUlBLG1CQUFKLEVBQTNCO0FBQ0EsV0FBS3lDLGVBQUwsR0FBdUIsSUFBSUEsZUFBSixFQUF2QjtBQUNEOzs7c0NBRWlCOztBQUVoQk4sUUFBRUosTUFBRixFQUFVVixFQUFWLENBQWEsWUFBYixFQUEyQixZQUFJO0FBQzdCLFlBQUlVLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLElBQXdCRixPQUFPQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsTUFBckIsR0FBOEIsQ0FBMUQsRUFDQTtBQUNFLGNBQU1ELE9BQU9FLEVBQUVDLE9BQUYsQ0FBVUwsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJJLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBYjtBQUNEO0FBQ0YsT0FMRDtBQU1BRixRQUFFSixNQUFGLEVBQVVzQixPQUFWLENBQWtCLFlBQWxCO0FBQ0Q7Ozs7OztBQUdIdEIsT0FBT3VCLFVBQVAsR0FBb0IsSUFBSUgsR0FBSixDQUFRLEVBQVIsQ0FBcEIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQW5udWFsU2FsYXJ5Q29udHJvbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSBkMy5zZWxlY3QoJyNhbm51YWwtc2FsYXJ5Jyk7XG4gICAgdGhpcy5jb250cm9sID0gbmV3IENlbnRyYWxDb250cm9sbGVyKCk7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciB4ID0gZDMuc2NhbGUubG9nKCk7XG4gICAgdmFyIGNvbW1hc0Zvcm1hdHRlciA9IGQzLmZvcm1hdChcIiwuMGZcIilcbiAgICB0aGlzLnRhcmdldC5jYWxsKFxuICAgICAgZDMuc2xpZGVyKClcbiAgICAgICAgLmF4aXMoZDMuc3ZnLmF4aXMoKS50aWNrVmFsdWVzKFsxLCAzLCA1LCA3LCAxMF0pLnRpY2tGb3JtYXQoKGQpID0+IFwiJFwiICsgY29tbWFzRm9ybWF0dGVyKGQvMTAgKiAzMDApK1wia1wiKSlcbiAgICAgICAgLnNjYWxlKHgpXG4gICAgICAgIC5vbihcInNsaWRlXCIsIChldnQsIHZhbHVlKT0+e1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5jb250cm9sLnVwZGF0ZSh7IHNhbGFyeTogcGFyc2VJbnQodmFsdWUvMTAgKiAzMDAwMDApIH0pO1xuICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIiwiY2xhc3MgQ2VudHJhbENvbnRyb2xsZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICAgIGlmIChcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaC5sZW5ndGggPiAwXG4gICAgKSB7XG4gICAgICB2YXIgaGFzaCA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkLnBhcmFtKE9iamVjdC5hc3NpZ24oaGFzaCwgb3B0aW9ucykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJC5wYXJhbShvcHRpb25zKTtcbiAgICB9XG4gIH1cblxufVxuIiwiY2xhc3MgUHJlbWl1bXNDb250cm9sIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRhcmdldCA9IGQzLnNlbGVjdCgnI3ByZW1pdW1zJyk7XG4gICAgdGhpcy5jb250cm9sID0gbmV3IENlbnRyYWxDb250cm9sbGVyKCk7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciB4ID0gZDMuc2NhbGUubGluZWFyKCkuaW52ZXJ0KCk7XG4gICAgdGhpcy50YXJnZXQuY2FsbChcbiAgICAgIGQzLnNsaWRlcigpXG4gICAgICAgIC5taW4oMTAwMCkubWF4KDApXG4gICAgICAgIC5heGlzKGQzLnN2Zy5heGlzKCkudGlja0Zvcm1hdCgoZCkgPT4gYCQke2R9YCkub3JpZW50KCdyaWdodCcpIClcbiAgICAgICAgLm9uKFwic2xpZGVcIiwgKGV2dCwgdmFsdWUpPT57XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGF0LmNvbnRyb2wudXBkYXRlKHsgcHJlbWl1bTogTWF0aC5mbG9vcigxMDAwLXZhbHVlKSB9KTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9KVxuICAgICAgICAub3JpZW50YXRpb24oXCJ2ZXJ0aWNhbFwiKVxuICAgICk7XG4gIH1cbn1cbiIsImNsYXNzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuX2xpc3RlblRvV2luZG93KCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL0xvYWRpbmcgZGF0YS4uLlxuICAgIHRoaXMuQW5udWFsU2FsYXJ5Q29udHJvbCA9IG5ldyBBbm51YWxTYWxhcnlDb250cm9sKCk7XG4gICAgdGhpcy5QcmVtaXVtc0NvbnRyb2wgPSBuZXcgUHJlbWl1bXNDb250cm9sKCk7XG4gIH1cblxuICBfbGlzdGVuVG9XaW5kb3coKSB7XG5cbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCAoKT0+e1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKHdpbmRvdykudHJpZ2dlcihcImhhc2hjaGFuZ2VcIik7XG4gIH1cbn1cblxud2luZG93LkFwcE1hbmFnZXIgPSBuZXcgQXBwKHt9KTtcbiJdfQ==
