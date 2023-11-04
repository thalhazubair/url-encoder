import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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
import axios from 'axios';



function VerifyOtp(props) {
    const [otp, setOtp] = useState()
    const [errMessage, setErrMessage] = useState("")
    const dispatch = useDispatch()
    function validationErr() {

        if (otp.replaceAll(' ', "") === "") {
            return true
        }
        return false
    }
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(otp, props.data)
        let { data } = await axios.post("/user/verify", { otp, ...props.data })
        if (data.err) {
            setErrMessage(data.message)
        } else {
            dispatch({ type: "refresh" })
        }
    }
    return (
        <MDBContainer className="my-5">

            <MDBCard>
                <MDBRow className='g-0 login-section'>

                    <MDBCol md='6' className='login-image'>
                        <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100' />
                    </MDBCol>

                    <MDBCol md='6' className='login-form'>
                        <MDBCardBody className='d-flex flex-column login-form-body'>

                            <div className='d-flex flex-row mt-2'>
                                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                                <span className="h1 fw-bold mb-0">Url Shortner</span>
                            </div>

                            <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Verify your email</h5>

                            <MDBInput wrapperClass='mb-4' label='Enter the OTP' id='formControlLg' type='password' size="lg" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            {
                                errMessage &&
                                <div className="login-row" style={{ justifyContent: "flex-start" }}>
                                  <p className='text-danger'>{errMessage}</p>
                                </div>
                              }
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleSubmit}>Submit</MDBBtn>




                        </MDBCardBody>
                    </MDBCol>

                </MDBRow>
            </MDBCard>

        </MDBContainer>
    )
}

export default VerifyOtp