const mysql=require("mysql")

const con=mysql.createPool({
    connectionLimit:10,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    pass : process.env.DB_PASS,
    database : process.env.DB_NAME  
})

exports.view=(req,res)=>{
    res.render("home");
};

exports.login=(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err;
        const username =req.body.username;
        const password =req.body.password;
        connection.query("select username, password from login_lists where username=?",[username],(err,rows)=>{
            if(rows==""){
                res.render("home",{msg:"Invalid Username"})
            }else if(rows!==""){
                if(rows[0].password==password){
                    return res.render("loginuser", {msg:"Hi! " + rows[0].username})
                }
                res.render("home",{msg:"Incorrect Password"})
            }
        })
    })
};

exports.reguser=(req,res)=>{
    res.render("reguser");
};

exports.save=(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err;
        const{password,cpassword,sq}=req.body;
        const username=req.body.username;
        const email=req.body.email;
        connection.query("select * from login_lists where username=?",[username],(err,rows)=>{
            if(rows!=""){
                res.render("reguser",{msgs:"Username Already Exists"})
            }else if(password==cpassword){
            connection.query("insert into login_lists(username,password,cpassword,email,sq) values(?,?,?,?,?)",[username,password,cpassword,email,sq],(err,rows)=>{
            connection.release();
            if(!err){
                res.render("reguser",{msg:"User details added success"});
            }else{
                console.log("error Listing Data"+err);
            }
        })
    }else{
        res.render("reguser",{msgs:"Password and Confirm password not same"})
    }
})
    })
}

exports.fp=(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err;
        const username =req.body.username;
        const sq =req.body.sq;
        connection.query("select username, sq from login_lists where username=?",[username],(err,rows)=>{
            if(rows==""){
                res.render("forgot_password",{msg:"Invalid Username"})
            }else if(rows!==""){
                if(rows[0].sq==sq){       
                    return  res.redirect('/newpassword/'+ rows[0].username); //res.render("newpassword", {user:rows[0].username});
                }
                res.render("forgot_password",{msg:"Incorrect Answer"})
            }
        })
    })
};

exports.forgot_password=(req,res)=>{
    res.render("forgot_password");
};

exports.newpassword=(req,res)=>{
    res.render("newpassword")
}

exports.changepass=(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err;
        const{password,cpassword}=req.body;
        let username=req.params.username;
        connection.query("update login_lists set password=?,cpassword=? where username=?",[password,cpassword,username],(err,rows)=>{
            connection.release();
            if(!err){
                if(password==cpassword){
                 return res.render("newpassword", {msg:"Password Changed Success"})  
                }
                res.render("newpassword",{msgs:"Password not match"})
            }    
        })
    })
}