// /* ALL IMPORTANT CONFIG DATA
// ------------------------------------------------ */
// const config = {
//   allMaps: [],
//   actualMap: document.getElementsByTagName('map')[0],
//   allAreas: null,
//   areaCoords: [],
//   vector: null,
// };
//
// /* RECALCULATION FUNCTIONALITY
// ------------------------------------------------ */
// const RecalculateImageMap = {
//   init() {
//     /* AUTOMATICALLY UPDATE COORDINATES ON RESIZED WINDOW
//     ------------------------------------------------ */
//     window.addEventListener('resize', ImageMapSetup.init);
//     if (!config.actualMap.newSize) {
//       RecalculateImageMap.start();
//     }
//   },
//   start() {
//     console.log(config.areaCoords.length)
//     if(config.areaCoords.length >= 3) {
//       console.log('fired')
//       config.areaCoords.splice(3,6)
//     }
//     config.allAreas = config.actualMap.getElementsByTagName('area');
//     config.vector = document.getElementById('interactive_vector');
//     /* ALL COORDINATES TO ARRAY
//     ------------------------------------------------ */
//     for (let i = 0; i < config.allAreas.length; i++) {
//       const coords = config.allAreas[i].coords;
//       config.areaCoords.push(coords.replace(/ *, */g, ',').replace(/ +/g, ','));
//     }
//     RecalculateImageMap.resize();
//   },
//   resize() {
//     /* FOR EACH AREA => RESIZE THE COORDINATES
//     ------------------------------------------------ */
//     config.areaCoords.forEach(function(area, i) {
//       config.allAreas[i].coords = RecalculateImageMap.scale(area);
//     });
//   },
//   scale(area) {
//     const allValues = area.split(',');
//     /* CHECK FOR DIFFERENCE IN SCREENSIZE
//     ------------------------------------------------ */
//     let totalScale = config.vector.width / config.vector.naturalWidth;
//     let newArea = [];
//     /* CHANGE EACH COORDINATE BASED ON THE NEW SCALE (DIFFERENCE SINCE LAST WIDTH)
//     ------------------------------------------------ */
//     allValues.map(function(coordinate) {
//       let result = Math.round(Number(coordinate) * totalScale);
//       newArea.push(result);
//     });
//     return newArea;
//   }
// };
//
// /* INITIALIZE RESIZING
// ------------------------------------------------ */
// const ImageMapSetup = {
//   init() {
//     ImageMapSetup.start(config.actualMap);
//   },
//   start(element) {
//     if (element) {
//       RecalculateImageMap.init(element);
//       config.allMaps.push(element);
//     }
//   }
// };
//
// ImageMapSetup.init();

const tank_2 = document.getElementById('Tank2');
console.log(tank_2);

tank_2.addEventListener("mouseover", showInfo)

function showInfo() {
  console.log('hover');
}
