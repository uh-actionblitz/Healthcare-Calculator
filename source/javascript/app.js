const INCOME = 60000,
      DEDUCTIBLE = 3000,
      PREMIUM = 400,
      EMPLOYED = true;
$(()=>{


  const computeContribution = (d) => {
    if (d < 25000) {
      return 0;
    } else if (d >=25000 && d < 50000){
      return (d - 25000) * 0.09 / 12;
    } else if (d >= 50000 && d < 75000 ) {
      return (d-25000) * 0.11 / 12;
    } else if ( d >= 75000 && d < 100000) {
      return (d - 25000) * 0.12 / 12;
    } else if ( d >= 100000 && d < 200000 ) {
      return (d - 25000) * 0.14 / 12;
    } else {
      return (d - 25000) * 0.16 / 12;
    }
  }

  const computeEmployerContrib = (d) => {
    return computeContribution(d) * 0.8;
  }
  //1. Show a bar chart

  //2. Bar chart should have a guide at the top of it

  //3. Have a draggable slider


  var svg = d3.select("svg#chart"),
      margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      barWidth = 18,
      barGap = 2;

  console.log(svg.attr("width"));
  // SCALES
  var incomeScale = d3.scaleLog()
                    .domain([Math.pow(10,4), 5 * Math.pow(10,5)])
                    .range([0, width]);
  var contribScale = d3.scaleLinear()
                        .domain([0, 6000])
                        .range([height, 0]);

  // AXIS
  var payPoints = [10000, 25000, 50000, 60000, 75000, 100000, 200000, 500000];
  var xAxis = d3.axisBottom(incomeScale)
                .tickValues(payPoints)
                .tickFormat((d)=>d3.format("$.1s")(d));

  var yAxis = d3.axisRight(contribScale)
                .tickFormat((d)=>d3.format("$.2s")(d))

  // BARS
  var barCount = width/(barWidth + barGap);
  var dataPoints = [];

  //Get data points
  while (dataPoints.length * (barWidth + barGap) < width) {
    var value = incomeScale.invert(dataPoints.length * (barWidth + barGap));
    dataPoints.push(parseInt(value));
  }

  // console.log("FINAL", dataPoints);

  svg.append("g")
      .attr("class","y--axis y--axis--monthly")
      .attr("transform", `translate(${width + margin.left}, ${margin.top})`)
      .call(yAxis);

  svg.append("g")
      .attr("class","x--axis x--axis--income")
      .attr("transform", `translate(${margin.left/2},${height + margin.top})`)
      .call(xAxis);

  var bars = svg.append("g")
                .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")");;

  console.log(dataPoints.map(computeContribution));

  var bars = bars.selectAll(".bar")
      .data(dataPoints)
      .enter()
        .append("g")
          .attr("class", "bar")
          .attr("data-y", (d)=> contribScale(computeContribution(d)))
          .attr("data-val", (d)=>d);

      bars.append("rect")
        .attr("class", "contribution")
        .attr("x", (d, ind) => ind * (barWidth + barGap))
        .attr("y", (d) => {
          return contribScale(computeContribution(d));
        })
        .attr("width", barWidth)
        .attr("height", (d) => height - contribScale(computeContribution(d) - computeEmployerContrib(d)))

      bars.append("rect")
        .attr("class", "employer")
        .attr("x", (d, ind) => ind * (barWidth + barGap))
        .attr("y", (d) => {
          return contribScale(computeEmployerContrib(d));
        })
        .attr("width", barWidth)
        .attr("height", (d) => height - contribScale(computeEmployerContrib(d)))
  // console.log(incomeScale);
});
