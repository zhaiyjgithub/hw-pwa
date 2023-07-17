import React, {useEffect} from 'react';
import logo from './asserts/igi-logo.jpg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WebcamController from "./cam/webcamController";
import {Col, Container, Navbar, Row} from "react-bootstrap";
import {initDB} from "react-indexed-db-hook";
import {DBConfig} from "./database/dao";

initDB(DBConfig)

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
      device = await navigator.usb.requestDevice({ filters: [{
          vendorId: 0x349c,
        }]})
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
      <Navbar className="bg-primary">
        <Container>
          <Navbar.Brand href="#home">
           <Container>
              <Row className={'align-items-center'}>
                <Col>
                  <img
                    alt=""
                    src={logo}
                    width="40"
                    height="40"
                  />
                </Col>
                <Col>
                  <span className={'h2 text-white'}>iGI - MDLand</span>
                </Col>
              </Row>
           </Container>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <WebcamController />
    </div>
  );
}

export default App;
