class PremiumsControl {

  constructor() {
    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.render();
  }

  render() {
    const that = this;
    var x = d3.scale.log();
    this.target.call(
      d3.slider()
        .min(0).max(5000)
        .on("slide", (evt, value)=>{
          that.control.update({ premium: value });
        })
        .orientation("vertical")
    );
  }
}
