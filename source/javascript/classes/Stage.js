class Stage {
  constructor() {
    this.render();
  }

  render() {
    console.log("XXX");

    var s2 = d3.scale.log().domain([1,100]).range([1,20]);
    var s = d3.scale.log().domain([1,100]).range([1,200000]);
    var xTicks = [];
    var yValues = [];

    var curr = -1;
    xTicks.push(20000);
    yValues.push(0);

    for (var x=2; x<=50; x++) {
      var xVal = s(x);

      if (curr != Math.floor(s2(x))) {
        curr = Math.floor(s2(x));
      } else {
        continue;
      }
      console.log("LOG", Math.floor(s2(x)));

      xTicks.push(Math.floor(s(x)/100) * 100);
      console.log("Pushing", Math.floor(s(x)/100) * 100)
      if (xVal < 25000) {
        yValues.push(0)
      } else if (xVal > 25000 && xVal <= 50000) {
        yValues.push(Math.floor(xVal * 0.09 / 12));
      } else if (xVal > 50000 && xVal <= 75000) {
        yValues.push(Math.floor(xVal * 0.11 / 12));
      } else if (xVal > 75000 && xVal <= 100000) {
        yValues.push(Math.floor(xVal * 0.12 / 12));
      } else if (xVal > 100000 && xVal <= 200000) {
        yValues.push(Math.floor(xVal * 0.14 / 12));
      } else if (xVal > 200000 ) {
        yValues.push(Math.floor(xVal * 0.16 / 12));
      }
    }
    xTicks.push(200000);
    yValues.push(Math.floor(200000 * 0.16 / 12))

    // console.log(xTicks);
    // var data_test_original = ['data1'].concat(yValues);
    //
    // console.log("XX", data_test_original);
    // var chart_test = c3.generate({
    //     bindto: '#stage',
    //     data: {
    //       x: 'x',
    //       columns: [
    //         ['x'].concat(xTicks),
    //         data_test_original
    //       ]
    //     },
    //
    //     axis : {
    //         x : {
    //             tick: {
    //                format: function (d, id) { return Math.floor(d/100) * 100;  }
    //             }
    //         }
    //     },
    // });

    console.log("XXX");
    var data_test = ['data1'];
    console.log(xTicks);
    var data = []
    for(var i=0; i<xTicks.length; i++){
      console.log(xTicks[i]);
        data[i] = Math.log(xTicks[i]) / Math.LN10;
    }
    console.log(data_test);

    var chart_test = c3.generate({
        bindto: '#stage',
        data: {
          x: 'data1',
          columns: [
            data_test.concat(data),
            ['premium'].concat(yValues)
          ]
        },
        axis : {
            x : {
                tick: {
                   format: function (d) { return Math.pow(10,d).toFixed(2); }
                },
                show: false
            },
            y: {
              show:false,
              max: 2500
            }
        },
        legend: {
            show: false
        }
    });
  }

  highlight(options) {
    console.log(options);
  }
}
