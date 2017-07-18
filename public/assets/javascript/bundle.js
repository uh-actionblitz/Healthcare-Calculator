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
      })).scale(x).value(that.value / 200000 * 10).on("slide", function (evt, value) {
        clearTimeout(_this.timeout);
        that.value = parseInt(value / 10 * 200000);
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

var Stage = function () {
  function Stage() {
    _classCallCheck(this, Stage);

    this.render();
  }

  _createClass(Stage, [{
    key: "render",
    value: function render() {
      console.log("XXX");

      var s = d3.scale.log().domain([1, 50]).range([1, 200000]);
      var xTicks = [];
      var yValues = [];

      xTicks.push(20000);
      yValues.push(0);

      for (var x = 2; x <= 50; x++) {
        var xVal = s(x);

        xTicks.push(Math.floor(s(x) / 100) * 100);
        console.log("Pushing", Math.floor(s(x) / 100) * 100);
        if (xVal < 40000) {
          yValues.push(0);
        } else if (xVal > 40000 && xVal <= 60000) {
          yValues.push(Math.floor(xVal * 0.04 / 12));
        } else if (xVal > 60000 && xVal <= 80000) {
          yValues.push(Math.floor(xVal * 0.06 / 12));
        } else if (xVal > 80000 && xVal <= 100000) {
          yValues.push(Math.floor(xVal * 0.08 / 12));
        } else if (xVal > 100000 && xVal <= 120000) {
          yValues.push(Math.floor(xVal * 0.12 / 12));
        } else if (xVal > 120000) {
          yValues.push(Math.floor(xVal * 0.16 / 12));
        }
      }

      // console.log(xTicks);
      // var data_test_original = ['data1'].concat(yValues);
      //
      // console.log("XX", data_test_original);
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

      console.log("XXX");
      var data_test = ['data1'];
      console.log(xTicks);
      var data = [];
      for (var i = 0; i < xTicks.length; i++) {
        console.log(xTicks[i]);
        data[i] = Math.log(xTicks[i]) / Math.LN10;
      }
      console.log(data_test);

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
      console.log(options);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvY29udHJvbHMvQW5udWFsU2FsYXJ5Q29udHJvbC5qcyIsImNsYXNzZXMvY29udHJvbHMvQ2VudHJhbENvbnRyb2xsZXIuanMiLCJjbGFzc2VzL2NvbnRyb2xzL1ByZW1pdW1zQ29udHJvbC5qcyIsImNsYXNzZXMvU3RhZ2UuanMiLCJhcHAuanMiXSwibmFtZXMiOlsiQW5udWFsU2FsYXJ5Q29udHJvbCIsIk1FRElBTl9JTkNPTUUiLCJ0YXJnZXQiLCJkMyIsInNlbGVjdCIsImNvbnRyb2wiLCJDZW50cmFsQ29udHJvbGxlciIsInRpbWVvdXQiLCJ2YWx1ZSIsInJlbmRlciIsImNvbW1hc0Zvcm1hdHRlciIsImZvcm1hdCIsIiQiLCJhcHBlbmQiLCJ0aGF0IiwieCIsInNjYWxlIiwibG9nIiwiY2FsbCIsInNsaWRlciIsImF4aXMiLCJzdmciLCJ0aWNrVmFsdWVzIiwidGlja0Zvcm1hdCIsImQiLCJvbiIsImV2dCIsImNsZWFyVGltZW91dCIsInBhcnNlSW50Iiwic2V0VGltZW91dCIsInVwZGF0ZSIsInNhbGFyeSIsInRleHQiLCJvcHRpb25zIiwiY29uc29sZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsImxlbmd0aCIsImRlcGFyYW0iLCJzdWJzdHJpbmciLCJwYXJhbSIsIk9iamVjdCIsImFzc2lnbiIsIlByZW1pdW1zQ29udHJvbCIsImxpbmVhciIsImludmVydCIsIm1pbiIsIm1heCIsIm9yaWVudCIsInByZW1pdW0iLCJNYXRoIiwiZmxvb3IiLCJvcmllbnRhdGlvbiIsIlN0YWdlIiwicyIsImRvbWFpbiIsInJhbmdlIiwieFRpY2tzIiwieVZhbHVlcyIsInB1c2giLCJ4VmFsIiwiZGF0YV90ZXN0IiwiZGF0YSIsImkiLCJMTjEwIiwiY2hhcnRfdGVzdCIsImMzIiwiZ2VuZXJhdGUiLCJiaW5kdG8iLCJjb2x1bW5zIiwiY29uY2F0IiwidGljayIsInBvdyIsInRvRml4ZWQiLCJzaG93IiwieSIsImxlZ2VuZCIsIkFwcCIsIl9s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IiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFubnVhbFNhbGFyeUNvbnRyb2wge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IE1FRElBTl9JTkNPTUUgPSA2MDg1MDtcbiAgICB0aGlzLnRhcmdldCA9IGQzLnNlbGVjdCgnI2FubnVhbC1zYWxhcnknKTtcbiAgICB0aGlzLmNvbnRyb2wgPSBuZXcgQ2VudHJhbENvbnRyb2xsZXIoKTtcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMudmFsdWUgPSBNRURJQU5fSU5DT01FO1xuICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICB2YXIgY29tbWFzRm9ybWF0dGVyID0gZDMuZm9ybWF0KFwiLC4wZlwiKVxuICAgICQoXCIjYW5udWFsLXNhbGFyeSAuZDMtc2xpZGVyLWhhbmRsZVwiKS5hcHBlbmQoYDxzcGFuIGlkPSdjaG9zZW4tc2FsYXJ5Jz4kJHtjb21tYXNGb3JtYXR0ZXIodGhpcy52YWx1ZSl9PC9zcGFuPmApXG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxvZygpO1xuICAgIHZhciBjb21tYXNGb3JtYXR0ZXIgPSBkMy5mb3JtYXQoXCIsLjBmXCIpXG4gICAgdGhpcy50YXJnZXQuY2FsbChcbiAgICAgIGQzLnNsaWRlcigpXG4gICAgICAgIC5heGlzKGQzLnN2Zy5heGlzKCkudGlja1ZhbHVlcyhbMSwgMywgNSwgNywgMTBdKS50aWNrRm9ybWF0KChkKSA9PiBcIiRcIiArIGNvbW1hc0Zvcm1hdHRlcihkLzEwICogMjAwKStcImtcIikpXG4gICAgICAgIC5zY2FsZSh4KVxuICAgICAgICAudmFsdWUoKHRoYXQudmFsdWUvMjAwMDAwKSAgKiAxMClcbiAgICAgICAgLm9uKFwic2xpZGVcIiwgKGV2dCwgdmFsdWUpPT57XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgICAgdGhhdC52YWx1ZSA9IHBhcnNlSW50KHZhbHVlLzEwICogMjAwMDAwKTtcbiAgICAgICAgICB0aGF0LnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuY29udHJvbC51cGRhdGUoeyBzYWxhcnk6IHRoYXQudmFsdWUgfSk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAkKFwiI2Nob3Nlbi1zYWxhcnlcIikudGV4dChcIiRcIiArIGNvbW1hc0Zvcm1hdHRlcih0aGF0LnZhbHVlKSk7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIiwiY2xhc3MgQ2VudHJhbENvbnRyb2xsZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICAgIGlmIChcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaC5sZW5ndGggPiAwXG4gICAgKSB7XG4gICAgICB2YXIgaGFzaCA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkLnBhcmFtKE9iamVjdC5hc3NpZ24oaGFzaCwgb3B0aW9ucykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJC5wYXJhbShvcHRpb25zKTtcbiAgICB9XG4gIH1cblxufVxuIiwiY2xhc3MgUHJlbWl1bXNDb250cm9sIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRhcmdldCA9IGQzLnNlbGVjdCgnI3ByZW1pdW1zJyk7XG4gICAgdGhpcy5jb250cm9sID0gbmV3IENlbnRyYWxDb250cm9sbGVyKCk7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciB4ID0gZDMuc2NhbGUubGluZWFyKCkuaW52ZXJ0KCk7XG4gICAgdGhpcy50YXJnZXQuY2FsbChcbiAgICAgIGQzLnNsaWRlcigpXG4gICAgICAgIC5taW4oMTAwMCkubWF4KDApXG4gICAgICAgIC5heGlzKGQzLnN2Zy5heGlzKCkudGlja0Zvcm1hdCgoZCkgPT4gYCQke2R9YCkub3JpZW50KCdyaWdodCcpIClcbiAgICAgICAgLm9uKFwic2xpZGVcIiwgKGV2dCwgdmFsdWUpPT57XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGF0LmNvbnRyb2wudXBkYXRlKHsgcHJlbWl1bTogTWF0aC5mbG9vcigxMDAwLXZhbHVlKSB9KTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9KVxuICAgICAgICAub3JpZW50YXRpb24oXCJ2ZXJ0aWNhbFwiKVxuICAgICk7XG4gIH1cbn1cbiIsImNsYXNzIFN0YWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zb2xlLmxvZyhcIlhYWFwiKTtcblxuICAgIHZhciBzID0gZDMuc2NhbGUubG9nKCkuZG9tYWluKFsxLDUwXSkucmFuZ2UoWzEsMjAwMDAwXSk7XG4gICAgdmFyIHhUaWNrcyA9IFtdO1xuICAgIHZhciB5VmFsdWVzID0gW107XG5cbiAgICB4VGlja3MucHVzaCgyMDAwMCk7XG4gICAgeVZhbHVlcy5wdXNoKDApO1xuXG4gICAgZm9yICh2YXIgeD0yOyB4PD01MDsgeCsrKSB7XG4gICAgICB2YXIgeFZhbCA9IHMoeCk7XG5cbiAgICAgIHhUaWNrcy5wdXNoKE1hdGguZmxvb3Iocyh4KS8xMDApICogMTAwKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiUHVzaGluZ1wiLCBNYXRoLmZsb29yKHMoeCkvMTAwKSAqIDEwMClcbiAgICAgIGlmICh4VmFsIDwgNDAwMDApIHtcbiAgICAgICAgeVZhbHVlcy5wdXNoKDApXG4gICAgICB9IGVsc2UgaWYgKHhWYWwgPiA0MDAwMCAmJiB4VmFsIDw9IDYwMDAwKSB7XG4gICAgICAgIHlWYWx1ZXMucHVzaChNYXRoLmZsb29yKHhWYWwgKiAwLjA0IC8gMTIpKTtcbiAgICAgIH0gZWxzZSBpZiAoeFZhbCA+IDYwMDAwICYmIHhWYWwgPD0gODAwMDApIHtcbiAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMDYgLyAxMikpO1xuICAgICAgfSBlbHNlIGlmICh4VmFsID4gODAwMDAgJiYgeFZhbCA8PSAxMDAwMDApIHtcbiAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMDggLyAxMikpO1xuICAgICAgfSBlbHNlIGlmICh4VmFsID4gMTAwMDAwICYmIHhWYWwgPD0gMTIwMDAwKSB7XG4gICAgICAgIHlWYWx1ZXMucHVzaChNYXRoLmZsb29yKHhWYWwgKiAwLjEyIC8gMTIpKTtcbiAgICAgIH0gZWxzZSBpZiAoeFZhbCA+IDEyMDAwMCApIHtcbiAgICAgICAgeVZhbHVlcy5wdXNoKE1hdGguZmxvb3IoeFZhbCAqIDAuMTYgLyAxMikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHhUaWNrcyk7XG4gICAgLy8gdmFyIGRhdGFfdGVzdF9vcmlnaW5hbCA9IFsnZGF0YTEnXS5jb25jYXQoeVZhbHVlcyk7XG4gICAgLy9cbiAgICAvLyBjb25zb2xlLmxvZyhcIlhYXCIsIGRhdGFfdGVzdF9vcmlnaW5hbCk7XG4gICAgLy8gdmFyIGNoYXJ0X3Rlc3QgPSBjMy5nZW5lcmF0ZSh7XG4gICAgLy8gICAgIGJpbmR0bzogJyNzdGFnZScsXG4gICAgLy8gICAgIGRhdGE6IHtcbiAgICAvLyAgICAgICB4OiAneCcsXG4gICAgLy8gICAgICAgY29sdW1uczogW1xuICAgIC8vICAgICAgICAgWyd4J10uY29uY2F0KHhUaWNrcyksXG4gICAgLy8gICAgICAgICBkYXRhX3Rlc3Rfb3JpZ2luYWxcbiAgICAvLyAgICAgICBdXG4gICAgLy8gICAgIH0sXG4gICAgLy9cbiAgICAvLyAgICAgYXhpcyA6IHtcbiAgICAvLyAgICAgICAgIHggOiB7XG4gICAgLy8gICAgICAgICAgICAgdGljazoge1xuICAgIC8vICAgICAgICAgICAgICAgIGZvcm1hdDogZnVuY3Rpb24gKGQsIGlkKSB7IHJldHVybiBNYXRoLmZsb29yKGQvMTAwKSAqIDEwMDsgIH1cbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlhYWFwiKTtcbiAgICB2YXIgZGF0YV90ZXN0ID0gWydkYXRhMSddO1xuICAgIGNvbnNvbGUubG9nKHhUaWNrcyk7XG4gICAgdmFyIGRhdGEgPSBbXVxuICAgIGZvcih2YXIgaT0wOyBpPHhUaWNrcy5sZW5ndGg7IGkrKyl7XG4gICAgICBjb25zb2xlLmxvZyh4VGlja3NbaV0pO1xuICAgICAgICBkYXRhW2ldID0gTWF0aC5sb2coeFRpY2tzW2ldKSAvIE1hdGguTE4xMDtcbiAgICB9XG4gICAgY29uc29sZS5sb2coZGF0YV90ZXN0KTtcblxuICAgIHZhciBjaGFydF90ZXN0ID0gYzMuZ2VuZXJhdGUoe1xuICAgICAgICBiaW5kdG86ICcjc3RhZ2UnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgeDogJ2RhdGExJyxcbiAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICBkYXRhX3Rlc3QuY29uY2F0KGRhdGEpLFxuICAgICAgICAgICAgWydwcmVtaXVtJ10uY29uY2F0KHlWYWx1ZXMpXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBheGlzIDoge1xuICAgICAgICAgICAgeCA6IHtcbiAgICAgICAgICAgICAgICB0aWNrOiB7XG4gICAgICAgICAgICAgICAgICAgZm9ybWF0OiBmdW5jdGlvbiAoZCkgeyByZXR1cm4gTWF0aC5wb3coMTAsZCkudG9GaXhlZCgyKTsgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIHNob3c6ZmFsc2UsXG4gICAgICAgICAgICAgIG1heDogMjUwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGhpZ2hsaWdodChvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gIH1cbn1cbiIsImNsYXNzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5fbGlzdGVuVG9XaW5kb3coKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL0xvYWRpbmcgZGF0YS4uLlxuICAgIHRoaXMuQW5udWFsU2FsYXJ5Q29udHJvbCA9IG5ldyBBbm51YWxTYWxhcnlDb250cm9sKCk7XG4gICAgdGhpcy5QcmVtaXVtc0NvbnRyb2wgPSBuZXcgUHJlbWl1bXNDb250cm9sKCk7XG4gICAgdGhpcy5TdGFnZSA9IG5ldyBTdGFnZSgpO1xuICB9XG5cbiAgX2xpc3RlblRvV2luZG93KCkge1xuXG4gICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgKCk9PntcbiAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCAmJiB3aW5kb3cubG9jYXRpb24uaGFzaC5sZW5ndGggPiAwKVxuICAgICAge1xuICAgICAgICBjb25zdCBoYXNoID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG4gICAgICAgIHRoaXMuU3RhZ2UuaGlnaGxpZ2h0KGhhc2gpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQod2luZG93KS50cmlnZ2VyKFwiaGFzaGNoYW5nZVwiKTtcbiAgfVxufVxuXG53aW5kb3cuQXBwTWFuYWdlciA9IG5ldyBBcHAoe30pO1xuIl19
