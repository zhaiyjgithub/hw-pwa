import {Button, Col, Container, Row} from "react-bootstrap";
import Gallery, {MediaItem, MediaType} from "../gallery";
import React, {useEffect, useState} from "react";

interface IProps {
  data: Array<MediaItem>,
  onStart: () => void,
  onStop: () => void,
  onDelete?: (idx: number) => void
}

export default function VideoList(props: IProps) {
  const {data, onStop, onStart, onDelete} = props
  const [recording, setRecording] = useState(false)
  return (
    <Container>
      <Row xs={'auto'}>
        <Col>
          <Button variant="primary" onClick={() => {
            if (recording) {
              onStop()
            } else {
              onStart()
            }
            setRecording(!recording)
          }}>{recording ? 'Stop Record' : "Start Record"}</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Gallery data={data} onDelete={onDelete} mediaType={MediaType.video}/>
        </Col>
      </Row>
    </Container>
  )
}
