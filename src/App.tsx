import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const connectedDevices: USBDevice[] = [];

function App() {

  useEffect(() => {
     getDevice().then(r => {})
  })
  useEffect(() => {
      addEventListener()
  })

  const getDevice = async () => {
    const devices = await navigator.usb.getDevices();
    console.log(devices)
    devices.forEach(handleConnectedDevice);
  }

  const requestDevice = async () => {
    let device
    try {
      device = await navigator.usb.requestDevice()
    } catch (e) {
      console.error(e)
    }
    if (device !== undefined) {
      console.log('request device', device)
    }
  }

  const addEventListener = () => {
    navigator.usb.addEventListener("connect", async (event) => {
        await handleConnectedDevice(event.device)
    })

    navigator.usb.addEventListener("disconnect", (event) => {
      const i = connectedDevices.indexOf(event.device);
      if (i >= 0) {
        connectedDevices.splice(i, 1);
      }
    })
  }

  async function handleConnectedDevice(device: USBDevice) {
    await device.reset();
    connectedDevices.push(device);

    await device.open();
    if (device.configuration === null)
      await device.selectConfiguration(1);
    await device.claimInterface(1);

    await device.controlTransferOut({
      requestType: 'vendor',
      recipient: 'interface',
      request: 0x01,  // vendor-specific request: enable channels
      value: 0x0013,  // 0b00010011 (channels 1, 2 and 5)
      index: 0x0001   // Interface 1 is the recipient
    });

    while (true) {
      const result = await device.transferIn(1, 6);

      if (result.data && result.data.byteLength === 6) {
        console.log('Channel 1: ' + result.data.getUint16(0));
        console.log('Channel 2: ' + result.data.getUint16(2));
        console.log('Channel 5: ' + result.data.getUint16(4));
      }

      if (result.status === 'stall') {
        console.warn('Endpoint stalled. Clearing.');
        await device.clearHalt("in", 1);
      }
    }
  }

  return (
    <div className="App">
      <button style={{height: 50, backgroundColor: 'blue', fontSize: 24, color: 'white'}} onClick={async () => {
          await requestDevice()
      }}>
        Click
      </button>
    </div>
  );
}

export default App;
