import { join } from "path";
import express from "./myExpress";
const app = express();
//const port = 8080;
const port = 3000;
const LOCAL_DB= 'etud.json'



app.use((req, res, next) => {
    console.log("First Middleware");
    next();
});
app.use((req, res, next) => {
    console.log("Second Middleware");
    next();
});

app.get("/", (req, res) => {
    res.json({ route: "Route / GET" });
    const {query} = url.parse(req.url,true)
  const {name} = query
  res.write(`<h1>Hello ${name || 'World' }</h1>`)  
  })

app.get('/hello', function (req, res) {
      
  app.render('home',{name:'xxx'}, (err, html) => {
    if(err){
      res.write(err)
    }
    else{
      res.write(html)
    }
  
  })

  })


app.post("/etud", (req, res) => {
    res.send({ route: "Route / POST" });
    data =""
    req.on('data', chunk => {
        data +=chunk.toString()
    })
    req.on("end", ()=>{
        if (data){
          user=JSON.parse(data) 
          if(fs.existsSync(LOCAL_DB)){
              const json = require(`./${LOCAL_DB}`)
              
//afin d'eviter les doublons
              const  max_id = Object.entries(json).length === 0 ? 0 : Math.max.apply(Math, json.map(obj => obj.id))   
                     
              user.id = max_id +1 
              json.push(user)
              data = json
          }
          else{
          user.id = 1 
          data = [user]
        }
        fs.writeFileSync(LOCAL_DB,JSON.stringify(data,null,' '))
        
        }     
    })
  })


app.put("/test", (req, res) => {
    res.html("test PUT");
});
app.delete("/test", (req, res) => {
    res.html("test DELETE");
});
app.all("/all", (req, res) => {
    res.html(`Route /all ${req.method}`);
});

app.listen(port, () => {
    console.log("Server started !");
});
