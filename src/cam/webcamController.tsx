import React, {useState} from "react";
import Webcam from "react-webcam";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Col, Container, Row} from "react-bootstrap";
import {MediaItem} from "./gallery";
import moment from "moment";
import {blobToBase64, SchemaImage, SchemaVideo} from "../database/dao";
import {useIndexedDB} from "react-indexed-db-hook";
import ImageList from "./tab/imageList";
import VideoList from "./tab/videoList";

enum TabID {
  image = 'image',
  video = "video"
}

export default function WebcamController() {
  const ImageDao = useIndexedDB(SchemaImage)
  const VideoDao = useIndexedDB(SchemaVideo)
  const webcamRef = React.useRef<any>(null);
  const [dataForImg, setDataForImg] = useState<Array<MediaItem>>([])
  const [dataForVideo, setDataForVideo] = useState<Array<MediaItem>>([])

  const mediaRecorderRef = React.useRef<any>(null);
  const [recording, setRecording] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState<any[]>([]);

  const [tabID, setTabID] = useState<TabID>(TabID.image);

  const handleDataAvailable = React.useCallback(
    ({ data } : any) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartRecording = React.useCallback(() => {
    setRecording(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setRecording, mediaRecorderRef, handleDataAvailable]);

  const handleStopRecording = React.useCallback(async () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    const videoBase64 = await blobToBase64(recordedChunks as unknown as Blob)
    const item: MediaItem = {
      data: videoBase64 as any,
      name: `iGi_${moment().format("HH:mm YYYY-MM-DD")}`,
      uploadStatus: false,
      createdAt: moment().toISOString(),
    }
    item.id = await VideoDao.add(item)
    const data = [item, ...dataForVideo]
    setDataForVideo(data)
  }, [recordedChunks, VideoDao, dataForVideo]);

  const onRecord = () => {
    if (recording) {
      handleStopRecording().then()
    } else {
      handleStartRecording()
    }
  }

  const onDeleteVideo = async (idx: number) => {
    const item = dataForVideo[idx]
    if (item && item.id) {
      const res = await VideoDao.deleteRecord(item.id)
      if (res.type === 'success') {
        const data = dataForVideo.filter((value, index) => {
          return index !== idx
        })
        setDataForVideo(data)
      } else {
        alert('Delete failed')
      }
    }
  }

  const onCaptureImage = React.useCallback(async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    const item: MediaItem = {
      data: imageSrc,
      name: `iGi_${moment().format("HH:mm YYYY-MM-DD")}`,
      uploadStatus: false,
      createdAt: moment().toISOString(),
    }
    item.id = await ImageDao.add(item)
    const data = [item, ...dataForImg]
    setDataForImg(data)
  }, [ImageDao, dataForImg]);

  const onDeleteImage = async (idx: number) => {
    const item = dataForImg[idx]
    if (item && item.id) {
      const res = await ImageDao.deleteRecord(item.id)
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

  const renderCam = () => {
    return (
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
    )
  }

  const renderTabs = () => {
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={tabID}
        onSelect={(k) => setTabID(k === TabID.image.toString() ? TabID.image : TabID.video)}
        className="mb-3"
      >
        <Tab eventKey={TabID.image} title="Image">
          <ImageList data={dataForImg} onCapture={onCaptureImage} onDelete={onDeleteImage} />
        </Tab>
        <Tab eventKey={TabID.video} title="Video">
          <VideoList data={dataForImg} onRecord={onRecord} onDelete={onDeleteVideo} recording={recording}/>
        </Tab>
      </Tabs>
    )
  }

  return (
    <Container className={'mt-4'}>
     <Row className={'gy-xs-0 gy-lg-4'}>
       <Col xs={12} lg={6}>
         {renderCam()}
       </Col>
       <Col xs={12} lg={6}>
         {renderTabs()}
       </Col>
     </Row>
    </Container>
  )
}
