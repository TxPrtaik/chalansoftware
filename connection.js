let mysql=require("mysql")
let util=require("util")
let con=mysql.createConnection({
    "host":"biuiowq04vtryrmrqkwz-mysql.services.clever-cloud.com",
    "user":"uvrafei5oreyagdm",
    "password":"bsx5flrCuvvhroLQDPSX",
    "database":"biuiowq04vtryrmrqkwz"
})
module.exports=util.promisify(con.query).bind(con)
