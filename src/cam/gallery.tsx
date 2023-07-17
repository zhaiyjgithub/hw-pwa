import React from "react";
import {ButtonGroup, Card, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import {base64ToBlob} from "../database/dao";

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
        <Dropdown.Item eventKey="2" onClick={async () => {
          const item = data[idx]
          const dataBlob = await base64ToBlob(item.data)
          const blob = new Blob([dataBlob as BlobPart], {
            type: mediaType === MediaType.image ? "image/jpeg" : "video/webm"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none")
          a.href = url;
          a.download = mediaType === MediaType.image ? `${item.name}.jpeg` : `${item.name}.webm`;
          a.click();
          window.URL.revokeObjectURL(url);

        }}>Export</Dropdown.Item>
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
                <div style={{width: '8rem', height: '6rem', backgroundColor: 'gray', display: "flex", flexDirection: "column", justifyContent: 'center'}}>
                  <span style={{fontSize: 24, fontWeight: '600'}}>Video</span>
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
