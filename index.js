const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const ejs=require('ejs');
const fetch=require("node-fetch");
require('dotenv').config();
const response = require("express");
const app=express();
app.disable('etag');
 
const  port=process.env.PORT || 3000;
 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

 app.set('view engine','ejs');
 app.set('views', 'public/views');

app.get("/",function(req,res)
{
    res.sendFile(__dirname+ "/index.html");
});
const myAPI_KEY=(process.env.API_KEY);
const url="https://api.nasa.gov/planetary/apod?api_key=";
const curl=url+myAPI_KEY;

app.get("/addendum", function(req,res)
{
   

       fetch(curl)
      .then(response=>response.json())
      .then(data=>{ 
        res.render("index3",{info : {
            body: data.explanation,
            imgurl : data.url, 
            heading: data.title,
            date :data.date
        }
            
        });
        
      }).catch(error=>{
          console.log(error);
      });
   
   
});
app.get("/celestial",function(req,res)
{
    res.sendFile(__dirname+ "/public/celestial.html");
    
});
app.get("/icon",function(req,res)
{
    res.sendFile(__dirname+ "/index.html");
    
});
app.get("/celestial/fireball",function(req,res)
{
    var i;
    fetch("https://ssd-api.jpl.nasa.gov/fireball.api?limit=60")
    .then(response=>response.json())
    .then(data=>{
        var data1=[];
          for(i=0;i<data.data.length;i++)
           {
              data1.push(data.data[i]);
           }
           res.render("index1",{set :data1});
           
    }).catch(error=>{
        console.log(error);
    });


});
app.get("/celestial/cad",function(req,res)
{
    var i;
    fetch("https://ssd-api.jpl.nasa.gov/cad.api?dist-max=10LD&date-min=2018-01-01&sort=dist&limit=60&body=ALL&fullname=true")
    .then(response=>response.json())
    .then(data=>{
        var data1=[];
          for(i=0;i<data.data.length;i++)
           {
              data1.push(data.data[i]);
           }
           res.render("index2",{set :data1});
           
    }).catch(error=>{
        console.log(error);
    });


});






app.listen(port,function()
{
    console.log(`Server is running on port ${port}`);
});

















