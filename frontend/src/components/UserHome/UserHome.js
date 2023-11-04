import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBCardTitle,
  MDBCardText
}
  from 'mdb-react-ui-kit';
import Swal from 'sweetalert2'


function UserHome() {

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [refresh, setRefresh] = useState(false)
  const [urlList,setUrlList]=useState([])


  const dispatch = useDispatch()

  const user=useSelector((state)=>{
  
    return state.user.details
  });

  const id=user._id
  async function handleLogout(e) {
    e.preventDefault()
    Swal.fire({
      title: 'Are you sure? logout',
      text: "logout from this account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7e3af2',
      cancelButtonColor: '##a8a8a8',
      confirmButtonText: 'Yes, Logout!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.get("/user/logout")
        dispatch({ type: "refresh" })
      }
    })
  }

  function validationErr() {

    if (title.replaceAll(' ', "") === "" || url.replaceAll(' ', "") === "") {
      return true
    }
    return false
  }


  React.useEffect(() => {
    (
      async function () {
        try {
          const { data } = await axios.get("/user/viewurls/"+id)
          console.log(data)
          if (!data.err) {
            setUrlList(data.urls)
          }
        }
        catch (err) {
          console.log(err)
        }
      }
    )()
  }, [refresh])
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validationErr()) {
      let { data } = await axios.post('/user/urlsubmit', { title, shortUrl: url ,id})
      console.log(data);
      if (!data.err) {
        alert("success")
        setRefresh(!refresh)
        setTitle("")
        setUrl("")
      } else {
        setErrMessage(data.message)
      }
    }
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('URL copied to clipboard');
        toast.success('URL copied');
      })
      .catch((error) => {
        console.log('Failed to copy URL:', error);
        toast.error('Failed to copy URL');
      });
  };
  
  const handleDelete=(id)=>{
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this URL!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7e3af2',
      cancelButtonColor: '##a8a8a8',
      confirmButtonText: 'Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.get("/user/deleteurl/"+id)
        setRefresh(!refresh)
      }
    })
  }


  return (
    <div>
      <MDBContainer className="my-5">

        <MDBCard>
          <MDBRow className='g-0 login-section'>
          <ToastContainer />

            <MDBCol md='6' className='url-form'>
              <MDBCardBody className='d-flex flex-column url-home-body'>
                <div className="logout" onClick={handleLogout}>
                  <MDBIcon fas icon="sign-out-alt" />Logout
                </div>
                <div className="url-submit-form">
                  <div className='d-flex flex-row mt-2'>
                    <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                  <div className="url-head d-flex flex-column">
                  <span className="h1 fw-bold mb-0">TinyURL</span>
                  <h6 className="fw-normal mt-2" style={{ letterSpacing: '1px' }}>Trim, transform, and triumph with TinyURL</h6>
                  </div>
                  </div>
                  <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Paste Your Link here</h5>
                  <MDBInput wrapperClass='mb-4' label='Title' id='formControlLg' type='text' size="lg" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <MDBInput wrapperClass='mb-4' label='Paste your Link' id='formControlLg' type="text"  size="lg" value={url} onChange={(e) => setUrl(e.target.value)} />
                  <MDBBtn className="mb-4 px-5 url-button" color='dark' size='lg' disabled={validationErr()} onClick={handleSubmit} >Submit</MDBBtn>
                </div>

              </MDBCardBody>
            </MDBCol>

            <MDBCol md='6' className='home-url'>
            <div className="url-text">
            <p className="fw-bold text-center ">Your Recent URLs</p>
            </div>
            {

          urlList[0]? <div className="urls">
            
              { 
                urlList.map((item)=>{
                  return<MDBCard className='w-100 home-url-card'>
                  <MDBCardBody className='url-card' >
                  <MDBCardTitle className='text-success'>{item.title}</MDBCardTitle>
                    <div className="copy-url">
                    <div className="url-detials">
                    <MDBCardText className='card-text'>{item.longUrl}</MDBCardText>
                    <MDBCardText className='card-detials'>created by {item.userId.name} on {new Date(item.createdAt).toLocaleDateString()}.</MDBCardText>
                    </div>
                    <div className="url-icons">
                    <MDBIcon fas icon="copy" className='copy-url-btn' size='lg' onClick={() => handleCopyUrl(item.longUrl)} />
                    <MDBIcon fas icon="trash-alt" className='copy-url-btn' size='lg' onClick={()=>handleDelete(item._id)}  />
                    </div>
                    </div>
                    
                    </MDBCardBody>
                    </MDBCard>
                })
                
                }
            </div>: <h4 className='text-center'>No data availabe</h4>
              }

            </MDBCol>




          </MDBRow>
        </MDBCard>

      </MDBContainer>


    </div>
  )
}

export default UserHome