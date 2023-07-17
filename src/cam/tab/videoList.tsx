import {Button, Col, Container, Row} from "react-bootstrap";
import Gallery, {MediaItem, MediaType} from "../gallery";
import React from "react";

interface IProps {
  recording: boolean,
  data: Array<MediaItem>,
  onRecord: () => void,
  onDelete?: (idx: number) => void
}

export default function VideoList(props: IProps) {
  const {data, onRecord, onDelete, recording} = props
  return (
    <Container>
      <Row xs={'auto'}>
        <Col>
          <Button variant="primary" onClick={onRecord}>{recording ? 'Stop Record' : "Start Record"}</Button>
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
