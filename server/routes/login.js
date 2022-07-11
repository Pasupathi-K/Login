const express=require('express');
const router=express.Router();
const logincontroller=require("../controller/login-controll")


router.get('/',logincontroller.view);
router.post('/',logincontroller.login);
router.get("/reguser",logincontroller.reguser);
router.post('/reguser',logincontroller.save);
router.get("/forgot_password",logincontroller.forgot_password);
router.post("/forgot_password",logincontroller.fp);
router.get("/newpassword/:username", logincontroller.newpassword)
router.post("/newpassword/:username",logincontroller.changepass)
module.exports=router;