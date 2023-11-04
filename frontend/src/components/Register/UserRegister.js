import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
}
  from 'mdb-react-ui-kit';
import VerifyOtp from '../VerifyOtp/verifyOpt';
import { Link } from 'react-router-dom';

function UserRegister() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [errMessage, setErrmessage] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const dispatch = useDispatch()

  function validationErr() {

    if (email.replaceAll(' ', "") === "" || password.replaceAll(' ', "") === "" || name.replaceAll('', "") === "" || phoneNo.replaceAll('', "") === "") {
      return true
    }
    return false
  }
  
  async function handleSubmit(e) {
    console.log("hii")
    e.preventDefault();
    if (!validationErr()) {
      console.log("hjuiuu");
      let { data } = await axios.post("/user/signUp", { email })

      if (data.err) {
        setErrmessage(data.message)
      } else {
        setShowOtp(true)
        dispatch({ type: "refresh" })
      }
    }
  }
  return (
    <div className="register-section">

      {

        !showOtp ? <MDBContainer className="my-5">

          <MDBCard>
            <MDBRow className='g-0 login-section'>

              <MDBCol md='6' className='login-image'>
                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100' />
              </MDBCol>

              <MDBCol md='6' className='login-form'>
                <MDBCardBody className='d-flex flex-column login-form-body'>

                  <div className='d-flex flex-row mt-2'>
                    <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                    <span className="h1 fw-bold mb-0">TinyURL</span>
                  </div>

                  <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Create  a new  account</h5>
                  {
                    errMessage &&
                    <div className="login-row" style={{ justifyContent: "flex-start" }}>
                      <p className='text-danger'>{errMessage}</p>
                    </div>
                  }
                  <MDBInput wrapperClass='mb-4' label='Name' id='formControlLg' type='email' size="lg" value={name} onChange={(e) => setName(e.target.value)} />
                  <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <MDBInput wrapperClass='mb-4' label='Phone Number' id='formControlLg' type='email' size="lg" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                  <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <MDBBtn className="mb-4 px-5" color='dark' size='lg' disabled={validationErr()} onClick={handleSubmit}>Login</MDBBtn>

                  <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Do you have an account? <Link to='/login' style={{ color: '#393f81' }}>Login Here</Link></p>



                </MDBCardBody>
              </MDBCol>

            </MDBRow>
          </MDBCard>

        </MDBContainer> : <VerifyOtp data={{ name, email, password, phoneNo }} />
      }
    </div>

  );
}

export default UserRegister;