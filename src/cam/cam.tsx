import React, {useState} from "react";
import Webcam from "react-webcam";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Button, Col, Container, Row} from "react-bootstrap";
import Gallery, {ImageShoot} from "./gallery";
import moment from "moment";
import {SchemaImage} from "../database/dao";
import {useIndexedDB} from "react-indexed-db-hook";

export default function Cam() {
  const {add, deleteRecord} = useIndexedDB(SchemaImage)
  const webcamRef = React.useRef<any>(null);
  const [key, setKey] = useState('home');
  const [dataForImg, setDataForImg] = useState<Array<ImageShoot>>([])
  const onCapture = React.useCallback(async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    const item: ImageShoot = {
      data: imageSrc,
      name: `iGi_${moment().format("HH:mm YYYY-MM-DD")}`,
      uploadStatus: false,
      createdAt: moment().toISOString(),
    }
    item.id = await add(item)
    const data = [item, ...dataForImg]
    setDataForImg(data)
  }, [webcamRef, setDataForImg, dataForImg]);

  const renderCam = () => {
    return (
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
    )
  }

  const onDeleteImgShoot = async (idx: number) => {
    const item = dataForImg[idx]
    if (item && item.id) {
      const res = await deleteRecord(item.id)
      if (res.type === 'success') {
        const data = dataForImg.filter((value, index) => {
          return index !== idx
        })
        setDataForImg(data)
      } else {
        alert('Delete failed')
      }
    }
  }

  const renderTabs = () => {
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k ?? 'home')}
        className="mb-3"
      >
        <Tab eventKey="home" title="Image">
          <Container>
            <Row xs={'auto'}>
              <Col>
                <Button variant="primary" onClick={onCapture}>Capture</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Gallery data={dataForImg} onDelete={onDeleteImgShoot}/>
              </Col>
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="profile" title="Video">
          <Container>
            <Row xs={'auto'}>
              <Col>
                <Button variant="primary">Start Record</Button>
              </Col>
            </Row>
          </Container>
        </Tab>
      </Tabs>
    )
  }

  return (
    <Container className={'mt-4'}>
     <Row>
       <Col>
         {renderCam()}
       </Col>
       <Col>
         {renderTabs()}
       </Col>
     </Row>
    </Container>
  )
}
