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

    // // Update ALARM dir
    // ftpAlarm.ls("/uploads/ALARM/", function(err, res) {
    //   res.forEach(function(file) {
    //     console.log(file.time);
    //   });
    //
    //   // Get latest file name
    //   // const totalFilesALARM = res.length - 1;
    //   // const latestFileALARM = res[totalFilesALARM];
    //   // console.log(latestFileALARM);
    //   // Copy latest from FTP to this server
    //   // ftpAlarm.get('/uploads/ALARM/'+ latestFileALARM, path.join(__dirname, `../data/ftp/ALARM/${latestFileALARM}`), function(hadErr) {
    //   //   if (hadErr)
    //   //     console.error(hadErr);
    //   //   else
    //   //     console.log('ALARM file copied successfully!');
    //   // });
    // });
  }, 180000);



  // setInterval(() => {
  //   const recentData = '';
  //   Ftp.ls("/uploads/VALUE/VALUE/", function(err, res) {
  //     let totalFiles = res.length - 1;
  //     let latestFile = res[totalFiles].name;
  //
  //     let str = ""; // Will store the contents of the file
  //     Ftp.get('/uploads/VALUE/VALUE/'+ latestFile, function(err, socket) {
  //       if (err) return;
  //
  //       socket.on("data", function(d) {
  //         str += d.toString();
  //         //
  //         //
  //         //
  //         //
  //         //
  //         //
  //         //
  //         //
  //
  //         console.log(str);
  //       });
  //       socket.on("close", function(hadErr) {
  //         if (hadErr)
  //           console.error('There was an error retrieving the file.');
  //       });
  //       socket.resume();
  //     });
  //   });
  // }, 1000);

}

module.exports = getFTPfiles;