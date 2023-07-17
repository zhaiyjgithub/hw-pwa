import React from "react";
import {ButtonGroup, Card, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";

export enum MediaType {
  image,
  video,
}

export interface MediaItem {
  id?: number,
  name: string,
  data: string,
  uploadStatus: boolean,
  createdAt: string,
}

interface IProps {
  mediaType: MediaType,
  data: Array<MediaItem>,
  onDelete?: (idx: number) => void
}
export default function Gallery(props: IProps) {
  const {data, onDelete, mediaType} = props
  if (!data.length) {
    return (
      <Container className={"mt-4"} fluid>
        <Row>
          <p>No more data. Please record any video.</p>
        </Row>
      </Container>
    )
  }
  const $menu = (idx: number) => {
    return (
      <DropdownButton
        as={ButtonGroup}
        key={"warning"}
        id={`dropdown-variants-${"warning"}`}
        variant={'warning'}
        title={'More'}
      >
        <Dropdown.Item eventKey="1">Upload</Dropdown.Item>
        <Dropdown.Item eventKey="2">Rename</Dropdown.Item>
        <Dropdown.Item onClick={() => {
          if (onDelete) {
            onDelete(idx)
          }
        }} eventKey="3">Delete</Dropdown.Item>
      </DropdownButton>
    )
  }
  return (
    <Container className={'rounded mt-4 overflow-scroll'} style={{backgroundColor: '#efeff4', height: 500}}>
      <Row xs={"auto"} className={'pb-2'}>
        {data.map((item, index, array) => {
          return <Col className={'gy-2'} xs={3}>
            <Card style={{width: '8rem'}}>
              {mediaType === MediaType.image ? <Card.Img variant="top" src={item.data} /> :
                <div style={{width: '8rem', height: '8rem'}} className={'d.grid align-items-center justify-content-center'}>
                  <i className="bi bi-camera-reels"></i>
                </div>}
              <Card.Body>
                <p className={'text-truncate lh-base'}>{`${item.name}`}</p>
                {$menu(index)}
              </Card.Body>
            </Card>
          </Col>
        })}
      </Row>
    </Container>
  )
}
