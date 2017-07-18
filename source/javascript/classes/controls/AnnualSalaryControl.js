class AnnualSalaryControl {

  constructor() {
    const MEDIAN_INCOME = 60850;
    this.target = d3.select('#annual-salary');
    this.control = new CentralController();
    this.timeout = null;
    this.value = MEDIAN_INCOME;
    this.render();

    var commasFormatter = d3.format(",.0f")
    $("#annual-salary .d3-slider-handle").append(`<span id='chosen-salary'>$${commasFormatter(this.value)}</span>`)
  }

  render() {

    const that = this;
    var x = d3.scale.log();
    var commasFormatter = d3.format(",.0f")
    this.target.call(
      d3.slider()
        .axis(d3.svg.axis().tickValues([1, 3, 5, 7, 10]).tickFormat((d) => "$" + commasFormatter(d/10 * 200)+"k"))
        .scale(x)
        .value((that.value/200000)  * 10)
        .on("slide", (evt, value)=>{
          clearTimeout(this.timeout);
          that.value = parseInt(value/10 * 200000);
          that.timeout = setTimeout(() => {
            that.control.update({ salary: that.value });
          }, 300);
          $("#chosen-salary").text("$" + commasFormatter(that.value));
        })
    );
  }
}
