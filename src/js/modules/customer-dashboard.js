// All calculations
const calculate = {
  carbonSavings(totalGas) {
    return totalGas * 0.4;
  },
  kilometerSavings(totalCarbon) {
    return totalCarbon * 0.150;
  },
  treeSavings(totalCarbon) {
    return totalCarbon / 20;
  }
};

calculate.carbonSavings(15)

if (document.getElementsByClassName('customer-dashboard')[0]) {
  const elements = [
    document.getElementsByClassName('start')[0],
    document.getElementsByClassName('overview')[0],
    document.getElementsByClassName('stats')[0],
    document.getElementsByClassName('announcements')[0]
  ];
  let counter = 0;

  setInterval(function() {
    elements.forEach(function(element) {
      element.style.display = 'none';
    });
    if (counter == 1) {
      elements[counter].style.display = 'flex';
    } else {
      elements[counter].style.display = 'block';
    }
    counter++;
    if (counter > 3) {
      counter = 0;
    }
  }, 15000)
}
