import React from "react";
import {Badge, Button, ButtonGroup, Card, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import imgP from '../asserts/test.jpg'

export interface ImageShoot {
  id?: number,
  name: string,
  data: string,
  uploadStatus: boolean,
  createdAt: string,
}
interface IProps {
  data: Array<ImageShoot>,
  onDelete?: (idx: number) => void
}
export default function Gallery(props: IProps) {
  const {data, onDelete} = props
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
              <Card.Img variant="top" src={item.data} />
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
