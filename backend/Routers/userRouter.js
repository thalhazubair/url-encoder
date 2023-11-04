import express from 'express'
import { checkUserLoggedIn, getDeleteUrl, getLongUrl, getViewUrls, urlSubmit, userLogin, userLogout, userOtpVerify, userSignup } from '../Controllers/userController.js'
const router=express.Router()


router.post('/signup',userSignup)
router.post('/verify',userOtpVerify)
router.get("/check",checkUserLoggedIn)
router.get('/logout',userLogout)
router.post('/login',userLogin)
router.post('/urlsubmit',urlSubmit)
router.get('/viewurls/:id',getViewUrls)
router.get('/geturl/:id',getLongUrl)
router.get('/deleteurl/:id',getDeleteUrl)


export default router