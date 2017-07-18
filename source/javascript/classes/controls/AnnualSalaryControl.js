class AnnualSalaryControl {

  constructor() {
    this.target = d3.select('#annual-salary-slider');
    this.control = new CentralController();
    this.render();
  }

  render() {
    const that = this;
    var x = d3.scale.log();
    var commasFormatter = d3.format(",.0f")
    this.target.call(
      d3.slider()
        .axis(d3.svg.axis().tickValues([1, 3, 5, 7, 10]).tickFormat((d) => "$" + commasFormatter(d/10 * 300)+"k"))
        .scale(x)
        .on("slide", (evt, value)=>{
          that.control.update({ salary: parseInt(value/10 * 300000) });
        })
    );
  }
}
