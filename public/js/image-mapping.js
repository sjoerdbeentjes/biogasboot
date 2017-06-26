let allMaps = [];

const ImageMapSetup = {
  target: document.getElementsByTagName('map')[0],
  init() {
    const targetType = typeof(ImageMapSetup.target);
    if(targetType != 'object') {
      console.log(targetType)
      ImageMapSetup.start(document.querySelector('map'));
    } else {
      console.log(targetType)
      ImageMapSetup.start(ImageMapSetup.target);
    }
  },
  start(element) {
    if (element) {
      ImageMapSetup.checkMap(element);
      // scaleImageMap.call(element);
      allMaps.push(element);
    }
  },
  checkMap(element) {
    if (!element.tagName) {
      console.log('Element niet gevonden');
    } else if ('MAP' !== element.tagName.toUpperCase()) {
      console.log('Verkeerde element geselecteerd');
    }
  }
}

// window.ImageMapSetup = ImageMapSetup.init();
