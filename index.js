let express=require("express")
let app=express()
let mysql=require("mysql")
let jwt=require("jsonwebtoken")
let cookieparser=require("cookie-parser")
let exe=require('./connection')

let bodyparser=require("body-parser")
app.use(express.static("public/"))
app.use(express.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cookieparser())

function authenticAdmin(req,res,next){
let token=req.cookies.token
if (!token) return res.redirect("/login")
jwt.verify(token,"pratik@123",(err,user)=>{
    if(err){
   res.redirect("/login")
    }
    else{
        req.user=user
        next()
    }
})
}


app.get("/login",async(req,res)=>{
  console.log(req.query)
  res.render("login.ejs")
})
app.post("/user-login",async(req,res)=>{
    let {username,password}=req.body;
//  let d=await exe(`insert into admin(username,password) values('${username}','${password}')`);
let d=await exe(`select*from admin where username='${username}' and password='${password}'`)
if (d.length!=0){
  let token= jwt.sign({"id":d[0].id},"pratik@123",{expiresIn:"1h"})
    res.cookie("token",token);
    res.redirect("/")
}
else{
res.redirect("/login?err=wrongcredential")
}


})
app.get("/",authenticAdmin,async(req,res)=>{
    res.redirect("/make-chalan")
})
app.get("/make-chalan",authenticAdmin,async(req,res)=>{
  

    


    res.render("makechalan.ejs");
})
app.post("/save-invoice",async(req,res)=>{
    let b=req.body;
    let addChalan=await exe(`insert into chalan(receiverName,receiverMobile,vehicleNo,cgstRate,sgstRate,subtotal,cgstAmt,sgstAmt,total,invoiceDate) values(
     '${b.receiverName}',
     '${b.receiverMobile}',
     '${b.vehicleNo}',
     '${b.cgstRate}',
     '${b.sgstRate}',
     '${b.subtotal}',
     '${b.cgstAmt}',
     '${b.sgstAmt}',
     '${b.total}',
     '${b.invoiceDate}'
  
     )`)

 for(let i=0;i<b.products.length;i++){
 let pro=b.products[i]
 let insertPro=await exe(`insert into products(product,qty,rate,amount,cid) values('${pro.product}',
     '${pro.qty}','${pro.rate}','${pro.amount}','${addChalan.insertId}')`)
 }


    res.status(200).json({"id":addChalan.insertId});
  
})
app.get("/invoice/:id",authenticAdmin,async(req,res)=>{
    let chalan=await exe(`select*from chalan where id='${req.params.id}'`);
    let pro=await exe(`select*from products where cid='${req.params.id}'`)
    let obj={
        "det":chalan[0],
        "pro":pro
    }
    
    
    res.render("invoice.ejs",obj)
})

app.get("/history",authenticAdmin,async(req,res)=>{
    let his=await exe(`select*from chalan `)
    let obj={
"his":his
    }
res.render("history.ejs",obj)
})
app.get("/delete-chalan/:id",authenticAdmin,async(req,res)=>{
    await exe(`delete from chalan where id='${req.params.id}'`)
    res.redirect("/history")
})
app.get("/logout",authenticAdmin,async(req,res)=>{
     res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.redirect("/")
})

app.listen(1000)