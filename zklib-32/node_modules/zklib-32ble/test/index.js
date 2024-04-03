const ZKLib = require('zklib-32ble')
    const test = async () => {
    let zkInstance = new ZKLib('192.168.1.201', 4370, 5200, 5000);
    try {
        // Create socket to machine
        await zkInstance.createSocket()


        // Get general info like logCapacity, user counts, logs count
        // It's really useful to check the status of device

        console.log(await zkInstance.getInfo())
      } catch (e) {
        console.log(e)
        if (e.code === 'EADDRINUSE') {
        }
    }

    await zkInstance.disconnect();

} 
test(); 