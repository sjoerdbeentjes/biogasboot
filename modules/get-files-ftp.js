const JSFtp = require("jsftp");
const path = require('path');
require('dotenv').config();

function getFTPfiles() {
  // Setup  connections to external FTP server
  // Setup for VALUE
  const ftpValue = new JSFtp({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  });
  // Setup for STATUS
  const ftpStatus = new JSFtp({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  });
  // Setup for ALARM
  const ftpAlarm = new JSFtp({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  });

  // Gets latest file from FTP server and place it on this server (every 30 min, 1800 seconds)
  setInterval(() => {
    console.log('-----New update from FTP server-----');
    // Update VALUE dir
    ftpValue.ls("/uploads/VALUE/VALUE/", function(err, res) {

      // Sort by filename
      const byName = res.slice(0);
      byName.sort(function(a,b) {
        return a.name - b.name;
      });

      // Get latest file name (by name)
      const totalFilesVALUE = byName.length - 1;
      const latestFileVALUE = byName[totalFilesVALUE].name;
        // Copy latest from FTP to this server
      ftpValue.get('/uploads/VALUE/VALUE/'+ latestFileVALUE, path.join(__dirname, `../data/ftp/VALUE/${latestFileVALUE}`), function(hadErr) {
        if (hadErr)
          console.error(hadErr);
        else
          console.log('VALUE file copied successfully! Filename: ' + latestFileVALUE);
      });
    });

    // Update STATUS dir
    ftpStatus.ls("/uploads/STATUS/STATUS/", function(err, res) {

      // Sort by filename
      const byName = res.slice(0);
      byName.sort(function(a,b) {
        return a.name - b.name;
      });

      // Get latest file name (by name)
      const totalFilesSTATUS = byName.length - 1;
      const latestFileSTATUS = byName[totalFilesSTATUS].name;
      // Copy latest from FTP to this server
      ftpStatus.get('/uploads/STATUS/STATUS/'+ latestFileSTATUS, path.join(__dirname, `../data/ftp/STATUS/${latestFileSTATUS}`), function(hadErr) {
        if (hadErr)
          console.error(hadErr);
        else
          console.log('STATUS file copied successfully! Filename: ' + latestFileSTATUS);
      });
    });

    // // Update ALARM dir
    ftpAlarm.ls("/uploads/ALARM/", function(err, res) {
      // Sort by timestamp
      const byDate = res.slice(0);
      byDate.sort(function(a,b) {
        return a.time - b.time;
      });

      // Get latest file name
      const totalFilesALARM = byDate.length - 1;
      const latestFileALARM = byDate[totalFilesALARM].name;
      // Copy latest from FTP to this server
      ftpAlarm.get('/uploads/ALARM/'+ latestFileALARM, path.join(__dirname, `../data/ftp/ALARM/${latestFileALARM}`), function(hadErr) {
        if (hadErr)
          console.error(hadErr);
        else
          console.log('ALARM file copied successfully! Filename: ' + latestFileALARM);
      });
    });
  }, 1800000);

}

module.exports = getFTPfiles;