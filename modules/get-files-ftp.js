const JSFtp = require("jsftp");
const path = require('path');
require('dotenv').config();

function getFTPfiles() {
  // Setup  connections to external FTP server
  const ftpValue = new JSFtp({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  });

  const ftpStatus = new JSFtp({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  });

  const ftpAlarm = new JSFtp({
    host: process.env.FTP_SERVER,
    port: 21,
    user: process.env.FTP_USER,
    pass: process.env.FTP_PASS
  });

  // Gets latest file from FTP server and place it on this server (every 30 min, 1800 seconds)
  setInterval(() => {
    // Update VALUE dir
    ftpValue.ls("/uploads/VALUE/VALUE/", function(err, res) {
      // Get latest file name
      const totalFilesVALUE = res.length - 1;
      const latestFileVALUE = res[totalFilesVALUE].name;
      console.log(res[totalFilesVALUE]);
      // Copy latest from FTP to this server
      ftpValue.get('/uploads/VALUE/VALUE/'+ latestFileVALUE, path.join(__dirname, `../data/ftp/VALUE/${latestFileVALUE}`), function(hadErr) {
        if (hadErr)
          console.error(hadErr);
        else
          console.log('VALUE file copied successfully!');
      });
    });

    // Update STATUS dir
    ftpStatus.ls("/uploads/STATUS/STATUS/", function(err, res) {
      // Get latest file name
      const totalFilesSTATUS = res.length - 1;
      const latestFileSTATUS = res[totalFilesSTATUS].name;
      // Copy latest from FTP to this server
      ftpStatus.get('/uploads/STATUS/STATUS/'+ latestFileSTATUS, path.join(__dirname, `../data/ftp/STATUS/${latestFileSTATUS}`), function(hadErr) {
        if (hadErr)
          console.error(hadErr);
        else
          console.log('STATUS file copied successfully!');
      });
    });
  }, 10000000);

}

module.exports = getFTPfiles;
