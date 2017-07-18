class App {
  constructor(options) {

    this.render();
    this._listenToWindow();
  }

  render() {
    //Loading data...
    this.AnnualSalaryControl = new AnnualSalaryControl();
    this.PremiumsControl = new PremiumsControl();
    this.Stage = new Stage();
  }

  _listenToWindow() {

    $(window).on('hashchange', ()=>{
      if (window.location.hash && window.location.hash.length > 0)
      {
        const hash = $.deparam(window.location.hash.substring(1));
        this.Stage.highlight(hash);
      }
    });
    $(window).trigger("hashchange");
  }
}

window.AppManager = new App({});
