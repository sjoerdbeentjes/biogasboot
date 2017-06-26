const config = {
  allMaps: [],
  actualMap: document.getElementsByTagName('map')[0],
  allAreas: false,
  areaCoords: [],
  vector: false,
  timer: false
};

const RecalculateImageMap = {
  init() {
    if (config.actualMap.newSize) {
      // Still on this
    } else {
      RecalculateImageMap.start();
    }
  },
  start() {
    config.allAreas = config.actualMap.getElementsByTagName('area');
    config.vector = document.getElementById('interactive_vector');
    for (let i = 0; i < config.allAreas.length; i++) {
      const coords = config.allAreas[i].coords;
      config.areaCoords.push(coords.replace(/ *, */g, ',').replace(/ +/g, ','));
    }
    RecalculateImageMap.resize();
  },
  resize() {
    config.areaCoords.forEach(function (area, i) {
      config.allAreas[i] = area.split(',').map(RecalculateImageMap.scale).join(',');
    });
  },
  scale(coordinate) {
    let totalScale = config.vector.width / config.vector.naturalWidth;
    let result = Math.round(Number(coordinate) * totalScale);
    console.log(result)
  }
};

const ImageMapSetup = {
  init() {
    ImageMapSetup.start(config.actualMap);
  },
  start(element) {
    if (element) {
      RecalculateImageMap.init(element);
      config.allMaps.push(element);
    }
  }
};
