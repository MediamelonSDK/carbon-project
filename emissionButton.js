var myapp = myapp || {};

// Use shaka.ui.Element as a base class
myapp.EmissionButton = class extends shaka.ui.Element {
    constructor(parent, controls) {
      super(parent, controls);

      var img = document.createElement('img');
      img.src = 'Carbon-Icon.svg';
      img.id = 'emission-indicator';
      img.style.height = '15px';
      img.style.width = '17px';
  
      this.parent.appendChild(img);
  
      // Listen for clicks on the button to start the next playback
      this.eventManager.listen(img, 'click', () => {
        
      });
    }
  };
  
  
  // Factory that will create a button at run time.
  myapp.EmissionButton.Factory = class {
    create(rootElement, controls) {
      return new myapp.EmissionButton(rootElement, controls);
    }
  };
  
  // Register our factory with the controls, so controls can create button instances.
  shaka.ui.Controls.registerElement(
    /* This name will serve as a reference to the button in the UI configuration object */ 'emission',
    new myapp.EmissionButton.Factory());