"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnnualSalaryControl = function () {
  function AnnualSalaryControl() {
    _classCallCheck(this, AnnualSalaryControl);

    var MEDIAN_INCOME = 60850;
    this.target = d3.select('#annual-salary');
    this.control = new CentralController();
    this.timeout = null;
    this.value = MEDIAN_INCOME;
    this.render();

    var commasFormatter = d3.format(",.0f");
    $("#annual-salary .d3-slider-handle").append("<span id='chosen-salary'>$" + commasFormatter(this.value) + "</span>");
  }

  _createClass(AnnualSalaryControl, [{
    key: "render",
    value: function render() {
      var _this = this;

      var that = this;
      var x = d3.scale.log();
      var commasFormatter = d3.format(",.0f");
      this.target.call(d3.slider().axis(d3.svg.axis().tickValues([1, 3, 5, 7, 10]).tickFormat(function (d) {
        return "$" + commasFormatter(d / 10 * 200) + "k";
      })).scale(x).value(that.value / 300000 * 10).on("slide", function (evt, value) {
        clearTimeout(_this.timeout);
        that.value = parseInt(value / 10 * 300000);
        that.timeout = setTimeout(function () {
          that.control.update({ salary: that.value });
        }, 300);
        $("#chosen-salary").text("$" + commasFormatter(that.value));
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

      (options);
      if (window.location.hash && window.location.hash.length > 0) {
        var hash = $.deparam(window.location.hash.substring(1));
        window.location.hash = $.param(Object.assign(hash, options));
      } else {
        (options);
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

      var OUT_OF_POCKET = 5500; //per year
      var DEDUCTIBLE = 2000;
      var MONTHLY_PREMIUM = 430;
      var total_cost = MONTHLY_PREMIUM + (OUT_OF_POCKET + DEDUCTIBLE) / 12;
      var that = this;
      var x = d3.scale.linear().invert();
      this.target.call(d3.slider().value(2700 - total_cost).min(2700).max(0).axis(d3.svg.axis().tickFormat(function (d) {
        return '$' + d;
      }).orient('right')).on("slide", function (evt, value) {
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          that.control.update({ premium: Math.floor(2700 - value) });
        }, 300);
      }).orientation("vertical"));
    }
  }]);

  return PremiumsControl;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stage = function () {
  function Stage() {
    _classCallCheck(this, Stage);

    this.render();
  }

  _createClass(Stage, [{
    key: "render",
    value: function render() {
      ("XXX");

      var s2 = d3.scale.log().domain([1, 100]).range([1, 20]);
      var s = d3.scale.log().domain([1, 100]).range([1, 300000]);
      var xTicks = [];
      var yValues = [];

      var curr = -1;
      xTicks.push(20000);
      yValues.push(0);

      for (var x = 2; x <= 50; x++) {
        var xVal = s(x);

        if (curr != Math.floor(s2(x))) {
          curr = Math.floor(s2(x));
        } else {
          continue;
        }
        ("LOG", Math.floor(s2(x)));

        xTicks.push(Math.floor(s(x) / 100) * 100);
        ("Pushing", Math.floor(s(x) / 100) * 100);
        if (xVal < 25000) {
          yValues.push(0);
        } else if (xVal > 25000 && xVal <= 50000) {
          yValues.push(Math.floor(xVal * 0.09 / 12));
        } else if (xVal > 50000 && xVal <= 75000) {
          yValues.push(Math.floor(xVal * 0.11 / 12));
        } else if (xVal > 75000 && xVal <= 100000) {
          yValues.push(Math.floor(xVal * 0.12 / 12));
        } else if (xVal > 100000 && xVal <= 300000) {
          yValues.push(Math.floor(xVal * 0.14 / 12));
        } else if (xVal > 300000) {
          yValues.push(Math.floor(xVal * 0.16 / 12));
        }
      }
      xTicks.push(300000);
      yValues.push(Math.floor(300000 * 0.16 / 12));

      // (xTicks);
      // var data_test_original = ['data1'].concat(yValues);
      //
      // ("XX", data_test_original);
      // var chart_test = c3.generate({
      //     bindto: '#stage',
      //     data: {
      //       x: 'x',
      //       columns: [
      //         ['x'].concat(xTicks),
      //         data_test_original
      //       ]
      //     },
      //
      //     axis : {
      //         x : {
      //             tick: {
      //                format: function (d, id) { return Math.floor(d/100) * 100;  }
      //             }
      //         }
      //     },
      // });

      ("XXX");
      var data_test = ['data1'];
      (xTicks);
      var data = [];
      for (var i = 0; i < xTicks.length; i++) {
        (xTicks[i]);
        data[i] = Math.log(xTicks[i]) / Math.LN10;
      }
      (data_test);

      var chart_test = c3.generate({
        bindto: '#stage',
        data: {
          x: 'data1',
          columns: [data_test.concat(data), ['premium'].concat(yValues)]
        },
        axis: {
          x: {
            tick: {
              format: function format(d) {
                return Math.pow(10, d).toFixed(2);
              }
            },
            show: false
          },
          y: {
            show: false,
            max: 2500
          }
        },
        legend: {
          show: false
        }
      });
    }
  }, {
    key: "highlight",
    value: function highlight(options) {
      (options);
    }
  }]);

  return Stage;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(options) {
    _classCallCheck(this, App);

    this.render();
    this._listenToWindow();
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      //Loading data...
      this.AnnualSalaryControl = new AnnualSalaryControl();
      this.PremiumsControl = new PremiumsControl();
      this.Stage = new Stage();
    }
  }, {
    key: "_listenToWindow",
    value: function _listenToWindow() {
      var _this = this;

      $(window).on('hashchange', function () {
        if (window.location.hash && window.location.hash.length > 0) {
          var hash = $.deparam(window.location.hash.substring(1));
          _this.Stage.highlight(hash);
        }
      });
      $(window).trigger("hashchange");
    }
  }]);

  return App;
}();

