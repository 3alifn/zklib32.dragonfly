const { json } = require("body-parser");
const ZKLib = require('zklib-32ble');
const Timer = require('setinterval');
const axios = require('axios');
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  console.log('ZKLIB-32 STARTED, NOW READY FOR ATTENDANCE');
  res.end('ZKLIB-32 STARTED, NOW READY FOR ATTENDANCE')
}).listen(303)

const zkteco = async (param) => {
  let zkInstance = new ZKLib('192.168.1.201', 4370, 5200, 5000);
  try {
    // Create socket to machine
    await zkInstance.createSocket()
    // get total attendance data    
    const logs = await zkInstance.getAttendances()
    // console.log(await zkInstance.getInfo());
    const getLast = logs.data.length;
    const domain = 'saanviabc.com';
    const data = logs.data;
    const user = 'Student';
    const name = 'Fingerprint';
    const lastSyncData = fs.readFileSync('./data.js', 'utf8');
    const abs_count = Math.abs(getLast - lastSyncData)
    // console.log( 'TOTAL ATTN LOGS IN MACHINE CAPACITY '+getLast);
    // console.log( 'ATTN LOGS LAST SYNC DATA '+lastSyncData);
    // console.log( 'DIFF ATTN LOGS BETWEEN DATABASE AND MACHINE CAPACITY '+abs_count);
    // console.log('=================================================================');
    if (getLast > lastSyncData && param == 'abs_log_checkout') {
      for (let index = getLast - abs_count; index < getLast; index++) {
        const user_id = data[index].deviceUserId;
        const today = data[index].recordTime;
        const record_date = data[index].recordTime.slice(0, 15);
        const record_time = data[index].recordTime.slice(0, 24);
        console.log(user_id, record_time);
        abs_log_checkout(domain, user, name, user_id, today, record_date, record_time);
      }
    }


    if (getLast > 0) {
      fs.writeFileSync('./data.js', JSON.stringify(getLast));
    }

  } catch (e) {
    console.log(e)
    if (e.code === 'EADDRINUSE') {
    }
  }

}

const get_time = new Date().getTime();
const five_min = 300000;
const session = new Date().getUTCFullYear();

const checkinTime = "0800";
const checkoutTime = "1000";
const realTime = new Date().toTimeString().slice(0, 5).replace(":", "")

// attn_checkout_webapi_absent_student('saanviabc.com', 'Student', 'Fingerprint')


setTimeout(() => {
  attn_log_checkout('saanviabc.com', 'Student')
}, 5000); // emit on after 5sec.........



function attn_log_checkout(domain, user) {

  axios.post('http://saanviabc.com/pu/attn-checkout-webapi/', {
    domain, user
  }).then((response) => {
    const getLast = response.data.lastSyncData;

    setInterval(() => {
      zkteco('abs_log_checkout')
    }, 5000); // emit on after 5sec.........

    const lastSyncData = fs.readFileSync('./data.js', 'utf8');
    const abs_count = Math.abs(getLast - lastSyncData)
    console.log('TOTAL ATTN LOGS IN DATABASE ' + parseInt(getLast));
    console.log('TOTAL ATTN LOGS IN MACHINE CAPACITY ' + parseInt(lastSyncData));
    console.log('DIFF ATTN LOGS DIFF BETWEEN DATABASE AND MACHINE CAPACITY ' + parseInt(abs_count));
    console.log('=================================================================');

    fs.writeFileSync('./data.js', JSON.stringify(getLast));



  })
    .catch((error) => {
      console.error(error);
    });
}



function abs_log_checkout(domain, user, name, user_id, today, record_date, record_time) {
  axios.post('http://saanviabc.com/pu/attn-present-webapi/', {
    domain, user, name, user_id, today, record_date, record_time
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('error');
    });

}



function attn_checkout_webapi_absent_teacher(domain, user, name) {

  axios.post('http://saanviabc.com/pu/attn-absent-webapi/teacher/', {
    domain, user, name
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}


function attn_checkout_webapi_absent_staff(domain, user, name) {

  axios.post('http://saanviabc.com/pu/attn-absent-webapi/staff/', {
    domain, user, name
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}



function attn_checkout_webapi_absent_student(domain, user, name) {

  axios.post('http://saanviabc.com/pu/attn-absent-webapi/student/', {
    domain, user, name
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}
