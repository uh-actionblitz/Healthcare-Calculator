class CentralController {

  constructor() {
    this.options = {};
  }

  update(options = {}) {
    console.log(options);
    if (
      window.location.hash &&
      window.location.hash.length > 0
    ) {
      var hash = $.deparam(window.location.hash.substring(1));
      window.location.hash = $.param(Object.assign(hash, options));
    } else {
      console.log(options);
      window.location.hash = $.param(options);
    }
  }

}
