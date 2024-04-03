const ZKLib = require('./zklib')
const test = async () => {


    let zkInstance = new ZKLib('192.168.1.201', 4370, 10000, 4000);
    try {
        // Create socket to machine 
        await zkInstance.createSocket()


        // Get general info like logCapacity, user counts, logs count
        // It's really useful to check the status of device 
    } catch (e) {
    }

    let fingers = await zkInstance.finger()
    console.log(fingers)

    
    zkInstance.getRealTimeLogs((data)=>{
        // do something when some checkin 
    })
}

test()






