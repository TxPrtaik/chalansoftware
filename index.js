let express=require("express")
let app=express()
let mysql=require("mysql")

let exe=require('./connection')

let bodyparser=require("body-parser")
app.use(express.static("public/"))
app.use(express.json())
app.use(bodyparser.urlencoded({extended:true}))

app.get("/",async(req,res)=>{
    res.redirect("/make-chalan")
})
app.get("/make-chalan",async(req,res)=>{
  

    


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
app.get("/invoice/:id",async(req,res)=>{
    let chalan=await exe(`select*from chalan where id='${req.params.id}'`);
    let pro=await exe(`select*from products where cid='${req.params.id}'`)
    let obj={
        "det":chalan[0],
        "pro":pro
    }
    
    
    res.render("invoice.ejs",obj)
})

app.get("/history",async(req,res)=>{
    let his=await exe(`select*from chalan `)
    let obj={
"his":his
    }
res.render("history.ejs",obj)
})
app.get("/delete-chalan/:id",async(req,res)=>{
    await exe(`delete from chalan where id='${req.params.id}'`)
    res.redirect("/history")
})
app.listen(1000)