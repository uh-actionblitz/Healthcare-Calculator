const INCOME = 60000,
      DEDUCTIBLE = 5000,
      PREMIUM = 600,
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
                    .domain([Math.pow(10,4), 6 * Math.pow(10,5)])
                    .range([0, width]);
  var contribScale = d3.scaleLinear()
                        .domain([0, 7000])
                        .range([height, 0]);

  // AXIS
  var payPoints = [10000, 25000, 50000, 60000, 75000, 100000, 200000, 300000, 600000];
  var xAxis = d3.axisBottom(incomeScale)
                .tickValues(payPoints)
                .tickFormat((d)=>d3.format("$.1s")(d));


  // BARS
  var barCount = width/(barWidth + barGap);
  var dataPoints = [];

  const currentMonthly = contribScale((DEDUCTIBLE/12) + PREMIUM);

  //Get data points
  while (dataPoints.length * (barWidth + barGap) < width) {
    var value = incomeScale.invert(dataPoints.length * (barWidth + barGap));
    dataPoints.push(parseInt(value));
  }


  var yAxis = d3.axisRight(contribScale)
                .tickFormat((d)=>d3.format("$.2s")(d));

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

  // Build the bars
  var barsItem = bars.selectAll(".bar")
      .data(dataPoints)
      .enter()
        .append("g")
          .attr("class", "bar")
          .attr("data-y", (d)=> contribScale(computeContribution(d)))
          .attr("data-val", (d)=>d);

      barsItem.append("rect")
        .attr("class", "contribution")
        .attr("x", (d, ind) => ind * (barWidth + barGap))
        .attr("y", (d) => {
          return contribScale(computeContribution(d));
        })
        .attr("width", barWidth)
        .attr("height", (d) => height - contribScale(computeContribution(d) - computeEmployerContrib(d)))

      barsItem.append("rect")
        .attr("class", "employer")
        .attr("x", (d, ind) => ind * (barWidth + barGap))
        .attr("y", (d) => {
          return contribScale(computeEmployerContrib(d));
        })
        .attr("width", barWidth)
        .attr("height", (d) => height - contribScale(computeEmployerContrib(d)))
  // console.log(incomeScale);

  var container =
    svg
      .append("g")
      .attr("class", "horizontal--slider")
      .attr("transform", `translate(${margin.left/2}, ${height + margin.top})`);

  container.call(calculatorSlider({
    scale: incomeScale,
    callback: (value) => {
      console.log("test", Math.floor(incomeScale(value)/(barWidth+barGap)) ) ;
      var selectedItem = Math.floor(incomeScale(value)/(barWidth+barGap));
      barsItem.attr("selected", (d, ind) => selectedItem === ind);
    }
  }))

  // Build the line
  console.log((DEDUCTIBLE/12) + PREMIUM, contribScale((DEDUCTIBLE/12) + PREMIUM));

  svg.append("g")
        .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")")
        .append("rect")
        .attr("class", "current-expense")
        .attr("x", 0)
        .attr("width", width)
        .attr("height", 1)
        .attr("y", currentMonthly)
});
