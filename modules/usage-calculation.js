function usageCalculation(data) {
  // (watt * hours) * price = costs
  // watt == Joules per second
  // Get the total 1's from a device, this means that it's on.
  // Every 1 stands for 1 minute of operation
  // Total 1's / 60 = total hours of operation
  // Total hours of operation * watt = usage

  /*

   Mixer:  180 W
   Heaters: elk 2000 W;
   Feed pomp: 550 W
   Blower:  210 W

   */
}

module.exports = usageCalculation;
