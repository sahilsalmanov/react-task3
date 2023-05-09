import { Form, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Row, Col, Spinner, Card, CardHeader, CardBody, Button, ModalFooter, ModalBody, ModalHeader, Modal, Input , FormGroup, Label} from "reactstrap";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const UsersPosts = () => {
  let initialState = {
    data: undefined,
    error: undefined,
    loading: true,
  };
  const [posts, setPosts] = useState(initialState);
  const [inputChange, setInputChange] = useState('')
  const [inputChange2, setInputChange2] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('')
  const { id } = useParams();


   function deleteHandle(e) {
    let value = e.target.parentElement.value
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${value}`)
    loadData()
  }

    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
  
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
  title: inputChange,
  body: inputChange2
  
    })
    setInputChange('')
    setInputChange2('')
  console.log(value)
  loadData()
  }
  

  useEffect(() => {
    console.log("Azer emindi");
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

  const renderBody=()=>{
    if(posts.loading){
        return <Spinner/>
    }
    else if(posts.error){
        return <h4 className="text-danger">Unexpected error occured :(</h4>
    }
    else{
        return(
            posts.data?.map(({title,body,id})=>(
                <Card className="mt-3">
                     <CardHeader>{title}</CardHeader>
                     <CardBody>{body}</CardBody>
                     <div style={{display: 'flex', marginBottom: '10px', marginLeft: '10px'}}>
                    <div>
                      <button style={{backgroundColor: 'white', border: 'none'}} value={id} onClick={deleteHandle}>
                      <i style={{backgroundColor: 'red', color: 'white', padding:'5px', marginRight: '10px', borderRadius: '3px', cursor: "pointer"}} class="bi bi-trash"></i>
                      </button>
                      </div>
                      <div>
                      <button style={{backgroundColor: 'white', border: 'none'}}  value={id} onClick={editHandle}>
                        <i style={{backgroundColor: 'green', color: 'white', padding:'5px', marginRight: '10px', borderRadius: '3px', cursor: "pointer"}} class = 'bi bi-pencil-square'></i>
                        </button>
                      </div>
                      </div>
                </Card>
                
             ))
        )
        
    }
  }

  return (
    <Layout>
      <Row>
        <Col ms={12}>
        {renderBody()}
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Edit Card</ModalHeader>
        <ModalBody>
    <Label for="title">
      Title
    </Label>
    <Input onChange={(e) => setInputChange(e.target.value)} value={inputChange} id="title" name="title" type="text"/>
    <Label for="body">
      Body
    </Label>
    <Input onChange={(e) => setInputChange2(e.target.value)} value={inputChange2}  id="body" name="body" type="text"/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={editHandleChange}>Save</Button>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
        </Col>
      </Row>
    </Layout>
  );
};