const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const ejs=require('ejs');
const fetch=require("node-fetch");
require('dotenv').config();
const response = require("express");
const app=express();

 
const  port=process.env.PORT || 3000;
 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

 app.set('view engine','ejs');
 app.set('views', 'public/views');

app.get("/",function(req,res)
{
    res.sendFile(__dirname+ "/index.html");
});
const myAPI_KEY=(process.env.MY_API_KEY);
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

 function generateRandomDate() {

    var now = new Date(); //right now
    var min = new Date(1995, 5, 16).getTime(); // 1995 June 16 00:00:00, the first APOD
    var max = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 59, 59, 999).getTime(); // now converted UTC time at 03:59:59.999

    //taking off 6 hours because APOD goes by east coast USA time.
    //should be enough to keep anyone from landing on future APODs which won't be published yet in their timezone
    //unless their computer clock is set way off, then they'll get 404's all the time probably
    max = max - (5 * 60 * 60 * 1000);

    var randomDate = Math.round(min + (Math.random() * (max - min))); //ahh, a random APOD date!

    //but wait...
    //there's one section of missing APODs in the history of APODs
    //that's the first three days after the very first APOD was posted
    //June 17th, 18th, & 19th, 1995
    var missingMin = new Date(1995, 5, 17).getTime(); //1995 June 17 00:00:00
    var missingMax = new Date(1995, 5, 19, 23, 59, 59, 999).getTime(); //1995 June 19 23:59:59.999

    //if our random date falls in this range, remake it.
    while (randomDate >= missingMin && randomDate <= missingMax) {
        randomDate = Math.round(min + (Math.random() * (max - min)));
    }

    //convert the timestamp back into a date object
    randomDate = new Date(randomDate);
    this.random_year = randomDate.getFullYear().toString().slice(); //in the year 2095 we're gonna have problems :)))
    this.random_month = (0 + (randomDate.getMonth() + 1).toString()).slice(-2); //zero pad the month
    this.random_day = (0 + (randomDate.getDate().toString())).slice(-2); //zero pad the day


    this.randomApodDate = this.random_year + '-' + this.random_month + '-' + this.random_day;
    return this.randomApodDate;
}

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);

today.toDateString();
yesterday.toDateString();
previous_day = yesterday.getDate().toString();
year = yesterday.getFullYear().toString();
month=(yesterday.getMonth()+1).toString();
previousdate=year+"-"+month+"-"+previous_day;

app.get("/previous", function(req,res)
{

     var curl2=url+myAPI_KEY+"&date="+previousdate;
       fetch(curl2)
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

app.get("/random", function(req,res)
{
    var randomdate=generateRandomDate();
    var curl1=url+myAPI_KEY+"&date="+randomdate;
   

       fetch(curl1)
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
















