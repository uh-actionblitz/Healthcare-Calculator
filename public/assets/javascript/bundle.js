"use strict";

var INCOME = 60000,
    DEDUCTIBLE = 8000,
    PREMIUM = 600,
    EMPLOYED = true;

var currentMonthly = DEDUCTIBLE / 12 + PREMIUM;
var padding = 5;

$(function () {

  var computeContribution = function computeContribution(d) {
    if (d < 25000) {
      return 0;
    } else if (d >= 25000 && d < 50000) {
      return (d - 25000) * 0.09 / 12;
    } else if (d >= 50000 && d < 75000) {
      return (d - 25000) * 0.11 / 12;
    } else if (d >= 75000 && d < 100000) {
      return (d - 25000) * 0.12 / 12;
    } else if (d >= 100000 && d < 200000) {
      return (d - 25000) * 0.14 / 12;
    } else {
      return (d - 25000) * 0.16 / 12;
    }
  };

  var computeEmployerContrib = function computeEmployerContrib(d) {
    return computeContribution(d) * 0.8;
  };

  var updateContribText = function updateContribText(d) {
    var totalContribution = computeContribution(d);
    var selfShare = totalContribution * 0.2,
        bossShare = totalContribution * 0.8;
    var data = d3.select(".bar[selected=true]").attr("data-val");
    var y = contribScale(computeContribution(data));
    var x = incomeScale(data);

    barValue.attr("transform", "translate(" + (x - (totalContribution < currentMonthly ? 30 : 0)) + ", " + y + ")");
    var textChild = barValue.select("text");
    var rectChild = barValue.select("rect");
    var bbox = textChild.node().getBBox();

    rectChild.attr("width", bbox.width + padding).attr("height", bbox.height + padding);

    textChild.text(d3.format("$.2s")(parseInt(totalContribution)));
  };

  var updateIncomeLabel = function updateIncomeLabel(d, y) {

    var x = incomeScale(d);

    var textChild = incomeValue.select("text");
    var rectChild = incomeValue.select("rect");
    var bbox = textChild.node().getBBox();

    incomeValue.attr("transform", "translate(" + (x - bbox.width / 4) + ", " + (y + 30) + ")");
    rectChild.attr("width", bbox.width + padding).attr("height", bbox.height + padding);

    textChild.text(d3.format("$,.4s")(d));
  };
  //1. Show a bar chart

  //2. Bar chart should have a guide at the top of it

  //3. Have a draggable slider


  var svg = d3.select("svg#chart"),
      margin = { top: 20, right: 40, bottom: 30, left: 20 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      barWidth = 18,
      barGap = 2;

  // SCALES
  var incomeScale = d3.scaleLog().domain([Math.pow(10, 4), 6 * Math.pow(10, 5)]).range([0, width]);

  var contribScale = d3.scaleLinear().domain([0, computeContribution(INCOME) + 1000]).range([height, 0]);

  // AXIS
  var payPoints = [10000, 30000, 50000, 60000, 80000, 100000, 200000, 300000, 600000];
  var xAxis = d3.axisBottom(incomeScale).tickValues(payPoints).tickFormat(function (d) {
    return d3.format("$.1s")(d);
  });

  // BARS
  var barCount = width / (barWidth + barGap);
  var dataPoints = [];

  //Get data points
  while (dataPoints.length * (barWidth + barGap) < width) {
    var value = incomeScale.invert(dataPoints.length * (barWidth + barGap));
    dataPoints.push(parseInt(value));
  }

  var yAxis = d3.axisRight(contribScale).tickFormat(function (d) {
    return d3.format("$.2s")(d);
  });

  //

  svg.append("g").attr("class", "y--axis y--axis--monthly").attr("transform", "translate(" + (width + margin.left) + ", " + margin.top + ")").call(yAxis);

  svg.append("g").attr("class", "x--axis x--axis--income").attr("transform", "translate(" + margin.left / 2 + "," + (height + margin.top) + ")").call(xAxis);

  var bars = svg.append("g").attr("transform", "translate(" + margin.left / 2 + "," + margin.top + ")");;

  var barValue = svg.append("g").attr("class", "bar--value-container");
  barValue.append("rect").attr("class", "bar-container");
  barValue.append("text").attr("class", "bar--value");

  var incomeValue = svg.append("g").attr("class", "income--value-container");
  incomeValue.append("rect").attr("class", "income--container");
  incomeValue.append("text").attr("class", "income--value");

  // Build the bars
  var barsItem = bars.selectAll(".bar").data(dataPoints).enter().append("g").attr("class", "bar").attr("data-y", function (d) {
    return contribScale(computeContribution(d));
  }).attr("data-val", function (d) {
    return d;
  });

  barsItem.append("rect").attr("class", "contribution").attr("x", function (d, ind) {
    return ind * (barWidth + barGap);
  }).attr("y", function (d) {
    return contribScale(computeContribution(d));
  }).attr("width", barWidth).attr("height", function (d) {
    return height - contribScale(computeContribution(d) - computeEmployerContrib(d));
  });

  barsItem.append("rect").attr("class", "employer").attr("x", function (d, ind) {
    return ind * (barWidth + barGap);
  }).attr("y", function (d) {
    return contribScale(computeEmployerContrib(d));
  }).attr("width", barWidth).attr("height", function (d) {
    return height - contribScale(computeEmployerContrib(d));
  });

  barsItem.append("rect").attr("class", "savings").attr("x", function (d, ind) {
    return ind * (barWidth + barGap);
  }).attr("y", function (d) {
    return contribScale(currentMonthly);
  }).attr("width", barWidth).attr("height", function (d) {
    var savingsHeight = height - contribScale(currentMonthly - computeContribution(d));

    if (savingsHeight < 0) return 0;

    return savingsHeight;
  });
  //

  var container = svg.append("g").attr("class", "horizontal--slider").attr("transform", "translate(" + margin.left / 2 + ", " + (height + margin.top) + ")");

  container.call(calculatorSlider({
    scale: incomeScale,
    initialValue: INCOME,
    callback: function callback(value) {
      var selectedItem = Math.floor(incomeScale(value) / (barWidth + barGap));
      barsItem.attr("selected", function (d, ind) {
        return selectedItem === ind;
      });
      updateContribText(value);
      updateIncomeLabel(value, height);

      if (currentMonthly < computeContribution(value)) {
        contribScale.domain([0, computeContribution(value) + 1000]);
      } else {
        contribScale.domain([0, currentMonthly + 1000]);
      }

      yAxis = d3.axisRight(contribScale);
      svg.select('.y--axis--monthly').call(yAxis);

      //Update savings Look
      barsItem.select("rect.savings").attr("height", function (d) {
        var savingsHeight = height - contribScale(currentMonthly - computeContribution(d));

        if (savingsHeight < 0) return 0;

        return savingsHeight;
      }).attr("y", function (d) {
        return contribScale(currentMonthly);
      });

      //Update employer cover
      barsItem.select(".employer").attr("y", function (d) {
        return contribScale(computeEmployerContrib(d));
      }).attr("height", function (d) {
        return height - contribScale(computeEmployerContrib(d));
      });

      barsItem.select(".contribution").attr("y", function (d) {
        return contribScale(computeContribution(d));
      }).attr("height", function (d) {
        return height - contribScale(computeContribution(d) - computeEmployerContrib(d));
      });

      svg.select(".current-expense").attr("y", contribScale(currentMonthly));
    }
  }));

  updateContribText(INCOME);
  updateIncomeLabel(INCOME, height);

  svg.append("g").attr("transform", "translate(" + margin.left / 2 + "," + margin.top + ")").append("rect").attr("class", "current-expense").attr("x", 0).attr("width", width).attr("height", 1).attr("y", contribScale(currentMonthly));
});
"use strict";

var calculatorSlider = function calculatorSlider(_ref) {
    var scale = _ref.scale,
        callback = _ref.callback,
        initialValue = _ref.initialValue;
    return function (container) {

        var x = scale.clamp(true);

        x;

        var slider = container.append("g").attr("class", "slider");

        slider.append("line").attr("class", "track").attr("x1", x.range()[0]).attr("x2", x.range()[1]).select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        }).attr("class", "track-inset").select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        }).attr("class", "track-overlay").call(d3.drag().on("start.interrupt", function () {
            slider.interrupt();
        }).on("start drag", function () {
            scale(d3.event.x);
            handle.attr("cx", d3.event.x);
            callback(scale.invert(d3.event.x));
        }));

        // slider.insert("g", ".track-overlay")
        //     .attr("class", "ticks")
        //     .attr("transform", "translate(0," + 18 + ")")
        //   .selectAll("text")
        //   .data(x.ticks(10))
        //   .enter().append("text")
        //     .attr("x", x)
        //     .attr("text-anchor", "middle")
        //     .text(function(d) { return d; });

        var handle = slider.insert("circle", ".track-overlay").attr("class", "handle").attr("r", 9);

        // slider.transition() // Gratuitous intro!
        //     .duration(750)
        //     .tween("hue", function() {
        //       var i = d3.interpolate(0, 70);
        //       return function(t) {
        //         handle.attr("cx", x(t));
        //         callback(i(t));
        //       };
        //     });

        handle.attr("cx", x(initialValue || 60000));
        callback(initialValue || 60000);
    };
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImxpYi9zbGlkZXIuanMiXSwibmFtZXMiOlsiSU5DT01FIiwiREVEVUNUSUJMRSIsIlBSRU1JVU0iLCJFTVBMT1lFRCIsImN1cnJlbnRNb250aGx5IiwicGFkZGluZyIsIiQiLCJjb21wdXRlQ29udHJpYnV0aW9uIiwiZCIsImNvbXB1dGVFbXBsb3llckNvbnRyaWIiLCJ1cGRhdGVDb250cmliVGV4dCIsInRvdGFsQ29udHJpYnV0aW9uIiwic2VsZlNoYXJlIiwiYm9zc1NoYXJlIiwiZGF0YSIsImQzIiwic2VsZWN0IiwiYXR0ciIsInkiLCJjb250cmliU2NhbGUiLCJ4IiwiaW5jb21lU2NhbGUiLCJiYXJWYWx1ZSIsInRleHRDaGlsZCIsInJlY3RDaGlsZCIsImJib3giLCJub2RlIiwiZ2V0QkJveCIsIndpZHRoIiwiaGVpZ2h0IiwidGV4dCIsImZvcm1hdCIsInBhcnNlSW50IiwidXBkYXRlSW5jb21lTGFiZWwiLCJpbmNvbWVWYWx1ZSIsInN2ZyIsIm1hcmdpbiIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsImJhcldpZHRoIiwiYmFyR2FwIiwic2NhbGVMb2ciLCJkb21haW4iLCJNYXRoIiwicG93IiwicmFuZ2UiLCJzY2FsZUxpbmVhciIsInBheVBvaW50cyIsInhBeGlzIiwiYXhpc0JvdHRvbSIsInRpY2tWYWx1ZXMiLCJ0aWNrRm9ybWF0IiwiYmFyQ291bnQiLCJkYXRhUG9pbnRzIiwibGVuZ3RoIiwidmFsdWUiLCJpbnZlcnQiLCJwdXNoIiwieUF4aXMiLCJheGlzUmlnaHQiLCJhcHBlbmQiLCJjYWxsIiwiYmFycyIsImJhcnNJdGVtIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJpbmQiLCJzYXZpbmdzSGVpZ2h0IiwiY29udGFpbmVyIiwiY2FsY3VsYXRvclNsaWRlciIsInNjYWxlIiwiaW5pdGlhbFZhbHVlIiwiY2FsbGJhY2siLCJzZWxlY3RlZEl0ZW0iLCJmbG9vciIsImNsYW1wIiwic2xpZGVyIiwicGFyZW50Tm9kZSIsImFwcGVuZENoaWxkIiwiY2xvbmVOb2RlIiwiZHJhZyIsIm9uIiwiaW50ZXJydXB0IiwiZXZlbnQiLCJoYW5kbGUiLCJpbnNlcnQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsU0FBUyxLQUFmO0FBQUEsSUFDTUMsYUFBYSxJQURuQjtBQUFBLElBRU1DLFVBQVUsR0FGaEI7QUFBQSxJQUdNQyxXQUFXLElBSGpCOztBQUtBLElBQU1DLGlCQUFrQkgsYUFBVyxFQUFaLEdBQWtCQyxPQUF6QztBQUNBLElBQU1HLFVBQVUsQ0FBaEI7O0FBRUFDLEVBQUUsWUFBSTs7QUFHSixNQUFNQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixDQUFDQyxDQUFELEVBQU87QUFDakMsUUFBSUEsSUFBSSxLQUFSLEVBQWU7QUFDYixhQUFPLENBQVA7QUFDRCxLQUZELE1BRU8sSUFBSUEsS0FBSSxLQUFKLElBQWFBLElBQUksS0FBckIsRUFBMkI7QUFDaEMsYUFBTyxDQUFDQSxJQUFJLEtBQUwsSUFBYyxJQUFkLEdBQXFCLEVBQTVCO0FBQ0QsS0FGTSxNQUVBLElBQUlBLEtBQUssS0FBTCxJQUFjQSxJQUFJLEtBQXRCLEVBQThCO0FBQ25DLGFBQU8sQ0FBQ0EsSUFBRSxLQUFILElBQVksSUFBWixHQUFtQixFQUExQjtBQUNELEtBRk0sTUFFQSxJQUFLQSxLQUFLLEtBQUwsSUFBY0EsSUFBSSxNQUF2QixFQUErQjtBQUNwQyxhQUFPLENBQUNBLElBQUksS0FBTCxJQUFjLElBQWQsR0FBcUIsRUFBNUI7QUFDRCxLQUZNLE1BRUEsSUFBS0EsS0FBSyxNQUFMLElBQWVBLElBQUksTUFBeEIsRUFBaUM7QUFDdEMsYUFBTyxDQUFDQSxJQUFJLEtBQUwsSUFBYyxJQUFkLEdBQXFCLEVBQTVCO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsYUFBTyxDQUFDQSxJQUFJLEtBQUwsSUFBYyxJQUFkLEdBQXFCLEVBQTVCO0FBQ0Q7QUFDRixHQWREOztBQWdCQSxNQUFNQyx5QkFBeUIsU0FBekJBLHNCQUF5QixDQUFDRCxDQUFELEVBQU87QUFDcEMsV0FB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RUUsWUFGRixFQUVnQixZQUFXO0FBQzFCWCxrQkFBTXpELEdBQUdzRSxLQUFILENBQVNqRSxDQUFmLENBQUQ7QUFDQWtFLG1CQUFPckUsSUFBUCxDQUFZLElBQVosRUFBa0JGLEdBQUdzRSxLQUFILENBQVNqRSxDQUEzQjtBQUNBc0QscUJBQVNGLE1BQU1kLE1BQU4sQ0FBYTNDLEdBQUdzRSxLQUFILENBQVNqRSxDQUF0QixDQUFUO0FBQ0QsU0FOQyxDQVJWOztBQWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBSWtFLFNBQVNSLE9BQU9TLE1BQVAsQ0FBYyxRQUFkLEVBQXdCLGdCQUF4QixFQUNSdEUsSUFEUSxDQUNILE9BREcsRUFDTSxRQUROLEVBRVJBLElBRlEsQ0FFSCxHQUZHLEVBRUUsQ0FGRixDQUFiOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQXFFLGVBQU9yRSxJQUFQLENBQVksSUFBWixFQUFrQkcsRUFBRXFELGdCQUFnQixLQUFsQixDQUFsQjtBQUNBQyxpQkFBU0QsZ0JBQWdCLEtBQXpCO0FBRUgsS0F4RHdCO0FBQUEsQ0FBekIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSU5DT01FID0gNjAwMDAsXG4gICAgICBERURVQ1RJQkxFID0gODAwMCxcbiAgICAgIFBSRU1JVU0gPSA2MDAsXG4gICAgICBFTVBMT1lFRCA9IHRydWU7XG5cbmNvbnN0IGN1cnJlbnRNb250aGx5ID0gKERFRFVDVElCTEUvMTIpICsgUFJFTUlVTTtcbmNvbnN0IHBhZGRpbmcgPSA1O1xuXG4kKCgpPT57XG5cblxuICBjb25zdCBjb21wdXRlQ29udHJpYnV0aW9uID0gKGQpID0+IHtcbiAgICBpZiAoZCA8IDI1MDAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2UgaWYgKGQgPj0yNTAwMCAmJiBkIDwgNTAwMDApe1xuICAgICAgcmV0dXJuIChkIC0gMjUwMDApICogMC4wOSAvIDEyO1xuICAgIH0gZWxzZSBpZiAoZCA+PSA1MDAwMCAmJiBkIDwgNzUwMDAgKSB7XG4gICAgICByZXR1cm4gKGQtMjUwMDApICogMC4xMSAvIDEyO1xuICAgIH0gZWxzZSBpZiAoIGQgPj0gNzUwMDAgJiYgZCA8IDEwMDAwMCkge1xuICAgICAgcmV0dXJuIChkIC0gMjUwMDApICogMC4xMiAvIDEyO1xuICAgIH0gZWxzZSBpZiAoIGQgPj0gMTAwMDAwICYmIGQgPCAyMDAwMDAgKSB7XG4gICAgICByZXR1cm4gKGQgLSAyNTAwMCkgKiAwLjE0IC8gMTI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoZCAtIDI1MDAwKSAqIDAuMTYgLyAxMjtcbiAgICB9XG4gIH1cblxuICBjb25zdCBjb21wdXRlRW1wbG95ZXJDb250cmliID0gKGQpID0+IHtcbiAgICByZXR1cm4gY29tcHV0ZUNvbnRyaWJ1dGlvbihkKSAqIDAuODtcbiAgfVxuXG4gIGNvbnN0IHVwZGF0ZUNvbnRyaWJUZXh0ID0gKGQpID0+IHtcbiAgICBjb25zdCB0b3RhbENvbnRyaWJ1dGlvbiA9IGNvbXB1dGVDb250cmlidXRpb24oZCk7XG4gICAgY29uc3Qgc2VsZlNoYXJlID0gdG90YWxDb250cmlidXRpb24gKiAwLjIgLCBib3NzU2hhcmUgPSB0b3RhbENvbnRyaWJ1dGlvbiAqIDAuODtcbiAgICBjb25zdCBkYXRhID0gZDMuc2VsZWN0KFwiLmJhcltzZWxlY3RlZD10cnVlXVwiKS5hdHRyKFwiZGF0YS12YWxcIik7XG4gICAgY29uc3QgeSA9IGNvbnRyaWJTY2FsZShjb21wdXRlQ29udHJpYnV0aW9uKGRhdGEpKTtcbiAgICBjb25zdCB4ID0gaW5jb21lU2NhbGUoZGF0YSk7XG5cblxuXG4gICAgYmFyVmFsdWUuYXR0cihcInRyYW5zZm9ybVwiLGB0cmFuc2xhdGUoJHt4IC0gKHRvdGFsQ29udHJpYnV0aW9uIDwgY3VycmVudE1vbnRobHkgPyAzMCA6IDApfSwgJHt5fSlgKTtcbiAgICB2YXIgdGV4dENoaWxkID0gYmFyVmFsdWUuc2VsZWN0KFwidGV4dFwiKTtcbiAgICB2YXIgcmVjdENoaWxkID0gYmFyVmFsdWUuc2VsZWN0KFwicmVjdFwiKVxuICAgIHZhciBiYm94ID0gdGV4dENoaWxkLm5vZGUoKS5nZXRCQm94KCk7XG5cblxuICAgIHJlY3RDaGlsZC5hdHRyKFwid2lkdGhcIiwgYmJveC53aWR0aCArIHBhZGRpbmcpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBiYm94LmhlaWdodCArIHBhZGRpbmcpO1xuXG4gICAgdGV4dENoaWxkLnRleHQoZDMuZm9ybWF0KFwiJC4yc1wiKShwYXJzZUludCh0b3RhbENvbnRyaWJ1dGlvbikpKTtcblxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZUluY29tZUxhYmVsID0gKGQsIHkpID0+IHtcblxuICAgIGNvbnN0IHggPSBpbmNvbWVTY2FsZShkKTtcblxuXG4gICAgdmFyIHRleHRDaGlsZCA9IGluY29tZVZhbHVlLnNlbGVjdChcInRleHRcIik7XG4gICAgdmFyIHJlY3RDaGlsZCA9IGluY29tZVZhbHVlLnNlbGVjdChcInJlY3RcIilcbiAgICB2YXIgYmJveCA9IHRleHRDaGlsZC5ub2RlKCkuZ2V0QkJveCgpO1xuXG4gICAgaW5jb21lVmFsdWUuYXR0cihcInRyYW5zZm9ybVwiLGB0cmFuc2xhdGUoJHt4IC0gYmJveC53aWR0aC80fSwgJHt5ICsgMzB9KWApO1xuICAgIHJlY3RDaGlsZC5hdHRyKFwid2lkdGhcIiwgYmJveC53aWR0aCArIHBhZGRpbmcpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBiYm94LmhlaWdodCArIHBhZGRpbmcpO1xuXG4gICAgdGV4dENoaWxkLnRleHQoZDMuZm9ybWF0KFwiJCwuNHNcIikoZCkpO1xuXG4gIH07XG4gIC8vMS4gU2hvdyBhIGJhciBjaGFydFxuXG4gIC8vMi4gQmFyIGNoYXJ0IHNob3VsZCBoYXZlIGEgZ3VpZGUgYXQgdGhlIHRvcCBvZiBpdFxuXG4gIC8vMy4gSGF2ZSBhIGRyYWdnYWJsZSBzbGlkZXJcblxuXG4gIHZhciBzdmcgPSBkMy5zZWxlY3QoXCJzdmcjY2hhcnRcIiksXG4gICAgICBtYXJnaW4gPSB7dG9wOiAyMCwgcmlnaHQ6IDQwLCBib3R0b206IDMwLCBsZWZ0OiAyMH0sXG4gICAgICB3aWR0aCA9ICtzdmcuYXR0cihcIndpZHRoXCIpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG4gICAgICBoZWlnaHQgPSArc3ZnLmF0dHIoXCJoZWlnaHRcIikgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSxcbiAgICAgIGJhcldpZHRoID0gMTgsXG4gICAgICBiYXJHYXAgPSAyO1xuXG5cbiAgLy8gU0NBTEVTXG4gIHZhciBpbmNvbWVTY2FsZSA9IGQzLnNjYWxlTG9nKClcbiAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbTWF0aC5wb3coMTAsNCksIDYgKiBNYXRoLnBvdygxMCw1KV0pXG4gICAgICAgICAgICAgICAgICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICB2YXIgY29udHJpYlNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbMCwgY29tcHV0ZUNvbnRyaWJ1dGlvbihJTkNPTUUpICsgMTAwMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmFuZ2UoW2hlaWdodCwgMF0pO1xuXG4gIC8vIEFYSVNcbiAgdmFyIHBheVBvaW50cyA9IFsxMDAwMCwgMzAwMDAsIDUwMDAwLCA2MDAwMCwgODAwMDAsIDEwMDAwMCwgMjAwMDAwLCAzMDAwMDAsIDYwMDAwMF07XG4gIHZhciB4QXhpcyA9IGQzLmF4aXNCb3R0b20oaW5jb21lU2NhbGUpXG4gICAgICAgICAgICAgICAgLnRpY2tWYWx1ZXMocGF5UG9pbnRzKVxuICAgICAgICAgICAgICAgIC50aWNrRm9ybWF0KChkKT0+ZDMuZm9ybWF0KFwiJC4xc1wiKShkKSk7XG5cblxuICAvLyBCQVJTXG4gIHZhciBiYXJDb3VudCA9IHdpZHRoLyhiYXJXaWR0aCArIGJhckdhcCk7XG4gIHZhciBkYXRhUG9pbnRzID0gW107XG5cblxuICAvL0dldCBkYXRhIHBvaW50c1xuICB3aGlsZSAoZGF0YVBvaW50cy5sZW5ndGggKiAoYmFyV2lkdGggKyBiYXJHYXApIDwgd2lkdGgpIHtcbiAgICB2YXIgdmFsdWUgPSBpbmNvbWVTY2FsZS5pbnZlcnQoZGF0YVBvaW50cy5sZW5ndGggKiAoYmFyV2lkdGggKyBiYXJHYXApKTtcbiAgICBkYXRhUG9pbnRzLnB1c2gocGFyc2VJbnQodmFsdWUpKTtcbiAgfVxuXG5cbiAgdmFyIHlBeGlzID0gZDMuYXhpc1JpZ2h0KGNvbnRyaWJTY2FsZSlcbiAgICAgICAgICAgICAgICAudGlja0Zvcm1hdCgoZCk9PmQzLmZvcm1hdChcIiQuMnNcIikoZCkpO1xuXG4gIC8vXG5cbiAgc3ZnLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIixcInktLWF4aXMgeS0tYXhpcy0tbW9udGhseVwiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3dpZHRoICsgbWFyZ2luLmxlZnR9LCAke21hcmdpbi50b3B9KWApXG4gICAgICAuY2FsbCh5QXhpcyk7XG5cbiAgc3ZnLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIixcIngtLWF4aXMgeC0tYXhpcy0taW5jb21lXCIpXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnQvMn0sJHtoZWlnaHQgKyBtYXJnaW4udG9wfSlgKVxuICAgICAgLmNhbGwoeEF4aXMpO1xuXG4gIHZhciBiYXJzID0gc3ZnLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0LzIgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7O1xuXG4gIHZhciBiYXJWYWx1ZSA9IHN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcImJhci0tdmFsdWUtY29udGFpbmVyXCIpO1xuICAgICAgYmFyVmFsdWUuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFwiY2xhc3NcIiwgXCJiYXItY29udGFpbmVyXCIpO1xuICAgICAgYmFyVmFsdWUuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgXCJiYXItLXZhbHVlXCIpO1xuXG4gIHZhciBpbmNvbWVWYWx1ZSA9IHN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcImluY29tZS0tdmFsdWUtY29udGFpbmVyXCIpO1xuICAgIGluY29tZVZhbHVlLmFwcGVuZChcInJlY3RcIikuYXR0cihcImNsYXNzXCIsIFwiaW5jb21lLS1jb250YWluZXJcIik7XG4gICAgaW5jb21lVmFsdWUuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwiY2xhc3NcIiwgXCJpbmNvbWUtLXZhbHVlXCIpO1xuXG4gIC8vIEJ1aWxkIHRoZSBiYXJzXG4gIHZhciBiYXJzSXRlbSA9IGJhcnMuc2VsZWN0QWxsKFwiLmJhclwiKVxuICAgICAgLmRhdGEoZGF0YVBvaW50cylcbiAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImJhclwiKVxuICAgICAgICAgIC5hdHRyKFwiZGF0YS15XCIsIChkKT0+IGNvbnRyaWJTY2FsZShjb21wdXRlQ29udHJpYnV0aW9uKGQpKSlcbiAgICAgICAgICAuYXR0cihcImRhdGEtdmFsXCIsIChkKT0+ZCk7XG5cbiAgICAgIGJhcnNJdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNvbnRyaWJ1dGlvblwiKVxuICAgICAgICAuYXR0cihcInhcIiwgKGQsIGluZCkgPT4gaW5kICogKGJhcldpZHRoICsgYmFyR2FwKSlcbiAgICAgICAgLmF0dHIoXCJ5XCIsIChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRyaWJTY2FsZShjb21wdXRlQ29udHJpYnV0aW9uKGQpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBiYXJXaWR0aClcbiAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgKGQpID0+IGhlaWdodCAtIGNvbnRyaWJTY2FsZShjb21wdXRlQ29udHJpYnV0aW9uKGQpIC0gY29tcHV0ZUVtcGxveWVyQ29udHJpYihkKSkpXG5cbiAgICAgIGJhcnNJdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImVtcGxveWVyXCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaW5kKSA9PiBpbmQgKiAoYmFyV2lkdGggKyBiYXJHYXApKVxuICAgICAgICAuYXR0cihcInlcIiwgKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gY29udHJpYlNjYWxlKGNvbXB1dGVFbXBsb3llckNvbnRyaWIoZCkpO1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cihcIndpZHRoXCIsIGJhcldpZHRoKVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAoZCkgPT4gaGVpZ2h0IC0gY29udHJpYlNjYWxlKGNvbXB1dGVFbXBsb3llckNvbnRyaWIoZCkpKVxuXG4gICAgICBiYXJzSXRlbS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJzYXZpbmdzXCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCAoZCwgaW5kKSA9PiBpbmQgKiAoYmFyV2lkdGggKyBiYXJHYXApKVxuICAgICAgICAuYXR0cihcInlcIiwgKGQpID0+IGNvbnRyaWJTY2FsZShjdXJyZW50TW9udGhseSkpXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgYmFyV2lkdGgpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIChkKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2F2aW5nc0hlaWdodCA9ICBoZWlnaHQgLSBjb250cmliU2NhbGUoY3VycmVudE1vbnRobHkgLSBjb21wdXRlQ29udHJpYnV0aW9uKGQpKTtcblxuICAgICAgICAgIGlmICggc2F2aW5nc0hlaWdodCA8IDApIHJldHVybiAwO1xuXG4gICAgICAgICAgcmV0dXJuIHNhdmluZ3NIZWlnaHQ7XG4gICAgICAgIH0pXG4gIC8vXG5cbiAgdmFyIGNvbnRhaW5lciA9XG4gICAgc3ZnXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImhvcml6b250YWwtLXNsaWRlclwiKVxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0LzJ9LCAke2hlaWdodCArIG1hcmdpbi50b3B9KWApO1xuXG4gIGNvbnRhaW5lci5jYWxsKGNhbGN1bGF0b3JTbGlkZXIoe1xuICAgIHNjYWxlOiBpbmNvbWVTY2FsZSxcbiAgICBpbml0aWFsVmFsdWU6IElOQ09NRSxcbiAgICBjYWxsYmFjazogKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gTWF0aC5mbG9vcihpbmNvbWVTY2FsZSh2YWx1ZSkvKGJhcldpZHRoK2JhckdhcCkpO1xuICAgICAgYmFyc0l0ZW0uYXR0cihcInNlbGVjdGVkXCIsIChkLCBpbmQpID0+IHNlbGVjdGVkSXRlbSA9PT0gaW5kKTtcbiAgICAgIHVwZGF0ZUNvbnRyaWJUZXh0KHZhbHVlKTtcbiAgICAgIHVwZGF0ZUluY29tZUxhYmVsKHZhbHVlLCBoZWlnaHQpO1xuXG4gICAgICBpZiAoY3VycmVudE1vbnRobHkgPCBjb21wdXRlQ29udHJpYnV0aW9uKHZhbHVlKSkge1xuICAgICAgICBjb250cmliU2NhbGUuZG9tYWluKFswLCBjb21wdXRlQ29udHJpYnV0aW9uKHZhbHVlKSArIDEwMDBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRyaWJTY2FsZS5kb21haW4oWzAsIGN1cnJlbnRNb250aGx5ICsgMTAwMF0pO1xuICAgICAgfVxuXG4gICAgICB5QXhpcyA9IGQzLmF4aXNSaWdodChjb250cmliU2NhbGUpXG4gICAgICBzdmcuc2VsZWN0KCcueS0tYXhpcy0tbW9udGhseScpLmNhbGwoeUF4aXMpO1xuXG4gICAgICAvL1VwZGF0ZSBzYXZpbmdzIExvb2tcbiAgICAgIGJhcnNJdGVtLnNlbGVjdChcInJlY3Quc2F2aW5nc1wiKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmluZ3NIZWlnaHQgPSAgaGVpZ2h0IC0gY29udHJpYlNjYWxlKGN1cnJlbnRNb250aGx5IC0gY29tcHV0ZUNvbnRyaWJ1dGlvbihkKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHNhdmluZ3NIZWlnaHQgPCAwKSByZXR1cm4gMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzYXZpbmdzSGVpZ2h0O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYXR0cihcInlcIiwgKGQpID0+IGNvbnRyaWJTY2FsZShjdXJyZW50TW9udGhseSkpO1xuXG4gICAgICAvL1VwZGF0ZSBlbXBsb3llciBjb3ZlclxuICAgICAgYmFyc0l0ZW0uc2VsZWN0KFwiLmVtcGxveWVyXCIpXG4gICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250cmliU2NhbGUoY29tcHV0ZUVtcGxveWVyQ29udHJpYihkKSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIChkKSA9PiBoZWlnaHQgLSBjb250cmliU2NhbGUoY29tcHV0ZUVtcGxveWVyQ29udHJpYihkKSkpXG5cblxuICAgICAgYmFyc0l0ZW0uc2VsZWN0KFwiLmNvbnRyaWJ1dGlvblwiKVxuICAgICAgICAuYXR0cihcInlcIiwgKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gY29udHJpYlNjYWxlKGNvbXB1dGVDb250cmlidXRpb24oZCkpO1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAoZCkgPT4gaGVpZ2h0IC0gY29udHJpYlNjYWxlKGNvbXB1dGVDb250cmlidXRpb24oZCkgLSBjb21wdXRlRW1wbG95ZXJDb250cmliKGQpKSk7XG5cbiAgICAgIHN2Zy5zZWxlY3QoXCIuY3VycmVudC1leHBlbnNlXCIpLmF0dHIoXCJ5XCIsIGNvbnRyaWJTY2FsZShjdXJyZW50TW9udGhseSkpO1xuXG4gICAgfVxuICB9KSk7XG5cbiAgdXBkYXRlQ29udHJpYlRleHQoSU5DT01FKTtcbiAgdXBkYXRlSW5jb21lTGFiZWwoSU5DT01FLCBoZWlnaHQpO1xuXG4gIHN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQvMiArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKVxuICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiY3VycmVudC1leHBlbnNlXCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCAwKVxuICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAxKVxuICAgICAgICAuYXR0cihcInlcIiwgY29udHJpYlNjYWxlKGN1cnJlbnRNb250aGx5KSlcbn0pO1xuIiwiXG5jb25zdCBjYWxjdWxhdG9yU2xpZGVyID0gKHtcbiAgICBzY2FsZSxcbiAgICBjYWxsYmFjayxcbiAgICBpbml0aWFsVmFsdWUsXG4gIH0pID0+IChjb250YWluZXIpID0+IHtcblxuICAgIHZhciB4ID0gc2NhbGUuY2xhbXAodHJ1ZSk7XG5cbiAgICAoeCk7XG5cbiAgICB2YXIgc2xpZGVyID0gY29udGFpbmVyLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInNsaWRlclwiKSAgO1xuXG4gICAgc2xpZGVyLmFwcGVuZChcImxpbmVcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRyYWNrXCIpXG4gICAgICAgIC5hdHRyKFwieDFcIiwgeC5yYW5nZSgpWzBdKVxuICAgICAgICAuYXR0cihcIngyXCIsIHgucmFuZ2UoKVsxXSlcbiAgICAgIC5zZWxlY3QoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcy5jbG9uZU5vZGUodHJ1ZSkpOyB9KVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidHJhY2staW5zZXRcIilcbiAgICAgIC5zZWxlY3QoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcy5jbG9uZU5vZGUodHJ1ZSkpOyB9KVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidHJhY2stb3ZlcmxheVwiKVxuICAgICAgICAuY2FsbChkMy5kcmFnKClcbiAgICAgICAgICAgIC5vbihcInN0YXJ0LmludGVycnVwdFwiLCBmdW5jdGlvbigpIHsgc2xpZGVyLmludGVycnVwdCgpOyB9KVxuICAgICAgICAgICAgLm9uKFwic3RhcnQgZHJhZ1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgKHNjYWxlKGQzLmV2ZW50LngpKVxuICAgICAgICAgICAgICBoYW5kbGUuYXR0cihcImN4XCIsIGQzLmV2ZW50LngpO1xuICAgICAgICAgICAgICBjYWxsYmFjayhzY2FsZS5pbnZlcnQoZDMuZXZlbnQueCkpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgLy8gc2xpZGVyLmluc2VydChcImdcIiwgXCIudHJhY2stb3ZlcmxheVwiKVxuICAgIC8vICAgICAuYXR0cihcImNsYXNzXCIsIFwidGlja3NcIilcbiAgICAvLyAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIDE4ICsgXCIpXCIpXG4gICAgLy8gICAuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC8vICAgLmRhdGEoeC50aWNrcygxMCkpXG4gICAgLy8gICAuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLy8gICAgIC5hdHRyKFwieFwiLCB4KVxuICAgIC8vICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgLy8gICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xuXG4gICAgdmFyIGhhbmRsZSA9IHNsaWRlci5pbnNlcnQoXCJjaXJjbGVcIiwgXCIudHJhY2stb3ZlcmxheVwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiaGFuZGxlXCIpXG4gICAgICAgIC5hdHRyKFwiclwiLCA5KTtcblxuICAgIC8vIHNsaWRlci50cmFuc2l0aW9uKCkgLy8gR3JhdHVpdG91cyBpbnRybyFcbiAgICAvLyAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAvLyAgICAgLnR3ZWVuKFwiaHVlXCIsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICAgIHZhciBpID0gZDMuaW50ZXJwb2xhdGUoMCwgNzApO1xuICAgIC8vICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgLy8gICAgICAgICBoYW5kbGUuYXR0cihcImN4XCIsIHgodCkpO1xuICAgIC8vICAgICAgICAgY2FsbGJhY2soaSh0KSk7XG4gICAgLy8gICAgICAgfTtcbiAgICAvLyAgICAgfSk7XG5cbiAgICBoYW5kbGUuYXR0cihcImN4XCIsIHgoaW5pdGlhbFZhbHVlIHx8IDYwMDAwKSlcbiAgICBjYWxsYmFjayhpbml0aWFsVmFsdWUgfHwgNjAwMDApXG5cbn07XG4iXX0=
