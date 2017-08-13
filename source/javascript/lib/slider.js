
const calculatorSlider = ({
    scale,
    callback,
    initialValue,
  }) => (container) => {

    var x = scale.clamp(true);

    (x);

    var slider = container.append("g")
        .attr("class", "slider")  ;

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() {
              (scale(d3.event.x))
              handle.attr("cx", d3.event.x);
              callback(scale.invert(d3.event.x));
            }));

    // slider.insert("g", ".track-overlay")
    //     .attr("class", "ticks")
    //     .attr("transform", "translate(0," + 18 + ")")
    //   .selectAll("text")
    //   .data(x.ticks(10))
    //   .enter().append("text")
    //     .attr("x", x)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    // slider.transition() // Gratuitous intro!
    //     .duration(750)
    //     .tween("hue", function() {
    //       var i = d3.interpolate(0, 70);
    //       return function(t) {
    //         handle.attr("cx", x(t));
    //         callback(i(t));
    //       };
    //     });

    handle.attr("cx", x(initialValue || 60000))
    callback(initialValue || 60000)

};
