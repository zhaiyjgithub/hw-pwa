import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Col, Container, Row} from "react-bootstrap";
import {MediaItem} from "./gallery";
import moment from "moment";
import {blobToBase64, getUUID, SchemaImage, SchemaVideo} from "../database/dao";
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
  const [tabID, setTabID] = useState<TabID>(TabID.image);

  useEffect(() => {
    ImageDao.getAll().then((r) => {
      const l = r.sort((a, b) => {
        return a.createdAt - b.createdAt
      })
      setDataForImg(l.reverse())
    })

    VideoDao.getAll().then((r) => {
      const l = r.sort((a, b) => {
        return a.createdAt - b.createdAt
      })
      setDataForVideo(l.reverse())
    })
  }, [])

  const handleDataAvailable = async (e: any) => {
      if (e.data.size > 0) {
        const videoBase64 = await blobToBase64(e.data as Blob)
        const item: MediaItem = {
          data: videoBase64 as any,
          name: `iGi_${getUUID()}`,
          uploadStatus: false,
          createdAt: moment().toISOString(),
        }
        item.id = await VideoDao.add(item)
        const data = [item, ...dataForVideo]
        setDataForVideo(data)
      }
    };

  const handleStartRecording = React.useCallback(() => {
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, mediaRecorderRef, handleDataAvailable]);

  const handleStopRecording = React.useCallback(async () => {
    mediaRecorderRef.current.stop();
  }, [mediaRecorderRef]);

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
      name: `iGi_${getUUID()}`,
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
          <VideoList data={dataForVideo} onStart={handleStartRecording} onStop={handleStopRecording} onDelete={onDeleteVideo}/>
        </Tab>
      </Tabs>
    )
  }

  return (
    <Container className={'mt-4'}>
     <Row className={'gy-xs-0 gy-lg-4'}>
       <Col xs={12} xl={6}>
         {renderCam()}
       </Col>
       <Col xs={12} xl={6}>
         {renderTabs()}
       </Col>
     </Row>
    </Container>
  )
}
