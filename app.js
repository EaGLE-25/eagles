const http = require("http");
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const { rejects } = require("assert");

const server = http.createServer((req,res)=>{
   render(req,res);
});

async function render(req,res){
  let fileName = await getFileName(req.url);
  let filePath = path.join(__dirname,"views",fileName);
  let extension = path.extname(filePath);
  let contentType = getContentType(extension);

  fs.readFile(filePath,"utf8",(err,data)=>{
    if(err){
      console.log(err);
    }else{
      res.writeHead(200,{"Content-Type":contentType});
      res.end(data);
    }
  })

}

function getContentType(extention){
  switch(extention){
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
  }
}

function getFileName(url){
  if(url === "/") return "index.html";
  url = url.substring(1);
  return new Promise((resolve,reject)=>{
    fs.readdir(path.join(__dirname,"views"),(err,files)=>{
      if(err){
        console.log(err);
      }else{
        files.forEach(fileName=>{
          if(fileName.includes(url)) resolve(fileName);
        })
        resolve("404.html");
      }
    })
  })
}

const PORT = 5000 || process.env.PORT;

server.listen(PORT,()=>{console.log("server started")});