
class App {
  constructor(options) {
    
    this._listenToWindow();
    this.render();
  }

  render() {
    //Loading data...
  }

  _listenToWindow() {

    $(window).on('hashchange', ()=>{
      if (window.location.hash && window.location.hash.length > 0)
      {
        const hash = $.deparam(window.location.hash.substring(1));
      }
    });
    $(window).trigger("hashchange");
  }
}

window.AppManager = new App({});
