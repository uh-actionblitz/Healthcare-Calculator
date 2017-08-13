const INCOME = 60000,
      DEDUCTIBLE = 8000,
      PREMIUM = 600,
      EMPLOYED = true;

const currentMonthly = (DEDUCTIBLE/12) + PREMIUM;
const padding = 5;

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

  const updateContribText = (d) => {
    const totalContribution = computeContribution(d);
    const selfShare = totalContribution * 0.2 , bossShare = totalContribution * 0.8;
    const data = d3.select(".bar[selected=true]").attr("data-val");
    const y = contribScale(computeContribution(data));
    const x = incomeScale(data);



    barValue.attr("transform",`translate(${x - (totalContribution < currentMonthly ? 30 : 0)}, ${y})`);
    var textChild = barValue.select("text");
    var rectChild = barValue.select("rect")
    var bbox = textChild.node().getBBox();


    rectChild.attr("width", bbox.width + padding)
      .attr("height", bbox.height + padding);

    textChild.text(d3.format("$.2s")(parseInt(totalContribution)));

  };

  const updateIncomeLabel = (d, y) => {

    const x = incomeScale(d);


    var textChild = incomeValue.select("text");
    var rectChild = incomeValue.select("rect")
    var bbox = textChild.node().getBBox();

    incomeValue.attr("transform",`translate(${x - bbox.width/4}, ${y + 30})`);
    rectChild.attr("width", bbox.width + padding)
      .attr("height", bbox.height + padding);

    textChild.text(d3.format("$,.4s")(d));

  };
  //1. Show a bar chart

  //2. Bar chart should have a guide at the top of it

  //3. Have a draggable slider


  var svg = d3.select("svg#chart"),
      margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      barWidth = 18,
      barGap = 2;


  // SCALES
  var incomeScale = d3.scaleLog()
                    .domain([Math.pow(10,4), 6 * Math.pow(10,5)])
                    .range([0, width]);
  var contribScale = d3.scaleLinear()
                        .domain([0, 7000])
                        .range([height, 0]);

  // AXIS
  var payPoints = [10000, 30000, 50000, 60000, 80000, 100000, 200000, 300000, 600000];
  var xAxis = d3.axisBottom(incomeScale)
                .tickValues(payPoints)
                .tickFormat((d)=>d3.format("$.1s")(d));


  // BARS
  var barCount = width/(barWidth + barGap);
  var dataPoints = [];


  //Get data points
  while (dataPoints.length * (barWidth + barGap) < width) {
    var value = incomeScale.invert(dataPoints.length * (barWidth + barGap));
    dataPoints.push(parseInt(value));
  }


  var yAxis = d3.axisRight(contribScale)
                .tickFormat((d)=>d3.format("$.2s")(d));

  //

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

  var barValue = svg.append("g").attr("class", "bar--value-container");
      barValue.append("rect").attr("class", "bar-container");
      barValue.append("text").attr("class", "bar--value");

  var incomeValue = svg.append("g").attr("class", "income--value-container");
    incomeValue.append("rect").attr("class", "income--container");
    incomeValue.append("text").attr("class", "income--value");

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

      barsItem.append("rect")
        .attr("class", "savings")
        .attr("x", (d, ind) => ind * (barWidth + barGap))
        .attr("y", (d) => contribScale(currentMonthly))
        .attr("width", barWidth)
        .attr("height", (d) => {
          const savingsHeight =  height - contribScale(currentMonthly - computeContribution(d));
          console.log(savingsHeight);
          if ( savingsHeight < 0) return 0;

          return savingsHeight;
        })
  //

  var container =
    svg
      .append("g")
      .attr("class", "horizontal--slider")
      .attr("transform", `translate(${margin.left/2}, ${height + margin.top})`);

  container.call(calculatorSlider({
    scale: incomeScale,
    initialValue: INCOME,
    callback: (value) => {
      var selectedItem = Math.floor(incomeScale(value)/(barWidth+barGap));
      barsItem.attr("selected", (d, ind) => selectedItem === ind);
      updateContribText(value);
      updateIncomeLabel(value, height);
    }
  }));

  updateContribText(INCOME);
  updateIncomeLabel(INCOME, height);

  svg.append("g")
        .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")")
        .append("rect")
        .attr("class", "current-expense")
        .attr("x", 0)
        .attr("width", width)
        .attr("height", 1)
        .attr("y", contribScale(currentMonthly))
});