window.AppManager = new App({});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvY29udHJvbHMvQW5udWFsU2FsYXJ5Q29udHJvbC5qcyIsImNsYXNzZXMvY29udHJvbHMvQ2VudHJhbENvbnRyb2xsZXIuanMiLCJjbGFzc2VzL2NvbnRyb2xzL1ByZW1pdW1zQ29udHJvbC5qcyIsImNsYXNzZXMvU3RhZ2UuanMiLCJhcHAuanMiXSwibmFtZXMiOlsiQW5udWFsU2FsYXJ5Q29udHJvbCIsIk1FRElBTl9JTkNPTUUiLCJ0YXJnZXQiLCJkMyIsInNlbGVjdCIsImNvbnRyb2wiLCJDZW50cmFsQ29udHJvbGxlciIsInRpbWVvdXQiLCJ2YWx1ZSIsInJlbmRlciIsImNvbW1hc0Zvcm1hdHRlciIsImZvcm1hdCIsIiQiLCJhcHBlbmQiLCJ0aGF0IiwieCIsInNjYWxlIiwibG9nIiwiY2FsbCIsInNsaWRlciIsImF4aXMiLCJzdmciLCJ0aWNrVmFsdWVzIiwidGlja0Zvcm1hdCIsImQiLCJvbiIsImV2dCIsImNsZWFyVGltZW91dCIsInBhcnNlSW50Iiwic2V0VGltZW91dCIsInVwZGF0ZSIsInNhbGFyeSIsInRleHQiLCJvcHRpb25zIiwiY29uc29sZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsImxlbmd0aCIsImRlcGFyYW0iLCJzdWJzdHJpbmciLCJwYXJhbSIsIk9iamVjdCIsImFzc2lnbiIsIlByZW1pdW1zQ29udHJvbCIsIk9VVF9PRl9QT0NLRVQiLCJERURVQ1RJQkxFIiwiTU9OVEhMWV9QUkVNSVVNIiwidG90YWxfY29zdCIsImxpbmVhciIsImludmVydCIsIm1pbiIsIm1heCIsIm9yaWVudCIsInByZW1pdW0iLCJNYXRoIiwiZmxvb3IiLCJvcmllbnRhdGlvbiIsIlN0YWdlIiwiczIiLCJkb21haW4iLCJyYW5nZSIsInMiLCJ4VGlja3MiLCJ5VmFsdWVzIiwiY3VyciIsInB1c2giLCJ4VmFsIiwiZGF0YV90ZXN0IiwiZGF0YSIsImkiLCJMTjEwIiwiY2hhcnRfdGVzdCIsImMzIiwiZ2VuZXJhdGUiLCJiaW5kdG8iLCJjb2x1bW5zIiwiY29uY2F0IiwidGljayIsInBvdyIsInRvRml4ZWQiLCJzaG93IiwieSIsImxlZ2VuZCIsIkFwcCIsIl9saXN0ZW5Ub1dpbmRvdyIsImhpZ2hsaWdodCIsInRyaWdnZXIiLCJBcHBNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTUE7QUFFSixpQ0FBYztBQUFBOztBQUNaLFFBQU1DLGdCQUFnQixLQUF0QjtBQUNBLFNBQUtDLE1BQUwsR0FBY0MsR0FBR0MsTUFBSCxDQUFVLGdCQUFWLENBQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUMsaUJBQUosRUFBZjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsS0FBTCxHQUFhUCxhQUFiO0FBQ0EsU0FBS1EsTUFBTDs7QUFFQSxRQUFJQyxrQkFBa0JQLEdBQUdRLE1BQUgsQ0FBVSxNQUFWLENBQXRCO0FBQ0FDLE1BQUUsa0NBQUYsRUFBc0NDLE1BQXRDLGdDQUEwRUgsZ0JBQWdCLEtBQUtGLEtBQXJCLENBQTFFO0FBQ0Q7Ozs7NkJBRVE7QUFBQTs7QUFFUCxVQUFNTSxPQUFPLElBQWI7QUFDQSxVQUFJQyxJQUFJWixHQUFHYSxLQUFILENBQVNDLEdBQVQsRUFBUjtBQUNBLFVBQUlQLGtCQUFrQlAsR0FBR1EsTUFBSCxDQUFVLE1BQVYsQ0FBdEI7QUFDQSxXQUFLVCxNQUFMLENBQVlnQixJQUFaLENBQ0VmLEdBQUdnQixNQUFILEdBQ0dDLElBREgsQ0FDUWpCLEdBQUdrQixHQUFILENBQU9ELElBQVAsR0FBY0UsVUFBZCxDQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxFQUFiLENBQXpCLEVBQTJDQyxVQUEzQyxDQUFzRCxVQUFDQyxDQUFEO0FBQUEsZUFBTyxNQUFNZCxnQkFBZ0JjLElBQUUsRUFBRixHQUFPLEdBQXZCLENBQU4sR0FBa0MsR0FBekM7QUFBQSxPQUF0RCxDQURSLEVBRUdSLEtBRkgsQ0FFU0QsQ0FGVCxFQUdHUCxLQUhILENBR1VNLEtBQUtOLEtB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LE9BQVosQ0FBakI7QUF5QkQ7Ozs4QkFFU2hELFNBQVM7QUFDakJDLGNBQVFqQixHQUFSLENBQVlnQixPQUFaO0FBQ0Q7Ozs7Ozs7Ozs7O0lDNUdHbUQ7QUFDSixlQUFZbkQsT0FBWixFQUFxQjtBQUFBOztBQUVuQixTQUFLeEIsTUFBTDtBQUNBLFNBQUs0RSxlQUFMO0FBQ0Q7Ozs7NkJBRVE7QUFDUDtBQUNBLFdBQUtyRixtQkFBTCxHQUEyQixJQUFJQSxtQkFBSixFQUEzQjtBQUNBLFdBQUs0QyxlQUFMLEdBQXVCLElBQUlBLGVBQUosRUFBdkI7QUFDQSxXQUFLYyxLQUFMLEdBQWEsSUFBSUEsS0FBSixFQUFiO0FBQ0Q7OztzQ0FFaUI7QUFBQTs7QUFFaEI5QyxRQUFFdUIsTUFBRixFQUFVVixFQUFWLENBQWEsWUFBYixFQUEyQixZQUFJO0FBQzdCLFlBQUlVLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLElBQXdCRixPQUFPQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsTUFBckIsR0FBOEIsQ0FBMUQsRUFDQTtBQUNFLGNBQU1ELE9BQU96QixFQUFFMkIsT0FBRixDQUFVSixPQUFPQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkcsU0FBckIsQ0FBK0IsQ0FBL0IsQ0FBVixDQUFiO0FBQ0EsZ0JBQUtrQixLQUFMLENBQVc0QixTQUFYLENBQXFCakQsSUFBckI7QUFDRDtBQUNGLE9BTkQ7QUFPQXpCLFFBQUV1QixNQUFGLEVBQVVvRCxPQUFWLENBQWtCLFlBQWxCO0FBQ0Q7Ozs7OztBQUdIcEQsT0FBT3FELFVBQVAsR0FBb0IsSUFBSUosR0FBSixDQUFRLEVBQVIsQ0FBcEIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQW5udWFsU2FsYXJ5Q29udHJvbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgTUVESUFOX0lOQ09NRSA9IDYwODUwO1xuICAgIHRoaXMudGFyZ2V0ID0gZDMuc2VsZWN0KCcjYW5udWFsLXNhbGFyeScpO1xuICAgIHRoaXMuY29udHJvbCA9IG5ldyBDZW50cmFsQ29udHJvbGxlcigpO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZSA9IE1FRElBTl9JTkNPTUU7XG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIHZhciBjb21tYXNGb3JtYXR0ZXIgPSBkMy5mb3JtYXQoXCIsLjBmXCIpXG4gICAgJChcIiNhbm51YWwtc2FsYXJ5IC5kMy1zbGlkZXItaGFuZGxlXCIpLmFwcGVuZChgPHNwYW4gaWQ9J2Nob3Nlbi1zYWxhcnknPiQke2NvbW1hc0Zvcm1hdHRlcih0aGlzLnZhbHVlKX08L3NwYW4+YClcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciB4ID0gZDMuc2NhbGUubG9nKCk7XG4gICAgdmFyIGNvbW1hc0Zvcm1hdHRlciA9IGQzLmZvcm1hdChcIiwuMGZcIilcbiAgICB0aGlzLnRhcmdldC5jYWxsKFxuICAgICAgZDMuc2xpZGVyKClcbiAgICAgICAgLmF4aXMoZDMuc3ZnLmF4aXMoKS50aWNrVmFsdWVzKFsxLCAzLCA1LCA3LCAxMF0pLnRpY2tGb3JtYXQoKGQpID0+IFwiJFwiICsgY29tbWFzRm9ybWF0dGVyKGQvMTAgKiAyMDApK1wia1wiKSlcbiAgICAgICAgLnNjYWxlKHgpXG4gICAgICAgIC52YWx1ZSgodGhhdC52YWx1ZS8yMDAwMDApICAqIDEwKVxuICAgICAgICAub24oXCJzbGlkZVwiLCAoZXZ0LCB2YWx1ZSk9PntcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgICB0aGF0LnZhbHVlID0gcGFyc2VJbnQodmFsdWUvMTAgKiAyMDAwMDApO1xuICAgICAgICAgIHRoYXQudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5jb250cm9sLnVwZGF0ZSh7IHNhbGFyeTogdGhhdC52YWx1ZSB9KTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgICQoXCIjY2hvc2VuLXNhbGFyeVwiKS50ZXh0KFwiJFwiICsgY29tbWFzRm9ybWF0dGVyKHRoYXQudmFsdWUpKTtcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iLCJjbGFzcyBDZW50cmFsQ29udHJvbGxlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gICAgaWYgKFxuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggJiZcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIHZhciBoYXNoID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICQucGFyYW0oT2JqZWN0LmFzc2lnbihoYXNoLCBvcHRpb25zKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkLnBhcmFtKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG59XG4iLCJjbGFzcyBQcmVtaXVtc0NvbnRyb2wge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGFyZ2V0ID0gZDMuc2VsZWN0KCcjcHJlbWl1bXMnKTtcbiAgICB0aGlzLmNvbnRyb2wgPSBuZXcgQ2VudHJhbENvbnRyb2xsZXIoKTtcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgT1VUX09GX1BPQ0tFVCA9IDU1MDA7IC8vcGVyIHllYXJcbiAgICBjb25zdCBERURVQ1RJQkxFID0gMjAwMDtcbiAgICBjb25zdCBNT05USExZX1BSRU1JVU0gPSA0MzA7XG4gICAgY29uc3QgdG90YWxfY29zdCA9IE1PTlRITFlfUFJFTUlVTSArIChPVVRfT0ZfUE9DS0VUICsgREVEVUNUSUJMRSkvMTI7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5pbnZlcnQoKTtcbiAgICB0aGlzLnRhcmdldC5jYWxsKFxuICAgICAgZDMuc2xpZGVyKClcbiAgICAgICAgLnZhbHVlKDI3MDAgLSB0b3RhbF9jb3N0KVxuICAgICAgICAubWluKDI3MDApLm1heCgwKVxuICAgICAgICAuYXhpcyhkMy5zdmcuYXhpcygpLnRpY2tGb3JtYXQoKGQpID0+IGAkJHtkfWApLm9yaWVudCgncmlnaHQnKSApXG4gICAgICAgIC5vbihcInNsaWRlXCIsIChldnQsIHZhbHVlKT0+e1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5jb250cm9sLnVwZGF0ZSh7IHByZW1pdW06IE1hdGguZmxvb3IoMjcwMC12YWx1ZSkgfSk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9yaWVudGF0aW9uKFwidmVydGljYWxcIilcbiAgICApO1xuICB9XG59XG4iLCJjbGFzcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc29sZS5sb2coXCJYWFhcIik7XG5cbiAgICB2YXIgczIgPSBkMy5zY2FsZS5sb2coKS5kb21haW4oWzEsMTAwXSkucmFuZ2UoWzEsMjBdKTtcbiAgICB2YXIgcyA9IGQzLnNjYWxlLmxvZygpLmRvbWFpbihbMSwxMDBdKS5yYW5nZShbMSwyMDAwMDBdKTtcbiAgICB2YXIgeFRpY2tzID0gW107XG4gICAgdmFyIHlWYWx1ZXMgPSBbXTtcblxuICAgIHZhciBjdXJyID0gLTE7XG4gICAgeFRpY2tzLnB1c2goMjAwMDApO1xuICAgIHlWYWx1ZXMucHVzaCgwKTtcblxuICAgIGZvciAodmFyIHg9MjsgeDw9NTA7IHgrKykge1xuICAgICAgdmFyIHhWYWwgPSBzKHgpO1xuXG4gICAgICBpZiAoY3VyciAhPSBNYXRoLmZsb29yKHMyKHgpKSkge1xuICAgICAgICBjdXJyID0gTWF0aC5mbG9vcihzMih4KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiTE9HXCIsIE1hdGguZmxvb3IoczIoeCkpKTtcblxuICAgICAgeFRpY2tzLnB1c2goTWF0aC5mbG9vcihzKHgpLzEwMCkgKiAxMDApO1xuICAgICAgY29uc29sZS5sb2coXCJQdXNoaW5nXCIsIE1hdGguZmxvb3Iocyh4KS8xMDApICogMTAwKVxuICAgICAgaWYgKHhWYWwgPCAyNTAwMCkge1xuICAgICAgICB5VmFsdWVzLnB1c2goMClcbiAgICAgIH0gZWxzZSBpZiAoeFZhbCA+IDI1MDAwICYmIHhWYWwgPD0gNTAwMDApIHtcbiAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMDkgLyAxMikpO1xuICAgICAgfSBlbHNlIGlmICh4VmFsID4gNTAwMDAgJiYgeFZhbCA8PSA3NTAwMCkge1xuICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xMSAvIDEyKSk7XG4gICAgICB9IGVsc2UgaWYgKHhWYWwgPiA3NTAwMCAmJiB4VmFsIDw9IDEwMDAwMCkge1xuICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xMiAvIDEyKSk7XG4gICAgICB9IGVsc2UgaWYgKHhWYWwgPiAxMDAwMDAgJiYgeFZhbCA8PSAyMDAwMDApIHtcbiAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMTQgLyAxMikpO1xuICAgICAgfSBlbHNlIGlmICh4VmFsID4gMjAwMDAwICkge1xuICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xNiAvIDEyKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHhUaWNrcy5wdXNoKDIwMDAwMCk7XG4gICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoMjAwMDAwICogMC4xNiAvIDEyKSlcblxuICAgIC8vIGNvbnNvbGUubG9nKHhUaWNrcyk7XG4gICAgLy8gdmFyIGRhdGFfdGVzdF9vcmlnaW5hbCA9IFsnZGF0YTEnXS5jb25jYXQoeVZhbHVlcyk7XG4gICAgLy9cbiAgICAvLyBjb25zb2xlLmxvZyhcIlhYXCIsIGRhdGFfdGVzdF9vcmlnaW5hbCk7XG4gICAgLy8gdmFyIGNoYXJ0X3Rlc3QgPSBjMy5nZW5lcmF0ZSh7XG4gICAgLy8gICAgIGJpbmR0bzogJyNzdGFnZScsXG4gICAgLy8gICAgIGRhdGE6IHtcbiAgICAvLyAgICAgICB4OiAneCcsXG4gICAgLy8gICAgICAgY29sdW1uczogW1xuICAgIC8vICAgICAgICAgWyd4J10uY29uY2F0KHhUaWNrcyksXG4gICAgLy8gICAgICAgICBkYXRhX3Rlc3Rfb3JpZ2luYWxcbiAgICAvLyAgICAgICBdXG4gICAgLy8gICAgIH0sXG4gICAgLy9cbiAgICAvLyAgICAgYXhpcyA6IHtcbiAgICAvLyAgICAgICAgIHggOiB7XG4gICAgLy8gICAgICAgICAgICAgdGljazoge1xuICAgIC8vICAgICAgICAgICAgICAgIGZvcm1hdDogZnVuY3Rpb24gKGQsIGlkKSB7IHJldHVybiBNYXRoLmZsb29yKGQvMTAwKSAqIDEwMDsgIH1cbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlhYWFwiKTtcbiAgICB2YXIgZGF0YV90ZXN0ID0gWydkYXRhMSddO1xuICAgIGNvbnNvbGUubG9nKHhUaWNrcyk7XG4gICAgdmFyIGRhdGEgPSBbXVxuICAgIGZvcih2YXIgaT0wOyBpPHhUaWNrcy5sZW5ndGg7IGkrKyl7XG4gICAgICBjb25zb2xlLmxvZyh4VGlja3NbaV0pO1xuICAgICAgICBkYXRhW2ldID0gTWF0aC5sb2coeFRpY2tzW2ldKSAvIE1hdGguTE4xMDtcbiAgICB9XG4gICAgY29uc29sZS5sb2coZGF0YV90ZXN0KTtcblxuICAgIHZhciBjaGFydF90ZXN0ID0gYzMuZ2VuZXJhdGUoe1xuICAgICAgICBiaW5kdG86ICcjc3RhZ2UnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgeDogJ2RhdGExJyxcbiAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICBkYXRhX3Rlc3QuY29uY2F0KGRhdGEpLFxuICAgICAgICAgICAgWydwcmVtaXVtJ10uY29uY2F0KHlWYWx1ZXMpXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBheGlzIDoge1xuICAgICAgICAgICAgeCA6IHtcbiAgICAgICAgICAgICAgICB0aWNrOiB7XG4gICAgICAgICAgICAgICAgICAgZm9ybWF0OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gTWF0aC5wb3coMTAsZCkudG9GaXhlZCgyKTsgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIHNob3c6ZmFsc2UsXG4gICAgICAgICAgICAgIG1heDogMjUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGhpZ2hsaWdodChvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gIH1cbn1cbiIsImNsYXNzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5fbGlzdGVuVG9XaW5kb3coKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL0xvYWRpbmcgZGF0YS4uLlxuICAgIHRoaXMuQW5udWFsU2FsYXJ5Q29udHJvbCA9IG5ldyBBbm51YWxTYWxhcnlDb250cm9sKCk7XG4gICAgdGhpcy5QcmVtaXVtc0NvbnRyb2wgPSBuZXcgUHJlbWl1bXNDb250cm9sKCk7XG4gICAgdGhpcy5TdGFnZSA9IG5ldyBTdGFnZSgpO1xuICB9XG5cbiAgX2xpc3RlblRvV2luZG93KCkge1xuXG4gICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgKCk9PntcbiAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCAmJiB3aW5kb3cubG9jYXRpb24uaGFzaC5sZW5ndGggPiAwKVxuICAgICAge1xuICAgICAgICBjb25zdCBoYXNoID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG4gICAgICAgIHRoaXMuU3RhZ2UuaGlnaGxpZ2h0KGhhc2gpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQod2luZG93KS50cmlnZ2VyKFwiaGFzaGNoYW5nZVwiKTtcbiAgfVxufVxuXG53aW5kb3cuQXBwTWFuYWdlciA9IG5ldyBBcHAoe30pO1xuIl19
