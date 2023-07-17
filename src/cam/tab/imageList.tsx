import {Button, Col, Container, Row} from "react-bootstrap";
import Gallery, {MediaItem, MediaType} from "../gallery";
import React from "react";

interface IProps {
  data: Array<MediaItem>,
  onCapture: () => void,
  onDelete?: (idx: number) => void
}

export default function ImageList(props: IProps) {
  const {data, onCapture, onDelete} = props
  return (
    <Container>
      <Row xs={'auto'}>
        <Col>
          <Button variant="primary" onClick={onCapture}>Capture</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Gallery data={data} onDelete={onDelete} mediaType={MediaType.image}/>
        </Col>
      </Row>
    </Container>
  )
}
