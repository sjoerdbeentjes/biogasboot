const elements = {
  tank1: document.getElementById('TANK1'),
  tank2: document.getElementById('TANK2'),
  digester: document.getElementById('DIGESTER'),
  filter: document.getElementById('FILTER'),
  pomp: document.getElementById('POMP'),
  bubbles: [
    document.getElementById('Bubble1'),
    document.getElementById('Bubble2'),
    document.getElementById('Bubble3'),
    document.getElementById('Bubble4')
  ]
};

const app = {
  init() {
    elements.tank1.addEventListener("click", info.firstTank);
    elements.tank2.addEventListener("click", info.secondTank);
    elements.digester.addEventListener("click", info.digesterTank);
    elements.filter.addEventListener("click", info.filterTank);
    elements.pomp.addEventListener("click", info.pomp);
    app.getData();
    animate.bubble();
  },
  getData() {
    console.log('getting data');
  }
}

const info = {
  firstTank() {
    console.log('first tank')
  },
  secondTank() {

  },
  digesterTank() {

  },
  filterTank() {

  },
  pomp() {

  }
};

const animate = {
  bubble() {
    setInterval(function() {
      elements.bubbles.forEach(function(bubble) {
        if(bubble.getAttribute('r') == 3.75) {
          bubble.setAttribute("transition", '6');
          bubble.setAttribute("r", 6);
        } else {
          bubble.setAttribute("r", 3.75);
        }
      })
    }, 1250)
  }
}

app.init()
