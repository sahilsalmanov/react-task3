import { Form, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Row, Col, Spinner, Card, CardHeader, CardBody, Button, ModalFooter, ModalBody, ModalHeader, Modal, Input, FormGroup, Label } from "reactstrap";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const UsersPosts = () => {
  let initialState = {
    data: undefined,
    error: undefined,
    loading: true,
  };
  const [posts, setPosts] = useState(initialState);
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('')
  const { id } = useParams();

  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('')
  const [deleteBody, setDeleteBody] = useState('')
  const [deleteId, setDeleteId] = useState('')


  useEffect(() => {
    loadData()
  }, [id]);

  function loadData() {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}/posts`)
      .then(({ data }) => {
        setPosts((oldData) => ({
          ...oldData,
          data: data,
          loading: false,
          error: undefined,
        }));
      })
      .catch((err) => {
        setPosts({ data: undefined, loading: false, error: err.toString() });
      });
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModal2 = () => {
    setIsModalOpen2(!isModalOpen2);
  };

  function deleteHandle(e) {
    let value = e.target.parentElement.value
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${value}`)
    loadData()
  }

  const postHandle = (e) => {
    toggleModal2();
  }

  const postHandleChange2 = (e) => {
    axios('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: deleteTitle,
        body: deleteBody,
        id: deleteId
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    toggleModal2();
    setDeleteBody('')
    setDeleteTitle('')
    setDeleteId('')
    loadData()

  }

  const editHandle = (e) => {
    toggleModal();
    let value = e.target.parentElement.value
    console.log(value)
    setValue(value)
  }

  const editHandleChange = (e) => {
    toggleModal();
    console.log(value)
    axios.patch(`https://jsonplaceholder.typicode.com/posts/${value}`, {
      title: editTitle,
      body: editBody

    })
    setEditTitle('')
    setEditBody('')
    console.log(value)
    loadData()
  }






  const renderBody = () => {
    if (posts.loading) {
      return <Spinner />
    }
    else if (posts.error) {
      return <h4 className="text-danger">Unexpected error occured :(</h4>
    }
    else {
      return (
        <>
          <button onClick={postHandle} style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '5px' }}>Create</button>
          {
            posts.data?.map(({ title, body, id }) => (
              <Card className="mt-3">
                <CardHeader>{title}</CardHeader>
                <CardBody>{body}</CardBody>
                <div style={{ display: 'flex', marginBottom: '10px', marginLeft: '10px' }}>
                  <div>
                    <button style={{ backgroundColor: 'white', border: 'none' }} value={id} onClick={deleteHandle}>
                      <i style={{ backgroundColor: 'red', color: 'white', padding: '5px', marginRight: '10px', borderRadius: '3px', cursor: "pointer" }} class="bi bi-trash"></i>
                    </button>
                  </div>
                  <div>
                    <button style={{ backgroundColor: 'white', border: 'none' }} value={id} onClick={editHandle}>
                      <i style={{ backgroundColor: 'green', color: 'white', padding: '5px', marginRight: '10px', borderRadius: '3px', cursor: "pointer" }} class='bi bi-pencil-square'></i>
                    </button>
                  </div>
                </div>
              </Card>

            ))
          }
        </>
      )
    }
  }

  return (
    <Layout>
      <Row>
        <Col ms={12}>
          {renderBody()}
          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Edit Post</ModalHeader>
            <ModalBody>
              <Label for="title">
                Title
              </Label>
              <Input onChange={(e) => setEditTitle(e.target.value)} value={editTitle} id="title" name="title" type="text" />
              <Label for="body">
                Body
              </Label>
              <Input onChange={(e) => setEditBody(e.target.value)} value={editBody} id="body" name="body" type="text" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={editHandleChange}>Save</Button>
              <Button color="secondary" onClick={toggleModal}>Cancel</Button>
            </ModalFooter>
          </Modal>


          <Modal isOpen={isModalOpen2} toggle={toggleModal2}>
            <ModalHeader toggle={toggleModal2}>Create Post</ModalHeader>
            <ModalBody>
              <Label for="title">
                Title
              </Label>
              <Input onChange={(e) => setDeleteTitle(e.target.value)} value={deleteTitle} id="title" name="title" type="text" />
              <Label for="body">
                Body
              </Label>
              <Input onChange={(e) => setDeleteBody(e.target.value)} value={deleteBody} id="body" name="body" type="text" />
              <Label for="userId">
                UserId
              </Label>
              <Input onChange={(e) => setDeleteId(e.target.value)} value={deleteId} id="userId" name="userId" type="text" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={postHandleChange2}>Save</Button>
              <Button color="secondary" onClick={toggleModal2}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
    </Layout>
  );
};