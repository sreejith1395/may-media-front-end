
import React, { useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addCategories, deleteCategory, getallCatrgory, getvideo, updateCategory } from '../services/allapi';
import { Trash2 } from 'feather-icons-react/build/IconComponents';
import { Col, Row } from 'react-bootstrap';
import Videocard from './Videocard';


function Category() {
  const[allCategory,setallCategory]=useState([])
  const [show, setShow] = useState(false);
  const [CategoryItem, setCategoryItem] = useState({ id: "", categoryName: "", allvideos: [] })

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

   const getCategoryList=async()=>{
       const response=   await  getallCatrgory()
      //  console.log(response.data);
       setallCategory(response.data)
   }
   console.log(allCategory);


   useEffect(() => {
   
    getCategoryList()
   
     
   }, [])
   





  const addCategoryForm = (e) => {
    const { name, value } = e.target
    setCategoryItem({ ...CategoryItem, [name]: value })
  }
  console.log(CategoryItem);


 const handleDeleteCategory=async(e,id)=>{

  e.preventDefault()
  console.log(id);

    await deleteCategory(id)
    getCategoryList()

 }


  const handleAddCategory = async (e) => {
    e.preventDefault()
    const { id, categoryName } = CategoryItem
    if (!id || !categoryName) {
      toast.warning("Please fill the form completely")
    }
    else {
      const response = await addCategories(CategoryItem)

      console.log(response);
      if (response.status >= 200 && response.status < 300) {

        setShow(false)
        toast.success("New category added  successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        // go get category
        getCategoryList()
      }
      else {
        toast("provide a unique id!!!")
      }
    }

  }

//  drag over 
  const dragover=e=>{
       e.preventDefault()
       console.log('dragging over the categpry board !!!!');
       
  }

  // dropped 

  const dropped=async(e,categoryId)=>{
      console.log("dropped category id",categoryId);
      let sourceCardId=e.dataTransfer.getData("cardId")
      console.log("source card id is ",sourceCardId);

      // logic to implement adding card in the given category 

   let  {data}=    await getvideo(sourceCardId)

    // console.log(response);

    console.log("source video data",data);

    let selectCategory =allCategory.find(item=>item.id==categoryId)
    console.log("target category details",selectCategory);
    selectCategory.allvideos.push(data)
    console.log("updated target category details",selectCategory);
    await  updateCategory(categoryId,selectCategory)
    getCategoryList()

  }




  return (
    <>
      <div className="d-grid">
        <div onClick={handleShow} className='btn btn-dark m-2'>
          Add Categories
        </div>
      </div>
      {
         allCategory?.map(item=>(
        <div>
             <div  droppable onDragOver={e=>dragover(e)} onDrop={e=>dropped(e,item?.id)} className='d-flex justify-content-between border rounded mt-2 p-3'>
              <h4>{item.categoryName}</h4>

              
              <span onClick={e=>handleDeleteCategory(e,item?.id)}> <Trash2 color="red"></Trash2> </span>


              <Row>
                {
                   
                       item?.allvideos.map((card) => (
                        <Col className='p-3 mb-1 sm={12}'>
      
                          <Videocard card={card}  insideCategory={true} />
                        </Col>
                      ))
                      


                }


              </Row>
             </div>
        </div>
         ))
      }


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <FloatingLabel className='mb-3' controlId="floatingId" label="Id">
            <Form.Control type="text" placeholder="Id" name='id' onChange={addCategoryForm} />
          </FloatingLabel>



          <FloatingLabel className='mb-3' controlId="floatingId" label="category">
            <Form.Control type="text" name='categoryName' onChange={addCategoryForm} placeholder="category" />
          </FloatingLabel>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleAddCategory} variant="primary" >ADD</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />

    </>
  )
}

export default Category