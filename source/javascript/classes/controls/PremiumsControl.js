class PremiumsControl {

  constructor() {
    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.timeout = null;
    this.render();
  }

  render() {
    const that = this;
    var x = d3.scale.linear().invert();
    this.target.call(
      d3.slider()
        .min(1000).max(0)
        .axis(d3.svg.axis().tickFormat((d) => `$${d}`).orient('right') )
        .on("slide", (evt, value)=>{
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            that.control.update({ premium: Math.floor(1000-value) });
          }, 300);
        })
        .orientation("vertical")
    );
  }
}
