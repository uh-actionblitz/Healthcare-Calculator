class PremiumsControl {

  constructor() {
    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.timeout = null;
    this.render();
  }

  render() {
    const OUT_OF_POCKET = 5500; //per year
    const DEDUCTIBLE = 2000;
    const MONTHLY_PREMIUM = 430;
    const total_cost = MONTHLY_PREMIUM + (OUT_OF_POCKET + DEDUCTIBLE)/12;
    const that = this;
    var x = d3.scale.linear().invert();
    this.target.call(
      d3.slider()
        .value(2700 - total_cost)
        .min(2700).max(0)
        .axis(d3.svg.axis().tickFormat((d) => `$${d}`).orient('right') )
        .on("slide", (evt, value)=>{
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            that.control.update({ premium: Math.floor(2700-value) });
          }, 300);
        })
        .orientation("vertical")
    );
  }
}
