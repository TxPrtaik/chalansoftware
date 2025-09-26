let express=require("express")
let app=express()
let mysql=require("mysql")

let exe=require('./connection')
let bodyparser=require("body-parser")
app.use(express.json())
app.use(bodyparser.urlencoded({extended:true}))

app.get("/",async(req,res)=>{
    res.render("index.ejs");
})
app.get("/make-chalan",async(req,res)=>{
    res.render("makechalan.ejs");
})
app.post("/save-invoice",async(req,res)=>{
    let b=req.body;
//    let addChalan=await exe(`insert into chalan(receiverName,receiverMobile,vehicleNo,cgstRate,sgstRate,subtotal,cgstAmt,sgstAmt,total,invoiceDate) values(
//     '${b.receiverName}',
//     '${b.receiverMobile}',
//     '${b.vehicleNo}',
//     '${b.cgstRate}',
//     '${b.sgstRate}',
//     '${b.subtotal}',
//     '${b.cgstAmt}',
//     '${b.sgstAmt}',
//     '${b.total}',
//     '${b.invoiceDate}'
  
//     )`)

// for(let i=0;i<b.products.length;i++){
// let pro=b.products[i]
// let insertPro=await exe(`insert into products(product,qty,rate,amount,cid) values('${pro.product}',
//     '${pro.qty}','${pro.rate}','${pro.amount}','${addChalan.insertId}')`)
// }


    //res.send(req.body)
  res.send("true")  
})
app.get("/invoice",async(req,res)=>{
    res.render("invoice.ejs")
})
app.listen(1000)