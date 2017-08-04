class Stage {
  constructor() {
    this.render();
  }

  render() {

    var annualSalary = [];
    var margin = {top: 40.5, right: 40.5, bottom: 50.5, left: 60.5};

    var width = $("#stage").width();
    var height = $("#stage").height();
    var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    var formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }).join(""); };

    var x = d3.scale.log()
              .domain([15000,300000])
              .range([0, width]);

    var y = d3.scale.linear()
              .domain([0,4000])
              .range([height,0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d) { return d; } );

    var line = d3.svg.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

    var svg = d3.select("#stage").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right");


    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height + 10) + ")")
        .call(xAxis);
    const data = d3.range(15000,300000,2000).map(function(d) {
        var premium = 0;

        if (d < 25000) {
          return [d, 0];
        } else if (d >=25000 && d < 50000){
          return [d, (d - 25000) * 0.09 / 12];
        } else if (d >= 50000 && d < 75000 ) {
          return [d, (d-25000) * 0.11 / 12];
        } else if ( d >= 75000 && d < 100000) {
          return [d, (d - 25000) * 0.12 / 12];
        } else if ( d >= 100000 && d < 200000 ) {
          return [d, (d - 25000) * 0.14 / 12];
        } else {
          return [d, (d - 25000) * 0.16 / 12];
        }

    });
    console.log(data);
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var age = 28;

    // Average prices per age: https://www.healthpocket.com/individual-health-insurance/gold-health-plans#premiums
    var goldDeductible = 1165/12;
    svg.append("path")
        .datum(d3.range(15000,300000,2000).map(function(d) {
          if (age < 40) {
            return [d, 380.98 + goldDeductible];
          } else if (age >= 40 && age < 50) {
            return [d, 599.16 + goldDeductible];
          } else {
            return [d, 909.22 + goldDeductible];
          }
        })).attr("class", "line-gold")
        .attr("d", line);


    // Average prices per age: https://www.healthpocket.com/individual-health-insurance/silver-health-plans#premiums
    var silverDeductible = 3177/12;
    svg.append("path")
        .datum(d3.range(15000,300000,2000).map(function(d) {
          if (age < 40) {
            return [d, 351.02 + silverDeductible];
          } else if (age >= 40 && age < 50) {
            return [d, 490.75 + silverDeductible];
          } else {
            return [d, 744.99 + silverDeductible];
          }
        })).attr("class", "line-silver")
        .attr("d", line);

    // Average prices per age: https://www.healthpocket.com/individual-health-insurance/silver-health-plans#premiums
    var silverDeductible = 5731/12;
    svg.append("path")
        .datum(d3.range(15000,300000,2000).map(function(d) {
          if (age < 40) {
            return [d, 257.68 + silverDeductible];
          } else if (age >= 40 && age < 50) {
            return [d, 405.28	 + silverDeductible];
          } else {
            return [d, 615.15 + silverDeductible];
          }
        })).attr("class", "line-bronze")
        .attr("d", line);
  }


  highlight(options) {
    console.log(options);
  }
}
