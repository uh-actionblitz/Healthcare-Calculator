const commasFormatter = d3.format(",.0f")

class PremiumsControl {

  constructor() {
    this.target = d3.select('#premiums');
    this.control = new CentralController();
    this.timeout = null;
    this.value = 1000;
    this.$premium = $("input[name=premium]");
    this.render();

    $("#premiums .d3-slider-handle").append(`<span id='chosen-premium'>$${commasFormatter(this.value)}</span>`)
    this.$premium.val(this.value);
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
        .value(4000 - total_cost)
        .min(4000).max(0)
        .axis(d3.svg.axis().tickFormat((d) => `$${d}`).orient('right') )
        .on("slide", (evt, value)=>{
          this.value = value;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            that.control.update({ premium: Math.floor(4000-value) });
          }, 300);

          $("#chosen-premium").text("$" + commasFormatter(4000-this.value));

          this.$premium.val(parseInt(4000-this.value));
        })
        .orientation("vertical")
    );
  }
}
