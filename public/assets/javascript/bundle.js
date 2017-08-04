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
      // var x = d3.scale.log();
      var width = $("#stage").width();
      var x = d3.scale.log().domain([15000, 300000]);

      var commasFormatter = d3.format(",.0f");
      this.target.call(d3.slider().axis(d3.svg.axis().tickFormat(function (d) {
        return "$" + commasFormatter(d / 1000) + "k";
      })).scale(x).value(that.value) //(that.value/200000)  * 10
      .on("slide", function (evt, value) {
        console.log(value);
        clearTimeout(_this.timeout);
        that.value = parseInt(value);
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

      var OUT_OF_POCKET = 5500; //per year
      var DEDUCTIBLE = 2000;
      var MONTHLY_PREMIUM = 430;
      var total_cost = MONTHLY_PREMIUM + (OUT_OF_POCKET + DEDUCTIBLE) / 12;
      var that = this;
      var x = d3.scale.linear().invert();
      this.target.call(d3.slider().value(4000 - total_cost).min(4000).max(0).axis(d3.svg.axis().tickFormat(function (d) {
        return '$' + d;
      }).orient('right')).on("slide", function (evt, value) {
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          that.control.update({ premium: Math.floor(4000 - value) });
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

      var annualSalary = [];
      var margin = { top: 40.5, right: 40.5, bottom: 50.5, left: 60.5 };

      var width = $("#stage").width();
      var height = $("#stage").height();
      var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";
      var formatPower = function formatPower(d) {
        return (d + "").split("").map(function (c) {
          return superscript[c];
        }).join("");
      };

      var x = d3.scale.log().domain([15000, 300000]).range([0, width]);

      var y = d3.scale.linear().domain([0, 4000]).range([height, 0]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function (d) {
        return d;
      });

      var line = d3.svg.line().x(function (d) {
        return x(d[0]);
      }).y(function (d) {
        return y(d[1]);
      });

      var svg = d3.select("#stage").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

      var yAxis = d3.svg.axis().scale(y).orient("right");

      svg.append("g").attr("class", "axis axis--y").attr("transform", "translate(0,0)").call(yAxis);

      svg.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + (height + 10) + ")").call(xAxis);
      var data = d3.range(15000, 300000, 2000).map(function (d) {
        var premium = 0;

        if (d < 25000) {
          return [d, 0];
        } else if (d >= 25000 && d < 50000) {
          return [d, (d - 25000) * 0.09 / 12];
        } else if (d >= 50000 && d < 75000) {
          return [d, (d - 25000) * 0.11 / 12];
        } else if (d >= 75000 && d < 100000) {
          return [d, (d - 25000) * 0.12 / 12];
        } else if (d >= 100000 && d < 200000) {
          return [d, (d - 25000) * 0.14 / 12];
        } else {
          return [d, (d - 25000) * 0.16 / 12];
        }
      });
      console.log(data);
      svg.append("path").datum(data).attr("class", "line").attr("d", line);

      var age = 28;

      // Average prices per age: https://www.healthpocket.com/individual-health-insurance/gold-health-plans#premiums
      var goldDeductible = 1165 / 12;
      svg.append("path").datum(d3.range(15000, 300000, 2000).map(function (d) {
        if (age < 40) {
          return [d, 380.98 + goldDeductible];
        } else if (age >= 40 && age < 50) {
          return [d, 599.16 + goldDeductible];
        } else {
          return [d, 909.22 + goldDeductible];
        }
      })).attr("class", "line-gold").attr("d", line);

      // Average prices per age: https://www.healthpocket.com/individual-health-insurance/silver-health-plans#premiums
      var silverDeductible = 3177 / 12;
      svg.append("path").datum(d3.range(15000, 300000, 2000).map(function (d) {
        if (age < 40) {
          return [d, 351.02 + silverDeductible];
        } else if (age >= 40 && age < 50) {
          return [d, 490.75 + silverDeductible];
        } else {
          return [d, 744.99 + silverDeductible];
        }
      })).attr("class", "line-silver").attr("d", line);

      // Average prices per age: https://www.healthpocket.com/individual-health-insurance/silver-health-plans#premiums
      var silverDeductible = 5731 / 12;
      svg.append("path").datum(d3.range(15000, 300000, 2000).map(function (d) {
        if (age < 40) {
          return [d, 257.68 + silverDeductible];
        } else if (age >= 40 && age < 50) {
          return [d, 405.28 + silverDeductible];
        } else {
          return [d, 615.15 + silverDeductible];
        }
      })).attr("class", "line-bronze").attr("d", line);
    }
  }, {
    key: "highlight",
    value: function highlight(options) {
      console.log(options);
    }
  }]);

  return Stage;
}();
// class Stage {
//   constructor() {
//     this.render();
//   }
//
//   render() {
//     console.log("XXX");
//
//     var s2 = d3.scale.log().domain([1,100]).range([1,20]);
//     var s = d3.scale.log().domain([1,100]).range([1,300000]);
//     var xTicks = [];
//     var yValues = [];
//
//     var curr = -1;
//     xTicks.push(20000);
//     yValues.push(0);
//
//     for (var x=2; x<=50; x++) {
//       var xVal = s(x);
//
//       if (curr != Math.floor(s2(x))) {
//         curr = Math.floor(s2(x));
//       } else {
//         continue;
//       }
//       console.log("LOG", Math.floor(s2(x)));
//
//       xTicks.push(Math.floor(s(x)/100) * 100);
//       console.log("Pushing", Math.floor(s(x)/100) * 100)
//       if (xVal < 25000) {
//         yValues.push(0)
//       } else if (xVal > 25000 && xVal <= 50000) {
//         yValues.push(Math.floor(xVal * 0.09 / 12));
//       } else if (xVal > 50000 && xVal <= 75000) {
//         yValues.push(Math.floor(xVal * 0.11 / 12));
//       } else if (xVal > 75000 && xVal <= 100000) {
//         yValues.push(Math.floor(xVal * 0.12 / 12));
//       } else if (xVal > 100000 && xVal <= 300000) {
//         yValues.push(Math.floor(xVal * 0.14 / 12));
//       } else if (xVal > 300000 ) {
//         yValues.push(Math.floor(xVal * 0.16 / 12));
//       }
//     }
//     xTicks.push(300000);
//     yValues.push(Math.floor(300000 * 0.16 / 12))
//
//     // console.log(xTicks);
//     // var data_test_original = ['data1'].concat(yValues);
//     //
//     // console.log("XX", data_test_original);
//     // var chart_test = c3.generate({
//     //     bindto: '#stage',
//     //     data: {
//     //       x: 'x',
//     //       columns: [
//     //         ['x'].concat(xTicks),
//     //         data_test_original
//     //       ]
//     //     },
//     //
//     //     axis : {
//     //         x : {
//     //             tick: {
//     //                format: function (d, id) { return Math.floor(d/100) * 100;  }
//     //             }
//     //         }
//     //     },
//     // });
//
//     console.log("XXX");
//     var data_test = ['data1'];
//     console.log(xTicks);
//     var data = []
//     for(var i=0; i<xTicks.length; i++){
//       console.log(xTicks[i]);
//         data[i] = Math.log(xTicks[i]) / Math.LN10;
//     }
//     console.log(data_test);
//
//     var chart_test = c3.generate({
//         bindto: '#stage',
//         data: {
//           x: 'data1',
//           columns: [
//             data_test.concat(data),
//             ['premium'].concat(yValues)
//           ]
//         },
//         axis : {
//             x : {
//                 tick: {
//                    format: function (d) { return Math.pow(10,d).toFixed(2); }
//                 },
//                 show: false
//             },
//             y: {
//               show:false,
//               max: 2500
//             }
//         },
//         legend: {
//             show: false
//         }
//     });
//   }
//
//   highlight(options) {
//     console.log(options);
//   }
// }
"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvY29udHJvbHMvQW5udWFsU2FsYXJ5Q29udHJvbC5qcyIsImNsYXNzZXMvY29udHJvbHMvQ2VudHJhbENvbnRyb2xsZXIuanMiLCJjbGFzc2VzL2NvbnRyb2xzL1ByZW1pdW1zQ29udHJvbC5qcyIsImNsYXNzZXMvU3RhZ2UuanMiLCJjbGFzc2VzL1N0YWdlLm9sZC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJBbm51YWxTYWxhcnlDb250cm9sIiwiTUVESUFOX0lOQ09NRSIsInRhcmdldCIsImQzIiwic2VsZWN0IiwiY29udHJvbCIsIkNlbnRyYWxDb250cm9sbGVyIiwidGltZW91dCIsInZhbHVlIiwicmVuZGVyIiwiY29tbWFzRm9ybWF0dGVyIiwiZm9ybWF0IiwiJCIsImFwcGVuZCIsInRoYXQiLCJ3aWR0aCIsIngiLCJzY2FsZSIsImxvZyIsImRvbWFpbiIsImNhbGwiLCJzbGlkZXIiLCJheGlzIiwic3ZnIiwidGlja0Zvcm1hdCIsImQiLCJvbiIsImV2dCIsImNvbnNvbGUiLCJjbGVhclRpbWVvdXQiLCJwYXJzZUludCIsInNldFRpbWVvdXQiLCJ1cGRhdGUiLCJzYWxhcnkiLCJ0ZXh0Iiwib3B0aW9ucyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsImxlbmd0aCIsImRlcGFyYW0iLCJzdWJzdHJpbmciLCJwYXJhbSIsIk9iamVjdCIsImFzc2lnbiIsIlByZW1pdW1zQ29udHJvbCIsIk9VVF9PRl9QT0NLRVQiLCJERURVQ1RJQkxFIiwiTU9OVEhMWV9QUkVNSVVNIiwidG90YWxfY29zdCIsImxpbmVhciIsImludmVydCIsIm1pbiIsIm1heCIsIm9yaWVudCIsInByZW1pdW0iLCJNYXRoIiwiZmxvb3IiLCJvcmllbnRhdGlvbiIsIlN0YWdlIiwiYW5udWFsU2FsYXJ5IiwibWFyZ2luIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwiaGVpZ2h0Iiwic3VwZXJzY3JpcHQiLCJmb3JtYXRQb3dlciIsInNwbGl0IiwibWFwIiwiYyIsImpvaW4iLCJyYW5nZSIsInkiLCJ4QXhpcyIsImxpbmUiLCJhdHRyIiwieUF4aXMiLCJkYXRhIiwiZGF0dW0iLCJhZ2UiLCJnb2xkRGVkdWN0aWJsZSIsInNpbHZlckRlZHVjdGlibGUiLCJBcHAiLCJfbGlzdGVuVG9XaW5kb3ciLCJoaWdobGlnaHQiLCJ0cmlnZ2VyIiwiQXBwTWFuYWdlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQU1BO0FBRUosaUNBQWM7QUFBQTs7QUFDWixRQUFNQyxnQkFBZ0IsS0FBdEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNDLEdBQUdDLE1BQUgsQ0FBVSxnQkFBVixDQUFkO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLEVBQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYVAsYUFBYjtBQUNBLFNBQUtRLE1BQUw7O0FBRUEsUUFBSUMsa0JBQWtCUCxHQUFHUSxNQUFILENBQVUsTUFBVixDQUF0QjtBQUNBQyxNQUFFLGtDQUFGLEVBQXNDQyxNQUF0QyxnQ0FBMEVILGdCQUFnQixLQUFLRixLQUFyQixDQUExRTtBQUNEOzs7OzZCQUVRO0FBQUE7O0FBRVAsVUFBTU0sT0FBTyxJQUFiO0FBQ0E7QUFDQSxVQUFJQyxRQUFRSCxFQUFFLFFBQUYsRUFBWUcsS0FBWixFQUFaO0FBQ0EsVUFBSUMsSUFBSWIsR0FBR2MsS0FBSCxDQUFTQyxHQUFULEdBQ0dDLE1BREgsQ0FDVSxDQUFDLEtBQUQsRUFBTyxNQUFQLENBRFYsQ0FBUjs7QUFHQSxVQUFJVCxrQkFBa0JQLEdBQUdRLE1BQUgsQ0FBVSxNQUFWLENBQXRCO0FBQ0EsV0FBS1QsTUFBTCxDQUFZa0IsSUFBWixDQUNFakIsR0FBR2tCLE1BQUgsR0FDR0MsSUFESCxDQUNRbkIsR0FBR29CLEdBQUgsQ0FBT0QsSUFBUCxHQUFjRSxVQUFkLENBQXlCLFVBQUNDLENBQUQ7QUFBQSxlQUFPLE1BQU1mLGdCQUFnQmUsSUFBRSxJQUFsQixDQUFOLEdBQThCLEdBQXJDO0FBQUEsT0FBekIs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QUNEOzs7Ozs7QUFHSG5ELE9BQU9vRCxVQUFQLEdBQW9CLElBQUlKLEdBQUosQ0FBUSxFQUFSLENBQXBCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFubnVhbFNhbGFyeUNvbnRyb2wge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IE1FRElBTl9JTkNPTUUgPSA2MDg1MDtcbiAgICB0aGlzLnRhcmdldCA9IGQzLnNlbGVjdCgnI2FubnVhbC1zYWxhcnknKTtcbiAgICB0aGlzLmNvbnRyb2wgPSBuZXcgQ2VudHJhbENvbnRyb2xsZXIoKTtcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMudmFsdWUgPSBNRURJQU5fSU5DT01FO1xuICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICB2YXIgY29tbWFzRm9ybWF0dGVyID0gZDMuZm9ybWF0KFwiLC4wZlwiKVxuICAgICQoXCIjYW5udWFsLXNhbGFyeSAuZDMtc2xpZGVyLWhhbmRsZVwiKS5hcHBlbmQoYDxzcGFuIGlkPSdjaG9zZW4tc2FsYXJ5Jz4kJHtjb21tYXNGb3JtYXR0ZXIodGhpcy52YWx1ZSl9PC9zcGFuPmApXG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAvLyB2YXIgeCA9IGQzLnNjYWxlLmxvZygpO1xuICAgIHZhciB3aWR0aCA9ICQoXCIjc3RhZ2VcIikud2lkdGgoKTtcbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxvZygpXG4gICAgICAgICAgICAgIC5kb21haW4oWzE1MDAwLDMwMDAwMF0pO1xuXG4gICAgdmFyIGNvbW1hc0Zvcm1hdHRlciA9IGQzLmZvcm1hdChcIiwuMGZcIilcbiAgICB0aGlzLnRhcmdldC5jYWxsKFxuICAgICAgZDMuc2xpZGVyKClcbiAgICAgICAgLmF4aXMoZDMuc3ZnLmF4aXMoKS50aWNrRm9ybWF0KChkKSA9PiBcIiRcIiArIGNvbW1hc0Zvcm1hdHRlcihkLzEwMDApK1wia1wiKSlcbiAgICAgICAgLnNjYWxlKHgpXG4gICAgICAgIC52YWx1ZSh0aGF0LnZhbHVlKS8vKHRoYXQudmFsdWUvMjAwMDAwKSAgKiAxMFxuICAgICAgICAub24oXCJzbGlkZVwiLCAoZXZ0LCB2YWx1ZSk9PntcbiAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgICAgdGhhdC52YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICB0aGF0LnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuY29udHJvbC51cGRhdGUoeyBzYWxhcnk6IHRoYXQudmFsdWUgfSk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAkKFwiI2Nob3Nlbi1zYWxhcnlcIikudGV4dChcIiRcIiArIGNvbW1hc0Zvcm1hdHRlcih0aGF0LnZhbHVlKSk7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIiwiY2xhc3MgQ2VudHJhbENvbnRyb2xsZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICAgIGlmIChcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaC5sZW5ndGggPiAwXG4gICAgKSB7XG4gICAgICB2YXIgaGFzaCA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkLnBhcmFtKE9iamVjdC5hc3NpZ24oaGFzaCwgb3B0aW9ucykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJC5wYXJhbShvcHRpb25zKTtcbiAgICB9XG4gIH1cblxufVxuIiwiY2xhc3MgUHJlbWl1bXNDb250cm9sIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRhcmdldCA9IGQzLnNlbGVjdCgnI3ByZW1pdW1zJyk7XG4gICAgdGhpcy5jb250cm9sID0gbmV3IENlbnRyYWxDb250cm9sbGVyKCk7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IE9VVF9PRl9QT0NLRVQgPSA1NTAwOyAvL3BlciB5ZWFyXG4gICAgY29uc3QgREVEVUNUSUJMRSA9IDIwMDA7XG4gICAgY29uc3QgTU9OVEhMWV9QUkVNSVVNID0gNDMwO1xuICAgIGNvbnN0IHRvdGFsX2Nvc3QgPSBNT05USExZX1BSRU1JVU0gKyAoT1VUX09GX1BPQ0tFVCArIERFRFVDVElCTEUpLzEyO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciB4ID0gZDMuc2NhbGUubGluZWFyKCkuaW52ZXJ0KCk7XG4gICAgdGhpcy50YXJnZXQuY2FsbChcbiAgICAgIGQzLnNsaWRlcigpXG4gICAgICAgIC52YWx1ZSg0MDAwIC0gdG90YWxfY29zdClcbiAgICAgICAgLm1pbig0MDAwKS5tYXgoMClcbiAgICAgICAgLmF4aXMoZDMuc3ZnLmF4aXMoKS50aWNrRm9ybWF0KChkKSA9PiBgJCR7ZH1gKS5vcmllbnQoJ3JpZ2h0JykgKVxuICAgICAgICAub24oXCJzbGlkZVwiLCAoZXZ0LCB2YWx1ZSk9PntcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuY29udHJvbC51cGRhdGUoeyBwcmVtaXVtOiBNYXRoLmZsb29yKDQwMDAtdmFsdWUpIH0pO1xuICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vcmllbnRhdGlvbihcInZlcnRpY2FsXCIpXG4gICAgKTtcbiAgfVxufVxuIiwiY2xhc3MgU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuXG4gICAgdmFyIGFubnVhbFNhbGFyeSA9IFtdO1xuICAgIHZhciBtYXJnaW4gPSB7dG9wOiA0MC41LCByaWdodDogNDAuNSwgYm90dG9tOiA1MC41LCBsZWZ0OiA2MC41fTtcblxuICAgIHZhciB3aWR0aCA9ICQoXCIjc3RhZ2VcIikud2lkdGgoKTtcbiAgICB2YXIgaGVpZ2h0ID0gJChcIiNzdGFnZVwiKS5oZWlnaHQoKTtcbiAgICB2YXIgc3VwZXJzY3JpcHQgPSBcIuKBsMK5wrLCs+KBtOKBteKBtuKBt+KBuOKBuVwiO1xuICAgIHZhciBmb3JtYXRQb3dlciA9IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIChkICsgXCJcIikuc3BsaXQoXCJcIikubWFwKGZ1bmN0aW9uKGMpIHsgcmV0dXJuIHN1cGVyc2NyaXB0W2NdOyB9KS5qb2luKFwiXCIpOyB9O1xuXG4gICAgdmFyIHggPSBkMy5zY2FsZS5sb2coKVxuICAgICAgICAgICAgICAuZG9tYWluKFsxNTAwMCwzMDAwMDBdKVxuICAgICAgICAgICAgICAucmFuZ2UoWzAsIHdpZHRoXSk7XG5cbiAgICB2YXIgeSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgICAgICAgIC5kb21haW4oWzAsNDAwMF0pXG4gICAgICAgICAgICAgIC5yYW5nZShbaGVpZ2h0LDBdKTtcblxuICAgIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgICAgLnNjYWxlKHgpXG4gICAgICAgIC5vcmllbnQoXCJib3R0b21cIilcbiAgICAgICAgLnRpY2tGb3JtYXQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSApO1xuXG4gICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgoZFswXSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkoZFsxXSk7IH0pO1xuXG4gICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNzdGFnZVwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblxuICAgIHZhciB5QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgICAgLnNjYWxlKHkpXG4gICAgICAgIC5vcmllbnQoXCJyaWdodFwiKTtcblxuXG4gICAgc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXMgYXhpcy0teVwiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgICAgIC5jYWxsKHlBeGlzKTtcblxuICAgIHN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzIGF4aXMtLXhcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIChoZWlnaHQgKyAxMCkgKyBcIilcIilcbiAgICAgICAgLmNhbGwoeEF4aXMpO1xuICAgIGNvbnN0IGRhdGEgPSBkMy5yYW5nZSgxNTAwMCwzMDAwMDAsMjAwMCkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIHByZW1pdW0gPSAwO1xuXG4gICAgICAgIGlmIChkIDwgMjUwMDApIHtcbiAgICAgICAgICByZXR1cm4gW2QsIDBdO1xuICAgICAgICB9IGVsc2UgaWYgKGQgPj0yNTAwMCAmJiBkIDwgNTAwMDApe1xuICAgICAgICAgIHJldHVybiBbZCwgKGQgLSAyNTAwMCkgKiAwLjA5IC8gMTJdO1xuICAgICAgICB9IGVsc2UgaWYgKGQgPj0gNTAwMDAgJiYgZCA8IDc1MDAwICkge1xuICAgICAgICAgIHJldHVybiBbZCwgKGQtMjUwMDApICogMC4xMSAvIDEyXTtcbiAgICAgICAgfSBlbHNlIGlmICggZCA+PSA3NTAwMCAmJiBkIDwgMTAwMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIFtkLCAoZCAtIDI1MDAwKSAqIDAuMTIgLyAxMl07XG4gICAgICAgIH0gZWxzZSBpZiAoIGQgPj0gMTAwMDAwICYmIGQgPCAyMDAwMDAgKSB7XG4gICAgICAgICAgcmV0dXJuIFtkLCAoZCAtIDI1MDAwKSAqIDAuMTQgLyAxMl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFtkLCAoZCAtIDI1MDAwKSAqIDAuMTYgLyAxMl07XG4gICAgICAgIH1cblxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIHN2Zy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShkYXRhKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGluZVwiKVxuICAgICAgICAuYXR0cihcImRcIiwgbGluZSk7XG5cbiAgICB2YXIgYWdlID0gMjg7XG5cbiAgICAvLyBBdmVyYWdlIHByaWNlcyBwZXIgYWdlOiBodHRwczovL3d3dy5oZWFsdGhwb2NrZXQuY29tL2luZGl2aWR1YWwtaGVhbHRoLWluc3VyYW5jZS9nb2xkLWhlYWx0aC1wbGFucyNwcmVtaXVtc1xuICAgIHZhciBnb2xkRGVkdWN0aWJsZSA9IDExNjUvMTI7XG4gICAgc3ZnLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKGQzLnJhbmdlKDE1MDAwLDMwMDAwMCwyMDAwKS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChhZ2UgPCA0MCkge1xuICAgICAgICAgICAgcmV0dXJuIFtkLCAzODAuOTggKyBnb2xkRGVkdWN0aWJsZV07XG4gICAgICAgICAgfSBlbHNlIGlmIChhZ2UgPj0gNDAgJiYgYWdlIDwgNTApIHtcbiAgICAgICAgICAgIHJldHVybiBbZCwgNTk5LjE2ICsgZ29sZERlZHVjdGlibGVdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2QsIDkwOS4yMiArIGdvbGREZWR1Y3RpYmxlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKS5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lLWdvbGRcIilcbiAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmUpO1xuXG5cbiAgICAvLyBBdmVyYWdlIHByaWNlcyBwZXIgYWdlOiBodHRwczovL3d3dy5oZWFsdGhwb2NrZXQuY29tL2luZGl2aWR1YWwtaGVhbHRoLWluc3VyYW5jZS9zaWx2ZXItaGVhbHRoLXBsYW5zI3ByZW1pdW1zXG4gICAgdmFyIHNpbHZlckRlZHVjdGlibGUgPSAzMTc3LzEyO1xuICAgIHN2Zy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShkMy5yYW5nZSgxNTAwMCwzMDAwMDAsMjAwMCkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAoYWdlIDwgNDApIHtcbiAgICAgICAgICAgIHJldHVybiBbZCwgMzUxLjAyICsgc2lsdmVyRGVkdWN0aWJsZV07XG4gICAgICAgICAgfSBlbHNlIGlmIChhZ2UgPj0gNDAgJiYgYWdlIDwgNTApIHtcbiAgICAgICAgICAgIHJldHVybiBbZCwgNDkwLjc1ICsgc2lsdmVyRGVkdWN0aWJsZV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbZCwgNzQ0Ljk5ICsgc2lsdmVyRGVkdWN0aWJsZV07XG4gICAgICAgICAgfVxuICAgICAgICB9KSkuYXR0cihcImNsYXNzXCIsIFwibGluZS1zaWx2ZXJcIilcbiAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmUpO1xuXG4gICAgLy8gQXZlcmFnZSBwcmljZXMgcGVyIGFnZTogaHR0cHM6Ly93d3cuaGVhbHRocG9ja2V0LmNvbS9pbmRpdmlkdWFsLWhlYWx0aC1pbnN1cmFuY2Uvc2lsdmVyLWhlYWx0aC1wbGFucyNwcmVtaXVtc1xuICAgIHZhciBzaWx2ZXJEZWR1Y3RpYmxlID0gNTczMS8xMjtcbiAgICBzdmcuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuZGF0dW0oZDMucmFuZ2UoMTUwMDAsMzAwMDAwLDIwMDApLm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGFnZSA8IDQwKSB7XG4gICAgICAgICAgICByZXR1cm4gW2QsIDI1Ny42OCArIHNpbHZlckRlZHVjdGlibGVdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWdlID49IDQwICYmIGFnZSA8IDUwKSB7XG4gICAgICAgICAgICByZXR1cm4gW2QsIDQwNS4yOFx0ICsgc2lsdmVyRGVkdWN0aWJsZV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbZCwgNjE1LjE1ICsgc2lsdmVyRGVkdWN0aWJsZV07XG4gICAgICAgICAgfVxuICAgICAgICB9KSkuYXR0cihcImNsYXNzXCIsIFwibGluZS1icm9uemVcIilcbiAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmUpO1xuICB9XG5cblxuICBoaWdobGlnaHQob3B0aW9ucykge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICB9XG59XG4iLCIvLyBjbGFzcyBTdGFnZSB7XG4vLyAgIGNvbnN0cnVjdG9yKCkge1xuLy8gICAgIHRoaXMucmVuZGVyKCk7XG4vLyAgIH1cbi8vXG4vLyAgIHJlbmRlcigpIHtcbi8vICAgICBjb25zb2xlLmxvZyhcIlhYWFwiKTtcbi8vXG4vLyAgICAgdmFyIHMyID0gZDMuc2NhbGUubG9nKCkuZG9tYWluKFsxLDEwMF0pLnJhbmdlKFsxLDIwXSk7XG4vLyAgICAgdmFyIHMgPSBkMy5zY2FsZS5sb2coKS5kb21haW4oWzEsMTAwXSkucmFuZ2UoWzEsMzAwMDAwXSk7XG4vLyAgICAgdmFyIHhUaWNrcyA9IFtdO1xuLy8gICAgIHZhciB5VmFsdWVzID0gW107XG4vL1xuLy8gICAgIHZhciBjdXJyID0gLTE7XG4vLyAgICAgeFRpY2tzLnB1c2goMjAwMDApO1xuLy8gICAgIHlWYWx1ZXMucHVzaCgwKTtcbi8vXG4vLyAgICAgZm9yICh2YXIgeD0yOyB4PD01MDsgeCsrKSB7XG4vLyAgICAgICB2YXIgeFZhbCA9IHMoeCk7XG4vL1xuLy8gICAgICAgaWYgKGN1cnIgIT0gTWF0aC5mbG9vcihzMih4KSkpIHtcbi8vICAgICAgICAgY3VyciA9IE1hdGguZmxvb3IoczIoeCkpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgY29udGludWU7XG4vLyAgICAgICB9XG4vLyAgICAgICBjb25zb2xlLmxvZyhcIkxPR1wiLCBNYXRoLmZsb29yKHMyKHgpKSk7XG4vL1xuLy8gICAgICAgeFRpY2tzLnB1c2goTWF0aC5mbG9vcihzKHgpLzEwMCkgKiAxMDApO1xuLy8gICAgICAgY29uc29sZS5sb2coXCJQdXNoaW5nXCIsIE1hdGguZmxvb3Iocyh4KS8xMDApICogMTAwKVxuLy8gICAgICAgaWYgKHhWYWwgPCAyNTAwMCkge1xuLy8gICAgICAgICB5VmFsdWVzLnB1c2goMClcbi8vICAgICAgIH0gZWxzZSBpZiAoeFZhbCA+IDI1MDAwICYmIHhWYWwgPD0gNTAwMDApIHtcbi8vICAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMDkgLyAxMikpO1xuLy8gICAgICAgfSBlbHNlIGlmICh4VmFsID4gNTAwMDAgJiYgeFZhbCA8PSA3NTAwMCkge1xuLy8gICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xMSAvIDEyKSk7XG4vLyAgICAgICB9IGVsc2UgaWYgKHhWYWwgPiA3NTAwMCAmJiB4VmFsIDw9IDEwMDAwMCkge1xuLy8gICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xMiAvIDEyKSk7XG4vLyAgICAgICB9IGVsc2UgaWYgKHhWYWwgPiAxMDAwMDAgJiYgeFZhbCA8PSAzMDAwMDApIHtcbi8vICAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMTQgLyAxMikpO1xuLy8gICAgICAgfSBlbHNlIGlmICh4VmFsID4gMzAwMDAwICkge1xuLy8gICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xNiAvIDEyKSk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIHhUaWNrcy5wdXNoKDMwMDAwMCk7XG4vLyAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoMzAwMDAwICogMC4xNiAvIDEyKSlcbi8vXG4vLyAgICAgLy8gY29uc29sZS5sb2coeFRpY2tzKTtcbi8vICAgICAvLyB2YXIgZGF0YV90ZXN0X29yaWdpbmFsID0gWydkYXRhMSddLmNvbmNhdCh5VmFsdWVzKTtcbi8vICAgICAvL1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKFwiWFhcIiwgZGF0YV90ZXN0X29yaWdpbmFsKTtcbi8vICAgICAvLyB2YXIgY2hhcnRfdGVzdCA9IGMzLmdlbmVyYXRlKHtcbi8vICAgICAvLyAgICAgYmluZHRvOiAnI3N0YWdlJyxcbi8vICAgICAvLyAgICAgZGF0YToge1xuLy8gICAgIC8vICAgICAgIHg6ICd4Jyxcbi8vICAgICAvLyAgICAgICBjb2x1bW5zOiBbXG4vLyAgICAgLy8gICAgICAgICBbJ3gnXS5jb25jYXQoeFRpY2tzKSxcbi8vICAgICAvLyAgICAgICAgIGRhdGFfdGVzdF9vcmlnaW5hbFxuLy8gICAgIC8vICAgICAgIF1cbi8vICAgICAvLyAgICAgfSxcbi8vICAgICAvL1xuLy8gICAgIC8vICAgICBheGlzIDoge1xuLy8gICAgIC8vICAgICAgICAgeCA6IHtcbi8vICAgICAvLyAgICAgICAgICAgICB0aWNrOiB7XG4vLyAgICAgLy8gICAgICAgICAgICAgICAgZm9ybWF0OiBmdW5jdGlvbiAoZCwgaWQpIHsgcmV0dXJuIE1hdGguZmxvb3IoZC8xMDApICogMTAwOyAgfVxuLy8gICAgIC8vICAgICAgICAgICAgIH1cbi8vICAgICAvLyAgICAgICAgIH1cbi8vICAgICAvLyAgICAgfSxcbi8vICAgICAvLyB9KTtcbi8vXG4vLyAgICAgY29uc29sZS5sb2coXCJYWFhcIik7XG4vLyAgICAgdmFyIGRhdGFfdGVzdCA9IFsnZGF0YTEnXTtcbi8vICAgICBjb25zb2xlLmxvZyh4VGlja3MpO1xuLy8gICAgIHZhciBkYXRhID0gW11cbi8vICAgICBmb3IodmFyIGk9MDsgaTx4VGlja3MubGVuZ3RoOyBpKyspe1xuLy8gICAgICAgY29uc29sZS5sb2coeFRpY2tzW2ldKTtcbi8vICAgICAgICAgZGF0YVtpXSA9IE1hdGgubG9nKHhUaWNrc1tpXSkgLyBNYXRoLkxOMTA7XG4vLyAgICAgfVxuLy8gICAgIGNvbnNvbGUubG9nKGRhdGFfdGVzdCk7XG4vL1xuLy8gICAgIHZhciBjaGFydF90ZXN0ID0gYzMuZ2VuZXJhdGUoe1xuLy8gICAgICAgICBiaW5kdG86ICcjc3RhZ2UnLFxuLy8gICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgeDogJ2RhdGExJyxcbi8vICAgICAgICAgICBjb2x1bW5zOiBbXG4vLyAgICAgICAgICAgICBkYXRhX3Rlc3QuY29uY2F0KGRhdGEpLFxuLy8gICAgICAgICAgICAgWydwcmVtaXVtJ10uY29uY2F0KHlWYWx1ZXMpXG4vLyAgICAgICAgICAgXVxuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBheGlzIDoge1xuLy8gICAgICAgICAgICAgeCA6IHtcbi8vICAgICAgICAgICAgICAgICB0aWNrOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gTWF0aC5wb3coMTAsZCkudG9GaXhlZCgyKTsgfVxuLy8gICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2Vcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICB5OiB7XG4vLyAgICAgICAgICAgICAgIHNob3c6ZmFsc2UsXG4vLyAgICAgICAgICAgICAgIG1heDogMjUwMFxuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBsZWdlbmQ6IHtcbi8vICAgICAgICAgICAgIHNob3c6IGZhbHNlXG4vLyAgICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfVxuLy9cbi8vICAgaGlnaGxpZ2h0KG9wdGlvbnMpIHtcbi8vICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbi8vICAgfVxuLy8gfVxuIiwiY2xhc3MgQXBwIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLl9saXN0ZW5Ub1dpbmRvdygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vTG9hZGluZyBkYXRhLi4uXG4gICAgdGhpcy5Bbm51YWxTYWxhcnlDb250cm9sID0gbmV3IEFubnVhbFNhbGFyeUNvbnRyb2woKTtcbiAgICB0aGlzLlByZW1pdW1zQ29udHJvbCA9IG5ldyBQcmVtaXVtc0NvbnRyb2woKTtcbiAgICB0aGlzLlN0YWdlID0gbmV3IFN0YWdlKCk7XG4gIH1cblxuICBfbGlzdGVuVG9XaW5kb3coKSB7XG5cbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCAoKT0+e1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgdGhpcy5TdGFnZS5oaWdobGlnaHQoaGFzaCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJCh3aW5kb3cpLnRyaWdnZXIoXCJoYXNoY2hhbmdlXCIpO1xuICB9XG59XG5cbndpbmRvdy5BcHBNYW5hZ2VyID0gbmV3IEFwcCh7fSk7XG4iXX0=
