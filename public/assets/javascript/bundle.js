"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var commasFormatter = d3.format(",.0f");

var AnnualSalaryControl = function () {
  function AnnualSalaryControl() {
    _classCallCheck(this, AnnualSalaryControl);

    var MEDIAN_INCOME = 60850;
    this.target = d3.select('#annual-salary');
    this.control = new CentralController();
    this.timeout = null;
    this.value = MEDIAN_INCOME;
    this.render();

    this.$salaryForm = $("input[name=annual-salary]");

    this.$salaryForm.val(this.value);

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
        _this.$salaryForm.val(_this.value);
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

var commasFormatter = d3.format(",.0f");

var PremiumsControl = function () {
  function PremiumsControl() {
    _classCallCheck(this, PremiumsControl);

    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.timeout = null;
    this.value = 1000;
    this.$premium = $("input[name=premium]");
    this.render();

    $("#premiums .d3-slider-handle").append("<span id='chosen-premium'>$" + commasFormatter(this.value) + "</span>");
    this.$premium.val(this.value);
  }

  _createClass(PremiumsControl, [{
    key: "render",
    value: function render() {
      var _this = this;

      var OUT_OF_POCKET = 5500; //per year
      var DEDUCTIBLE = 2000;
      var MONTHLY_PREMIUM = 430;
      var total_cost = MONTHLY_PREMIUM + (OUT_OF_POCKET + DEDUCTIBLE) / 12;
      var that = this;
      var x = d3.scale.linear().invert();
      this.target.call(d3.slider().value(4000 - total_cost).min(4000).max(0).axis(d3.svg.axis().tickFormat(function (d) {
        return "$" + d;
      }).orient('right')).on("slide", function (evt, value) {
        _this.value = value;
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          that.control.update({ premium: Math.floor(4000 - value) });
        }, 300);

        $("#chosen-premium").text("$" + commasFormatter(4000 - _this.value));

        _this.$premium.val(parseInt(4000 - _this.value));
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

      var age = 45;

      // Average prices per age: https://www.healthpocket.com/individual-health-insurance/gold-health-plans#premiums
      // var goldDeductible = 1165/12;
      // svg.append("path")
      //     .datum(d3.range(15000,300000,2000).map(function(d) {
      //       if (age < 40) {
      //         return [d, 380.98 + goldDeductible];
      //       } else if (age >= 40 && age < 50) {
      //         return [d, 599.16 + goldDeductible];
      //       } else {
      //         return [d, 909.22 + goldDeductible];
      //       }
      //     })).attr("class", "line-gold")
      //     .attr("d", line);
      //
      //
      // // Average prices per age: https://www.healthpocket.com/individual-health-insurance/silver-health-plans#premiums
      // var silverDeductible = 3177/12;
      // svg.append("path")
      //     .datum(d3.range(15000,300000,2000).map(function(d) {
      //       if (age < 40) {
      //         return [d, 351.02 + silverDeductible];
      //       } else if (age >= 40 && age < 50) {
      //         return [d, 490.75 + silverDeductible];
      //       } else {
      //         return [d, 744.99 + silverDeductible];
      //       }
      //     })).attr("class", "line-silver")
      //     .attr("d", line);
      //
      // // Average prices per age: https://www.healthpocket.com/individual-health-insurance/silver-health-plans#premiums
      // var silverDeductible = 5731/12;
      // svg.append("path")
      //     .datum(d3.range(15000,300000,2000).map(function(d) {
      //       if (age < 40) {
      //         return [d, 257.68 + silverDeductible];
      //       } else if (age >= 40 && age < 50) {
      //         return [d, 405.28	 + silverDeductible];
      //       } else {
      //         return [d, 615.15 + silverDeductible];
      //       }
      //     })).attr("class", "line-bronze")
      //     .attr("d", line);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvY29udHJvbHMvQW5udWFsU2FsYXJ5Q29udHJvbC5qcyIsImNsYXNzZXMvY29udHJvbHMvQ2VudHJhbENvbnRyb2xsZXIuanMiLCJjbGFzc2VzL2NvbnRyb2xzL1ByZW1pdW1zQ29udHJvbC5qcyIsImNsYXNzZXMvU3RhZ2UuanMiLCJjbGFzc2VzL1N0YWdlLm9sZC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJjb21tYXNGb3JtYXR0ZXIiLCJkMyIsImZvcm1hdCIsIkFubnVhbFNhbGFyeUNvbnRyb2wiLCJNRURJQU5fSU5DT01FIiwidGFyZ2V0Iiwic2VsZWN0IiwiY29udHJvbCIsIkNlbnRyYWxDb250cm9sbGVyIiwidGltZW91dCIsInZhbHVlIiwicmVuZGVyIiwiJHNhbGFyeUZvcm0iLCIkIiwidmFsIiwiYXBwZW5kIiwidGhhdCIsIndpZHRoIiwieCIsInNjYWxlIiwibG9nIiwiZG9tYWluIiwiY2FsbCIsInNsaWRlciIsImF4aXMiLCJzdmciLCJ0aWNrRm9ybWF0IiwiZCIsIm9uIiwiZXZ0IiwiY29uc29sZSIsImNsZWFyVGltZW91dCIsInBhcnNlSW50Iiwic2V0VGltZW91dCIsInVwZGF0ZSIsInNhbGFyeSIsInRleHQiLCJvcHRpb25zIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwibGVuZ3RoIiwiZGVwYXJhbSIsInN1YnN0cmluZyIsInBhcmFtIiwiT2JqZWN0IiwiYXNzaWduIiwiUHJlbWl1bXNDb250cm9sIiwiJHByZW1pdW0iLCJPVVRfT0ZfUE9DS0VUIiwiREVEVUNUSUJMRSIsIk1PTlRITFlfUFJFTUlVTSIsInRvdGFsX2Nvc3QiLCJsaW5lYXIiLCJpbnZlcnQiLCJtaW4iLCJtYXgiLCJvcmllbnQiLCJwcmVtaXVtIiwiTWF0aCIsImZsb29yIiwib3JpZW50YXRpb24iLCJTdGFnZSIsImFubnVhbFNhbGFyeSIsIm1hcmdpbiIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsImhlaWdodCIsInN1cGVyc2NyaXB0IiwiZm9ybWF0UG93ZXIiLCJzcGxpdCIsIm1hcCIsImMiLCJqb2luIiwicmFuZ2UiLCJ5IiwieEF4aXMiLCJsaW5lIiwiYXR0ciIsInlBeGlzIiwiZGF0YSIsImRhdHVtIiwiYWdlIiwiQXBwIiwiX2xpc3RlblRvV2luZG93IiwiaGlnaGxpZ2h0IiwidHJpZ2dlciIsIkFwcE1hbmFnZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU1BLGtCQUFrQkMsR0FBR0MsTUFBSCxDQUFVLE1BQVYsQ0FBeEI7O0lBRU1DO0FBRUosaUNBQWM7QUFBQTs7QUFDWixRQUFNQyxnQkFBZ0IsS0FBdEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNKLEdBQUdLLE1BQUgsQ0FBVSxnQkFBVixDQUFkO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLEVBQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYU4sYUFBYjtBQUNBLFNBQUtPLE1BQUw7O0FBRUEsU0FBS0MsV0FBTCxHQUFtQkMsRUFBRSwyQkFBRixDQUFuQjs7QUFFQSxTQUFLRCxXQUFMLENBQWlCRSxHQUFqQixDQUFxQixLQUFLSixLQUExQjs7QUFFQUcsTUFBRSxrQ0FBRixFQUFzQ0UsTUFBdEMsZ0NBQTBFZixnQkFBZ0IsS0FBS1UsS0FBckIsQ0FBMUU7QUFDRDs7Ozs2QkFFUTtBQUFBOztBQUVQLFVBQU1NLE9BQU8sSUFBYjtBQUNBO0FBQ0EsVUFBSUMsUUFBUUosRUFBRSxRQUFGLEVBQVlJLEtBQVosRUFBWjtBQUNBLFVBQUlDLElBQUlqQixHQUFHa0IsS0FBSCxDQUFTQyxHQUFULEdBQ0dDLE1BREgsQ0FDVSxDQUFDLEtBQUQsRUFBTyxNQUFQLENBRFYsQ0FBUjs7QUFHQSxVQUFJckIsa0JBQWtCQyxHQUFHQyxNQUFILENBQVUsTUFBVixDQUF0QjtBQUNBLFdBQUtHLE1BQUwsQ0FBWWlCLElBQVosQ0FDRXJCLEdBQUdzQixNQUFILEdBQ0dDLElBREgsQ0FDUXZCLEdBQUd3QixHQUFILENBQU9ELElBQVAsR0FBY0UsVUFBZCxDQUF5QixVQUFDQyxDQUFEO0FBQUEsZUFBTyxNQUFNM0IsZ0JBQWdCMkIsSUFBRSxJQUFsQixDQUFOLEdBQThCLEdBQXJDO0FBQUEsT0FBekIsQ0FEUixFQUVHUixLQUZILENBRVNELENBRlQsRUFHR1IsS0FISCxDQUdTTSxLQUFLTixLQUhkLEVBR29CO0FBSHBCLE9BSUdrQixFQUpILENBSU0sT0FKTixFQUllLFVBQUNDLEdBQUQsRUFBTW5CLEtBQU4sRUFBYztBQUN6Qm9CLGdCQUFRVixHQUFSLENBQVlWLEtBQVo7QUFDQXFCLHFCQUFhLE1BQUt0QixPQUFsQjtBQUNBTyxhQUFLTixLQUFMLEdBQWFzQixTQUFTdEIsS0FBVCxDQUFiO0FBQ0FNLGFBQUtQLE9BQUwsR0FBZXdCLFdBQVcsWUFBTTtBQUM5QmpCLGVBQUtULE9BQUwsQ0FBYTJCLE1BQWIsQ0FBb0IsRUFBRUMsUUFBUW5CLEtBQUtOLEtBQWYsRUFBcEI7QUFDRCxTQUZjLEVBRVosR0FGWSxDQUFmO0FBR0FHLFVBQUUsZ0JBQUYsRUFBb0J1QixJQUFwQixDQUF5QixNQUFNcEMsZ0JBQWdCZ0IsS0FBS04sS0FBckIsQ0FBL0I7QUFDQSxjQUFLRSxXQUFMLENBQWlCRSxHQUFqQixDQUFxQixNQUFLSixLQUExQjtBQUNELE9BYkgsQ0FERjtBQWdCRDs7Ozs7Ozs7Ozs7SUM1Q0dGO0FBRUosK0JBQWM7QUFBQTs7QUFDWixTQUFLNkIsT0FBTCxHQUFlLEVBQWY7QUFDRDs7Ozs2QkFFb0I7QUFBQSxVQUFkQSxPQUFjLHVFQUFKLEVBQUk7O0FBQ25CUCxjQUFRVixHQUFSLENBQVlpQixPQUFaO0FBQ0EsVUFDRUMsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsSUFDQUYsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLE1BQXJCLEdBQThCLENBRmhDLEVBR0U7QUFDQSxZQUFJRCxPQUFPM0IsRUFBRTZCLE9BQUYsQ0FBVUosT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJHLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBWDtBQUNBTCxlQUFPQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QjNCLEVBQUUrQixLQUFGLENBQVFDLE9BQU9DLE1BQVAsQ0FBY04sSUFBZCxFQUFvQkgsT0FBcEIsQ0FBUixDQUF2QjtBQUNELE9BTkQsTUFNTztBQUNMUCxnQkFBUVYsR0FBUixDQUFZaUIsT0FBWjtBQUNBQyxlQUFPQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QjNCLEVBQUUrQixLQUFGLENBQVFQLE9BQVIsQ0FBdkI7QUFDRDtBQUNGOzs7Ozs7Ozs7OztBQ2xCSCxJQUFNckMsa0JBQWtCQyxHQUFHQyxNQUFILENBQVUsTUFBVixDQUF4Qjs7SUFFTTZDO0FBRUosNkJBQWM7QUFBQTs7QUFDWixTQUFLMUMsTUFBTCxHQUFjSixHQUFHSyxNQUFILENBQVUsV0FBVixDQUFkO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLEVBQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsU0FBS3NDLFFBQUwsR0FBZ0JuQyxFQUFFLHFCQUFGLENBQWhCO0FBQ0EsU0FBS0YsTUFBTDs7QUFFQUUsTUFBRSw2QkFBRixFQUFpQ0UsTUFBakMsaUNBQXNFZixnQkFBZ0IsS0FBS1UsS0FBckIsQ0FBdEU7QUFDQSxTQUFLc0MsUUFBTCxDQUFjbEMsR0FBZCxDQUFrQixLQUFLSixLQUF2QjtBQUNEOzs7OzZCQUVRO0FBQUE7O0FBQ1AsVUFBTXVDLGdCQUFnQixJQUF0QixDQURPLENBQ3FCO0FBQzVCLFVBQU1DLGFBQWEsSUFBbkI7QUFDQSxVQUFNQyxrQkFBa0IsR0FBeEI7QUFDQSxVQUFNQyxhQUFhRCxrQkFBa0IsQ0FBQ0YsZ0JBQWdCQyxVQUFqQixJQUE2QixFQUFsRTtBQUNBLFVBQU1sQyxPQUFPLElBQWI7QUFDQSxVQUFJRSxJQUFJakIsR0FBR2tCLEtBQUgsQ0FBU2tDLE1BQVQsR0FBa0JDLE1BQWxCLEVBQVI7QUFDQSxXQUFLakQsTUFBTCxDQUFZaUIsSUFBWixDQUNFckIsR0FBR3NCLE1BQUgsR0FDR2IsS0FESCxDQUNTLE9BQU8wQyxVQURoQixFQUVHRyxHQUZILENBRU8sSUFGUCxFQUVhQyxHQUZiLENBRWlCLENBRmpCLEVBR0doQyxJQUhILENBR1F2QixHQUFHd0IsR0FBSCxDQUFPRCxJQUFQLEdBQWNFLFVBQWQsQ0FBeUIsVUFBQ0MsQ0FBRDtBQUFBLHFCQUFXQSxDQUFYO0FBQUEsT0FBekIsRUFBeUM4QixNQUF6QyxDQUFnRCxPQUFoRCxDQUhSLEVBSUc3QixFQUpILENBSU0sT0FKTixFQUllLFVBQUNDLEdBQUQsRUFBTW5CLEtBQU4sRUFBYztBQUN6QixjQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQXFCLHFCQUFhLE1BQUt0QixPQUFsQjtBQUNBLGNBQUtBLE9BQUwsR0FBZXdCLFdBQVcsWUFBTTtBQUM5QmpCLGVBQUtULE9BQUwsQ0FBYTJCLE1BQWIsQ0FBb0IsRUFBRXdCLFNBQVNDLEtBQUtDLEtBQUwsQ0FBVyxPQUFLbEQsS0FBaEIsQ0FBWCxFQUFwQjtBQUNELFNBRmMsRUFFWixHQUZZLENBQWY7O0FBSUFHLFVBQUUsaUJBQUYsRUFBcUJ1QixJQUFyQixDQUEwQixNQUFNcEMsZ0JBQWdCLE9BQUssTUFBS1UsS0FBMUIsQ0FBaEM7O0FBRUEsY0FBS3NDLFFBQUwsQ0FBY2xDLEdBQWQsQ0FBa0JrQixTQUFTLE9BQUssTUFBS3RCLEtBQW5CLENBQWxCO0FBQ0QsT0FkSCxFQWVHbUQsV0FmSCxDQWVlLFVBZmYsQ0FERjtBQWtCRDs7Ozs7Ozs7Ozs7SUN6Q0dDO0FBQ0osbUJBQWM7QUFBQTs7QUFDWixTQUFLbkQsTUFBTDtBQUNEOzs7OzZCQUVROztBQUVQLFVBQUlvRCxlQUFlLEVBQW5CO0FBQ0EsVUFBSUMsU0FBUyxFQUFDQyxLQUFLLElBQU4sRUFBWUMsT0FBTyxJQUFuQixFQUF5QkMsUUFBUSxJQUFqQyxFQUF1Q0MsTUFBTSxJQUE3QyxFQUFiOztBQUVBLFVBQUluRCxRQUFRSixFQUFFLFFBQUYsRUFBWUksS0FBWixFQUFaO0FBQ0EsVUFBSW9ELFNBQVN4RCxFQUFFLFFBQUYsRUFBWXdELE1BQVosRUFBYjtBQUNBLFVBQUlDLGNBQWMsWUFBbEI7QUFDQSxVQUFJQyxjQUFjLFNBQWRBLFdBQWMsQ0FBUzVDLENBQVQsRUFBWTtBQUFFLGVBQU8sQ0FBQ0EsSUFBSSxFQUFMLEVBQVM2QyxLQUFULENBQWUsRUFBZixFQUFtQkMsR0FBbkIsQ0FBdUIsVUFBU0MsQ0FBVCxFQUFZO0FBQUUsaUJBQU9KLFlBQVlJLENBQVosQ0FBUDtBQUF3QixTQUE3RCxFQUErREMsSUFBL0QsQ0FBb0UsRUFBcEUsQ0FBUDtBQUFpRixPQUFqSDs7QUFFQSxVQUFJekQsSUFBSWpCLEdBQUdrQixLQUFILENBQVNDLEdBQVQsR0FDR0MsTUFESCxDQUNVLENBQUMsS0FBRCxFQUFPLE1BQVAsQ0FEVixFQUVHdUQsS0FGSCxDQUVTLENBQUMsQ0FBRCxFQUFJM0QsS0FBSixDQUZULENBQVI7O0FBSUEsVUFBSTRELElBQUk1RSxHQUFHa0IsS0FBSCxDQUFTa0MsTUFBVCxHQUNHaEMsTUFESCxDQUNVLENBQUMsQ0FBRCxFQUFHLElBQUgsQ0FEVixFQUVHdUQsS0FGSCxDQUVTLENBQUNQLE1BQUQsRUFBUSxDQUFSLENBRlQsQ0FBUjs7QUFJQSxVQUFJUyxRQUFRN0UsR0FBR3dCLEdBQUgsQ0FBT0QsSUFBUCxHQUNQTCxLQURPLENBQ0RELENBREMsRUFFUHVDLE1BRk8sQ0FFQSxRQUZBLEVBR1AvQixVQUhPLENBR0ksVUFBU0MsQ0FBVCxFQUFZO0FBQUUsZUFBT0EsQ0FBUDtBQUFXLE9BSDdCLENBQVo7O0FBS0EsVUFBSW9ELE9BQU85RSxHQUFHd0IsR0FBSCxDQUFPc0QsSUFBUCxHQUNON0QsQ0FETSxDQUNKLFVBQVNTLENBQVQsRUFBWTtBQUFFLGVBQU9ULEVBQUVTLEVBQUUsQ0FBRixDQUFGLENBQVA7QUFBaUIsT0FEM0IsRUFFTmtELENBRk0sQ0FFSixVQUFTbEQsQ0FBVCxFQUFZO0FBQUUsZUFBT2tELEVBQUVsRCxFQUFFLENBQUYsQ0FBRixDQUFQO0FBQWlCLE9BRjNCLENBQVg7O0FBSUEsVUFBSUYsTUFBTXhCLEdBQUdLLE1BQUgsQ0FBVSxRQUFWLEVBQW9CUyxNQUFwQixDQUEyQixLQUEzQixFQUNPaUUsSUFEUCxDQUNZLE9BRFosRUFDcUIvRCxRQUFRK0MsT0FBT0ksSUFBZixHQUFzQkosT0FBT0UsS0FEbEQsRUFFT2MsSUFGUCxDQUVZLFFBRlosRUFFc0JYLFNBQVNMLE9BQU9DLEdBQWhCLEdBQXNCRCxPQUFPRyxNQUZuRCxDQUFWOztBQUlBLFVBQUljLFFBQVFoRixHQUFHd0IsR0FBSCxDQUFPRCxJQUFQLEdBQ1BMLEtBRE8sQ0FDRDBELENBREMsRUFFUHBCLE1BRk8sQ0FFQSxPQUZBLENBQVo7O0FBS0FoQyxVQUFJVixNQUFKLENBQVcsR0FBWCxFQUNLaUUsSUFETCxDQUNVLE9BRFYsRUFDbUIsY0FEbkIsRUFFS0EsSUFGTCxDQUVVLFdBRlYsRUFFdUIsZ0JBRnZCLEVBR0sxRCxJQUhMLENBR1UyRCxLQUhWOztBQUtBeEQsVUFBSVYsTUFBSixDQUFXLEdBQVgsRUFDS2lFLElBREwsQ0FDVSxPQURWLEVBQ21CLGNBRG5CLEVBRUtBLElBRkwsQ0FFVSxXQUZWLEVBRXVCLGtCQUFrQlgsU0FBUyxFQUEzQixJQUFpQyxHQUZ4RCxFQUdLL0MsSUFITCxDQUdVd0QsS0FIVjtBQUlBLFVBQU1JLE9BQU9qRixHQUFHMkUsS0FBSCxDQUFTLEtBQVQsRUFBZSxNQUFmLEVBQXNCLElBQXRCLEVBQTRCSCxHQUE1QixDQUFnQyxVQUFTOUMsQ0FBVCxFQUFZO0FBQ3JELFlBQUkrQixVQUFVLENBQWQ7O0FBRUEsWUFBSS9CLElBQUksS0FBUixFQUFlO0FBQ2IsaUJBQU8sQ0FBQ0EsQ0FBRCxFQUFJLENBQUosQ0FBUDtBQUNELFNBRkQsTUFFTyxJQUFJQSxLQUFJLEtBQUosSUFBYUEsSUFBSSxLQUFyQixFQUEyQjtBQUNoQyxpQkFBTyxDQUFDQSxDQUFELEVBQUksQ0FBQ0EsSUFBSSxLQUFMLElBQWMsSUFBZCxHQUFxQixFQUF6QixDQUFQO0FBQ0QsU0FGTSxNQUVBLElBQUlBLEtBQUssS0FBTCxJQUFjQSxJQUFJLEtBQXRCLEVBQThCO0FBQ25DLGlCQUFPLENBQUNBLENBQUQsRUFBSSxDQUFDQSxJQUFFLEtBQUgsSUFBWSxJQUFaLEdBQW1CLEVBQXZCLENBQVA7QUFDRCxTQUZNLE1BRUEsSUFBS0EsS0FBSyxLQUFMLElBQWNBLElBQUksTUFBdkIsRUFBK0I7QUFDcEMsaUJBQU8sQ0FBQ0EsQ0FBRCxFQUFJLENBQUNBLElBQUksS0FBTCxJQUFjLElBQWQsR0FBcUIsRUFBekIsQ0FBUDtBQUNELFNBRk0sTUFFQSxJQUFLQSxLQUFLLE1BQUwsSUFBZUEsSUFBSSxNQUF4QixFQUFpQztBQUN0QyxpQkFBTyxDQUFDQSxDQUFELEVBQUksQ0FBQ0EsSUFBSSxLQUFMLElBQWMsSUFBZCxHQUFxQixFQUF6QixDQUFQO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsaUJBQU8sQ0FBQ0EsQ0FBRCxFQUFJLENBQUNBLElBQUksS0FBTCxJQUFjLElBQWQsR0FBcUIsRUFBekIsQ0FBUDtBQUNEO0FBRUosT0FqQlksQ0FBYjtBQWtCQUcsY0FBUVYsR0FBUixDQUFZOEQsSUFBWjtBQUNBekQsVUFBSVYsTUFBSixDQUFXLE1BQVgsRUFDS29FLEtBREwsQ0FDV0QsSUFEWCxFQUVLRixJQUZMLENBRVUsT0FGVixFQUVtQixNQUZuQixFQUdLQSxJQUhMLENBR1UsR0FIVixFQUdlRCxJQUhmOztBQUtBLFVBQUlLLE1BQU0sRUFBVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7OzhCQUdTL0MsU0FBUztBQUNqQlAsY0FBUVYsR0FBUixDQUFZaUIsT0FBWjtBQUNEOzs7OztBQzNISDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztJQzdHTWdEO0FBQ0osZUFBWWhELE9BQVosRUFBcUI7QUFBQTs7QUFFbkIsU0FBSzFCLE1BQUw7QUFDQSxTQUFLMkUsZUFBTDtBQUNEOzs7OzZCQUVRO0FBQ1A7QUFDQSxXQUFLbkYsbUJBQUwsR0FBMkIsSUFBSUEsbUJBQUosRUFBM0I7QUFDQSxXQUFLNEMsZUFBTCxHQUF1QixJQUFJQSxlQUFKLEVBQXZCO0FBQ0EsV0FBS2UsS0FBTCxHQUFhLElBQUlBLEtBQUosRUFBYjtBQUNEOzs7c0NBRWlCO0FBQUE7O0FBRWhCakQsUUFBRXlCLE1BQUYsRUFBVVYsRUFBVixDQUFhLFlBQWIsRUFBMkIsWUFBSTtBQUM3QixZQUFJVSxPQUFPQyxRQUFQLENBQWdCQyxJQUFoQixJQUF3QkYsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLE1BQXJCLEdBQThCLENBQTFELEVBQ0E7QUFDRSxjQUFNRCxPQUFPM0IsRUFBRTZCLE9BQUYsQ0FBVUosT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJHLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBYjtBQUNBLGdCQUFLbUIsS0FBTCxDQUFXeUIsU0FBWCxDQUFxQi9DLElBQXJCO0FBQ0Q7QUFDRixPQU5EO0FBT0EzQixRQUFFeUIsTUFBRixFQUFVa0QsT0FBVixDQUFrQixZQUFsQjtBQUNEOzs7Ozs7QUFHSGxELE9BQU9tRCxVQUFQLEdBQW9CLElBQUlKLEdBQUosQ0FBUSxFQUFSLENBQXBCIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNvbW1hc0Zvcm1hdHRlciA9IGQzLmZvcm1hdChcIiwuMGZcIilcblxuY2xhc3MgQW5udWFsU2FsYXJ5Q29udHJvbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgTUVESUFOX0lOQ09NRSA9IDYwODUwO1xuICAgIHRoaXMudGFyZ2V0ID0gZDMuc2VsZWN0KCcjYW5udWFsLXNhbGFyeScpO1xuICAgIHRoaXMuY29udHJvbCA9IG5ldyBDZW50cmFsQ29udHJvbGxlcigpO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZSA9IE1FRElBTl9JTkNPTUU7XG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIHRoaXMuJHNhbGFyeUZvcm0gPSAkKFwiaW5wdXRbbmFtZT1hbm51YWwtc2FsYXJ5XVwiKTtcblxuICAgIHRoaXMuJHNhbGFyeUZvcm0udmFsKHRoaXMudmFsdWUpO1xuXG4gICAgJChcIiNhbm51YWwtc2FsYXJ5IC5kMy1zbGlkZXItaGFuZGxlXCIpLmFwcGVuZChgPHNwYW4gaWQ9J2Nob3Nlbi1zYWxhcnknPiQke2NvbW1hc0Zvcm1hdHRlcih0aGlzLnZhbHVlKX08L3NwYW4+YClcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIC8vIHZhciB4ID0gZDMuc2NhbGUubG9nKCk7XG4gICAgdmFyIHdpZHRoID0gJChcIiNzdGFnZVwiKS53aWR0aCgpO1xuICAgIHZhciB4ID0gZDMuc2NhbGUubG9nKClcbiAgICAgICAgICAgICAgLmRvbWFpbihbMTUwMDAsMzAwMDAwXSk7XG5cbiAgICB2YXIgY29tbWFzRm9ybWF0dGVyID0gZDMuZm9ybWF0KFwiLC4wZlwiKVxuICAgIHRoaXMudGFyZ2V0LmNhbGwoXG4gICAgICBkMy5zbGlkZXIoKVxuICAgICAgICAuYXhpcyhkMy5zdmcuYXhpcygpLnRpY2tGb3JtYXQoKGQpID0+IFwiJFwiICsgY29tbWFzRm9ybWF0dGVyKGQvMTAwMCkrXCJrXCIpKVxuICAgICAgICAuc2NhbGUoeClcbiAgICAgICAgLnZhbHVlKHRoYXQudmFsdWUpLy8odGhhdC52YWx1ZS8yMDAwMDApICAqIDEwXG4gICAgICAgIC5vbihcInNsaWRlXCIsIChldnQsIHZhbHVlKT0+e1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgICB0aGF0LnZhbHVlID0gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgIHRoYXQudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5jb250cm9sLnVwZGF0ZSh7IHNhbGFyeTogdGhhdC52YWx1ZSB9KTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgICQoXCIjY2hvc2VuLXNhbGFyeVwiKS50ZXh0KFwiJFwiICsgY29tbWFzRm9ybWF0dGVyKHRoYXQudmFsdWUpKTtcbiAgICAgICAgICB0aGlzLiRzYWxhcnlGb3JtLnZhbCh0aGlzLnZhbHVlKTtcbiAgICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iLCJjbGFzcyBDZW50cmFsQ29udHJvbGxlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gICAgaWYgKFxuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggJiZcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIHZhciBoYXNoID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICQucGFyYW0oT2JqZWN0LmFzc2lnbihoYXNoLCBvcHRpb25zKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkLnBhcmFtKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG59XG4iLCJjb25zdCBjb21tYXNGb3JtYXR0ZXIgPSBkMy5mb3JtYXQoXCIsLjBmXCIpXG5cbmNsYXNzIFByZW1pdW1zQ29udHJvbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSBkMy5zZWxlY3QoJyNwcmVtaXVtcycpO1xuICAgIHRoaXMuY29udHJvbCA9IG5ldyBDZW50cmFsQ29udHJvbGxlcigpO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZSA9IDEwMDA7XG4gICAgdGhpcy4kcHJlbWl1bSA9ICQoXCJpbnB1dFtuYW1lPXByZW1pdW1dXCIpO1xuICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAkKFwiI3ByZW1pdW1zIC5kMy1zbGlkZXItaGFuZGxlXCIpLmFwcGVuZChgPHNwYW4gaWQ9J2Nob3Nlbi1wcmVtaXVtJz4kJHtjb21tYXNGb3JtYXR0ZXIodGhpcy52YWx1ZSl9PC9zcGFuPmApXG4gICAgdGhpcy4kcHJlbWl1bS52YWwodGhpcy52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgT1VUX09GX1BPQ0tFVCA9IDU1MDA7IC8vcGVyIHllYXJcbiAgICBjb25zdCBERURVQ1RJQkxFID0gMjAwMDtcbiAgICBjb25zdCBNT05USExZX1BSRU1JVU0gPSA0MzA7XG4gICAgY29uc3QgdG90YWxfY29zdCA9IE1PTlRITFlfUFJFTUlVTSArIChPVVRfT0ZfUE9DS0VUICsgREVEVUNUSUJMRSkvMTI7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5pbnZlcnQoKTtcbiAgICB0aGlzLnRhcmdldC5jYWxsKFxuICAgICAgZDMuc2xpZGVyKClcbiAgICAgICAgLnZhbHVlKDQwMDAgLSB0b3RhbF9jb3N0KVxuICAgICAgICAubWluKDQwMDApLm1heCgwKVxuICAgICAgICAuYXhpcyhkMy5zdmcuYXhpcygpLnRpY2tGb3JtYXQoKGQpID0+IGAkJHtkfWApLm9yaWVudCgncmlnaHQnKSApXG4gICAgICAgIC5vbihcInNsaWRlXCIsIChldnQsIHZhbHVlKT0+e1xuICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuY29udHJvbC51cGRhdGUoeyBwcmVtaXVtOiBNYXRoLmZsb29yKDQwMDAtdmFsdWUpIH0pO1xuICAgICAgICAgIH0sIDMwMCk7XG5cbiAgICAgICAgICAkKFwiI2Nob3Nlbi1wcmVtaXVtXCIpLnRleHQoXCIkXCIgKyBjb21tYXNGb3JtYXR0ZXIoNDAwMC10aGlzLnZhbHVlKSk7XG5cbiAgICAgICAgICB0aGlzLiRwcmVtaXVtLnZhbChwYXJzZUludCg0MDAwLXRoaXMudmFsdWUpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9yaWVudGF0aW9uKFwidmVydGljYWxcIilcbiAgICApO1xuICB9XG59XG4iLCJjbGFzcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICB2YXIgYW5udWFsU2FsYXJ5ID0gW107XG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDQwLjUsIHJpZ2h0OiA0MC41LCBib3R0b206IDUwLjUsIGxlZnQ6IDYwLjV9O1xuXG4gICAgdmFyIHdpZHRoID0gJChcIiNzdGFnZVwiKS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSAkKFwiI3N0YWdlXCIpLmhlaWdodCgpO1xuICAgIHZhciBzdXBlcnNjcmlwdCA9IFwi4oGwwrnCssKz4oG04oG14oG24oG34oG44oG5XCI7XG4gICAgdmFyIGZvcm1hdFBvd2VyID0gZnVuY3Rpb24oZCkgeyByZXR1cm4gKGQgKyBcIlwiKS5zcGxpdChcIlwiKS5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gc3VwZXJzY3JpcHRbY107IH0pLmpvaW4oXCJcIik7IH07XG5cbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxvZygpXG4gICAgICAgICAgICAgIC5kb21haW4oWzE1MDAwLDMwMDAwMF0pXG4gICAgICAgICAgICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICAgIHZhciB5ID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgICAgICAgICAgLmRvbWFpbihbMCw0MDAwXSlcbiAgICAgICAgICAgICAgLnJhbmdlKFtoZWlnaHQsMF0pO1xuXG4gICAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgICAuc2NhbGUoeClcbiAgICAgICAgLm9yaWVudChcImJvdHRvbVwiKVxuICAgICAgICAudGlja0Zvcm1hdChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9ICk7XG5cbiAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geChkWzBdKTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geShkWzFdKTsgfSk7XG5cbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI3N0YWdlXCIpLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKVxuXG4gICAgdmFyIHlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgICAuc2NhbGUoeSlcbiAgICAgICAgLm9yaWVudChcInJpZ2h0XCIpO1xuXG5cbiAgICBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiYXhpcyBheGlzLS15XCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIilcbiAgICAgICAgLmNhbGwoeUF4aXMpO1xuXG4gICAgc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXMgYXhpcy0teFwiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgKGhlaWdodCArIDEwKSArIFwiKVwiKVxuICAgICAgICAuY2FsbCh4QXhpcyk7XG4gICAgY29uc3QgZGF0YSA9IGQzLnJhbmdlKDE1MDAwLDMwMDAwMCwyMDAwKS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICB2YXIgcHJlbWl1bSA9IDA7XG5cbiAgICAgICAgaWYgKGQgPCAyNTAwMCkge1xuICAgICAgICAgIHJldHVybiBbZCwgMF07XG4gICAgICAgIH0gZWxzZSBpZiAoZCA+PTI1MDAwICYmIGQgPCA1MDAwMCl7XG4gICAgICAgICAgcmV0dXJuIFtkLCAoZCAtIDI1MDAwKSAqIDAuMDkgLyAxMl07XG4gICAgICAgIH0gZWxzZSBpZiAoZCA+PSA1MDAwMCAmJiBkIDwgNzUwMDAgKSB7XG4gICAgICAgICAgcmV0dXJuIFtkLCAoZC0yNTAwMCkgKiAwLjExIC8gMTJdO1xuICAgICAgICB9IGVsc2UgaWYgKCBkID49IDc1MDAwICYmIGQgPCAxMDAwMDApIHtcbiAgICAgICAgICByZXR1cm4gW2QsIChkIC0gMjUwMDApICogMC4xMiAvIDEyXTtcbiAgICAgICAgfSBlbHNlIGlmICggZCA+PSAxMDAwMDAgJiYgZCA8IDIwMDAwMCApIHtcbiAgICAgICAgICByZXR1cm4gW2QsIChkIC0gMjUwMDApICogMC4xNCAvIDEyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW2QsIChkIC0gMjUwMDApICogMC4xNiAvIDEyXTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgc3ZnLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKGRhdGEpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXG4gICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lKTtcblxuICAgIHZhciBhZ2UgPSA0NTtcblxuICAgIC8vIEF2ZXJhZ2UgcHJpY2VzIHBlciBhZ2U6IGh0dHBzOi8vd3d3LmhlYWx0aHBvY2tldC5jb20vaW5kaXZpZHVhbC1oZWFsdGgtaW5zdXJhbmNlL2dvbGQtaGVhbHRoLXBsYW5zI3ByZW1pdW1zXG4gICAgLy8gdmFyIGdvbGREZWR1Y3RpYmxlID0gMTE2NS8xMjtcbiAgICAvLyBzdmcuYXBwZW5kKFwicGF0aFwiKVxuICAgIC8vICAgICAuZGF0dW0oZDMucmFuZ2UoMTUwMDAsMzAwMDAwLDIwMDApLm1hcChmdW5jdGlvbihkKSB7XG4gICAgLy8gICAgICAgaWYgKGFnZSA8IDQwKSB7XG4gICAgLy8gICAgICAgICByZXR1cm4gW2QsIDM4MC45OCArIGdvbGREZWR1Y3RpYmxlXTtcbiAgICAvLyAgICAgICB9IGVsc2UgaWYgKGFnZSA+PSA0MCAmJiBhZ2UgPCA1MCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIFtkLCA1OTkuMTYgKyBnb2xkRGVkdWN0aWJsZV07XG4gICAgLy8gICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBbZCwgOTA5LjIyICsgZ29sZERlZHVjdGlibGVdO1xuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfSkpLmF0dHIoXCJjbGFzc1wiLCBcImxpbmUtZ29sZFwiKVxuICAgIC8vICAgICAuYXR0cihcImRcIiwgbGluZSk7XG4gICAgLy9cbiAgICAvL1xuICAgIC8vIC8vIEF2ZXJhZ2UgcHJpY2VzIHBlciBhZ2U6IGh0dHBzOi8vd3d3LmhlYWx0aHBvY2tldC5jb20vaW5kaXZpZHVhbC1oZWFsdGgtaW5zdXJhbmNlL3NpbHZlci1oZWFsdGgtcGxhbnMjcHJlbWl1bXNcbiAgICAvLyB2YXIgc2lsdmVyRGVkdWN0aWJsZSA9IDMxNzcvMTI7XG4gICAgLy8gc3ZnLmFwcGVuZChcInBhdGhcIilcbiAgICAvLyAgICAgLmRhdHVtKGQzLnJhbmdlKDE1MDAwLDMwMDAwMCwyMDAwKS5tYXAoZnVuY3Rpb24oZCkge1xuICAgIC8vICAgICAgIGlmIChhZ2UgPCA0MCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIFtkLCAzNTEuMDIgKyBzaWx2ZXJEZWR1Y3RpYmxlXTtcbiAgICAvLyAgICAgICB9IGVsc2UgaWYgKGFnZSA+PSA0MCAmJiBhZ2UgPCA1MCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIFtkLCA0OTAuNzUgKyBzaWx2ZXJEZWR1Y3RpYmxlXTtcbiAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgcmV0dXJuIFtkLCA3NDQuOTkgKyBzaWx2ZXJEZWR1Y3RpYmxlXTtcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH0pKS5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lLXNpbHZlclwiKVxuICAgIC8vICAgICAuYXR0cihcImRcIiwgbGluZSk7XG4gICAgLy9cbiAgICAvLyAvLyBBdmVyYWdlIHByaWNlcyBwZXIgYWdlOiBodHRwczovL3d3dy5oZWFsdGhwb2NrZXQuY29tL2luZGl2aWR1YWwtaGVhbHRoLWluc3VyYW5jZS9zaWx2ZXItaGVhbHRoLXBsYW5zI3ByZW1pdW1zXG4gICAgLy8gdmFyIHNpbHZlckRlZHVjdGlibGUgPSA1NzMxLzEyO1xuICAgIC8vIHN2Zy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLy8gICAgIC5kYXR1bShkMy5yYW5nZSgxNTAwMCwzMDAwMDAsMjAwMCkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAvLyAgICAgICBpZiAoYWdlIDwgNDApIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBbZCwgMjU3LjY4ICsgc2lsdmVyRGVkdWN0aWJsZV07XG4gICAgLy8gICAgICAgfSBlbHNlIGlmIChhZ2UgPj0gNDAgJiYgYWdlIDwgNTApIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBbZCwgNDA1LjI4XHQgKyBzaWx2ZXJEZWR1Y3RpYmxlXTtcbiAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgcmV0dXJuIFtkLCA2MTUuMTUgKyBzaWx2ZXJEZWR1Y3RpYmxlXTtcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH0pKS5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lLWJyb256ZVwiKVxuICAgIC8vICAgICAuYXR0cihcImRcIiwgbGluZSk7XG4gIH1cblxuXG4gIGhpZ2hsaWdodChvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gIH1cbn1cbiIsIi8vIGNsYXNzIFN0YWdlIHtcbi8vICAgY29uc3RydWN0b3IoKSB7XG4vLyAgICAgdGhpcy5yZW5kZXIoKTtcbi8vICAgfVxuLy9cbi8vICAgcmVuZGVyKCkge1xuLy8gICAgIGNvbnNvbGUubG9nKFwiWFhYXCIpO1xuLy9cbi8vICAgICB2YXIgczIgPSBkMy5zY2FsZS5sb2coKS5kb21haW4oWzEsMTAwXSkucmFuZ2UoWzEsMjBdKTtcbi8vICAgICB2YXIgcyA9IGQzLnNjYWxlLmxvZygpLmRvbWFpbihbMSwxMDBdKS5yYW5nZShbMSwzMDAwMDBdKTtcbi8vICAgICB2YXIgeFRpY2tzID0gW107XG4vLyAgICAgdmFyIHlWYWx1ZXMgPSBbXTtcbi8vXG4vLyAgICAgdmFyIGN1cnIgPSAtMTtcbi8vICAgICB4VGlja3MucHVzaCgyMDAwMCk7XG4vLyAgICAgeVZhbHVlcy5wdXNoKDApO1xuLy9cbi8vICAgICBmb3IgKHZhciB4PTI7IHg8PTUwOyB4KyspIHtcbi8vICAgICAgIHZhciB4VmFsID0gcyh4KTtcbi8vXG4vLyAgICAgICBpZiAoY3VyciAhPSBNYXRoLmZsb29yKHMyKHgpKSkge1xuLy8gICAgICAgICBjdXJyID0gTWF0aC5mbG9vcihzMih4KSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBjb250aW51ZTtcbi8vICAgICAgIH1cbi8vICAgICAgIGNvbnNvbGUubG9nKFwiTE9HXCIsIE1hdGguZmxvb3IoczIoeCkpKTtcbi8vXG4vLyAgICAgICB4VGlja3MucHVzaChNYXRoLmZsb29yKHMoeCkvMTAwKSAqIDEwMCk7XG4vLyAgICAgICBjb25zb2xlLmxvZyhcIlB1c2hpbmdcIiwgTWF0aC5mbG9vcihzKHgpLzEwMCkgKiAxMDApXG4vLyAgICAgICBpZiAoeFZhbCA8IDI1MDAwKSB7XG4vLyAgICAgICAgIHlWYWx1ZXMucHVzaCgwKVxuLy8gICAgICAgfSBlbHNlIGlmICh4VmFsID4gMjUwMDAgJiYgeFZhbCA8PSA1MDAwMCkge1xuLy8gICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4wOSAvIDEyKSk7XG4vLyAgICAgICB9IGVsc2UgaWYgKHhWYWwgPiA1MDAwMCAmJiB4VmFsIDw9IDc1MDAwKSB7XG4vLyAgICAgICAgIHlWYWx1ZXMucHVzaChNYXRoLmZsb29yKHhWYWwgKiAwLjExIC8gMTIpKTtcbi8vICAgICAgIH0gZWxzZSBpZiAoeFZhbCA+IDc1MDAwICYmIHhWYWwgPD0gMTAwMDAwKSB7XG4vLyAgICAgICAgIHlWYWx1ZXMucHVzaChNYXRoLmZsb29yKHhWYWwgKiAwLjEyIC8gMTIpKTtcbi8vICAgICAgIH0gZWxzZSBpZiAoeFZhbCA+IDEwMDAwMCAmJiB4VmFsIDw9IDMwMDAwMCkge1xuLy8gICAgICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcih4VmFsICogMC4xNCAvIDEyKSk7XG4vLyAgICAgICB9IGVsc2UgaWYgKHhWYWwgPiAzMDAwMDAgKSB7XG4vLyAgICAgICAgIHlWYWx1ZXMucHVzaChNYXRoLmZsb29yKHhWYWwgKiAwLjE2IC8gMTIpKTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgeFRpY2tzLnB1c2goMzAwMDAwKTtcbi8vICAgICB5VmFsdWVzLnB1c2goTWF0aC5mbG9vcigzMDAwMDAgKiAwLjE2IC8gMTIpKVxuLy9cbi8vICAgICAvLyBjb25zb2xlLmxvZyh4VGlja3MpO1xuLy8gICAgIC8vIHZhciBkYXRhX3Rlc3Rfb3JpZ2luYWwgPSBbJ2RhdGExJ10uY29uY2F0KHlWYWx1ZXMpO1xuLy8gICAgIC8vXG4vLyAgICAgLy8gY29uc29sZS5sb2coXCJYWFwiLCBkYXRhX3Rlc3Rfb3JpZ2luYWwpO1xuLy8gICAgIC8vIHZhciBjaGFydF90ZXN0ID0gYzMuZ2VuZXJhdGUoe1xuLy8gICAgIC8vICAgICBiaW5kdG86ICcjc3RhZ2UnLFxuLy8gICAgIC8vICAgICBkYXRhOiB7XG4vLyAgICAgLy8gICAgICAgeDogJ3gnLFxuLy8gICAgIC8vICAgICAgIGNvbHVtbnM6IFtcbi8vICAgICAvLyAgICAgICAgIFsneCddLmNvbmNhdCh4VGlja3MpLFxuLy8gICAgIC8vICAgICAgICAgZGF0YV90ZXN0X29yaWdpbmFsXG4vLyAgICAgLy8gICAgICAgXVxuLy8gICAgIC8vICAgICB9LFxuLy8gICAgIC8vXG4vLyAgICAgLy8gICAgIGF4aXMgOiB7XG4vLyAgICAgLy8gICAgICAgICB4IDoge1xuLy8gICAgIC8vICAgICAgICAgICAgIHRpY2s6IHtcbi8vICAgICAvLyAgICAgICAgICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uIChkLCBpZCkgeyByZXR1cm4gTWF0aC5mbG9vcihkLzEwMCkgKiAxMDA7ICB9XG4vLyAgICAgLy8gICAgICAgICAgICAgfVxuLy8gICAgIC8vICAgICAgICAgfVxuLy8gICAgIC8vICAgICB9LFxuLy8gICAgIC8vIH0pO1xuLy9cbi8vICAgICBjb25zb2xlLmxvZyhcIlhYWFwiKTtcbi8vICAgICB2YXIgZGF0YV90ZXN0ID0gWydkYXRhMSddO1xuLy8gICAgIGNvbnNvbGUubG9nKHhUaWNrcyk7XG4vLyAgICAgdmFyIGRhdGEgPSBbXVxuLy8gICAgIGZvcih2YXIgaT0wOyBpPHhUaWNrcy5sZW5ndGg7IGkrKyl7XG4vLyAgICAgICBjb25zb2xlLmxvZyh4VGlja3NbaV0pO1xuLy8gICAgICAgICBkYXRhW2ldID0gTWF0aC5sb2coeFRpY2tzW2ldKSAvIE1hdGguTE4xMDtcbi8vICAgICB9XG4vLyAgICAgY29uc29sZS5sb2coZGF0YV90ZXN0KTtcbi8vXG4vLyAgICAgdmFyIGNoYXJ0X3Rlc3QgPSBjMy5nZW5lcmF0ZSh7XG4vLyAgICAgICAgIGJpbmR0bzogJyNzdGFnZScsXG4vLyAgICAgICAgIGRhdGE6IHtcbi8vICAgICAgICAgICB4OiAnZGF0YTEnLFxuLy8gICAgICAgICAgIGNvbHVtbnM6IFtcbi8vICAgICAgICAgICAgIGRhdGFfdGVzdC5jb25jYXQoZGF0YSksXG4vLyAgICAgICAgICAgICBbJ3ByZW1pdW0nXS5jb25jYXQoeVZhbHVlcylcbi8vICAgICAgICAgICBdXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIGF4aXMgOiB7XG4vLyAgICAgICAgICAgICB4IDoge1xuLy8gICAgICAgICAgICAgICAgIHRpY2s6IHtcbi8vICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uIChkKSB7IHJldHVybiBNYXRoLnBvdygxMCxkKS50b0ZpeGVkKDIpOyB9XG4vLyAgICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIHk6IHtcbi8vICAgICAgICAgICAgICAgc2hvdzpmYWxzZSxcbi8vICAgICAgICAgICAgICAgbWF4OiAyNTAwXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIGxlZ2VuZDoge1xuLy8gICAgICAgICAgICAgc2hvdzogZmFsc2Vcbi8vICAgICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICB9XG4vL1xuLy8gICBoaWdobGlnaHQob3B0aW9ucykge1xuLy8gICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuLy8gICB9XG4vLyB9XG4iLCJjbGFzcyBBcHAge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMuX2xpc3RlblRvV2luZG93KCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy9Mb2FkaW5nIGRhdGEuLi5cbiAgICB0aGlzLkFubnVhbFNhbGFyeUNvbnRyb2wgPSBuZXcgQW5udWFsU2FsYXJ5Q29udHJvbCgpO1xuICAgIHRoaXMuUHJlbWl1bXNDb250cm9sID0gbmV3IFByZW1pdW1zQ29udHJvbCgpO1xuICAgIHRoaXMuU3RhZ2UgPSBuZXcgU3RhZ2UoKTtcbiAgfVxuXG4gIF9saXN0ZW5Ub1dpbmRvdygpIHtcblxuICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsICgpPT57XG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggJiYgd2luZG93LmxvY2F0aW9uLmhhc2gubGVuZ3RoID4gMClcbiAgICAgIHtcbiAgICAgICAgY29uc3QgaGFzaCA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuICAgICAgICB0aGlzLlN0YWdlLmhpZ2hsaWdodChoYXNoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKHdpbmRvdykudHJpZ2dlcihcImhhc2hjaGFuZ2VcIik7XG4gIH1cbn1cblxud2luZG93LkFwcE1hbmFnZXIgPSBuZXcgQXBwKHt9KTtcbiJdfQ==
