const express = require('express')

const randomstring = require("randomstring");
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const path = require('path');
const { ConnectionPoolClosedEvent } = require('mongodb');





const app = express()
const port = 80


// Database connection 
mongoose.connect(

  `mongodb+srv://aman:PfMvfcvZe8lpvbEc@cluster0.pi6cul1.mongodb.net/url_shortner?retryWrites=true&w=majority`

)


const schema = new mongoose.Schema({
  url: { type: "String" },
  generated_url: { type: "String" }
})

const url_shortner = mongoose.model('url_shortner', schema)



app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {

  res.send("started the server")
})
app.get('/index.html', async (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})


app.post('/urlshortner42.netlify.app/', async (req, res) => {
  let url = req.body.url
  const generated_string = randomstring.generate(7);
  



  try {
    const data = new url_shortner({
      url: req.body.url,
      generated_url: generated_string,
    })
    const check = await url_shortner.find({url})
    console.log(check[0].generated_url,"in check")
    
    if(check){
      
      res.send(`link is already shorten for given link please visit this link    http://localhost/` + check[0].generated_url)
      res.redirect(check[0].url)
    }else{
      const result = await data.save()
      res.send(`http://localhost/` + result.generated_url)

    }

    


  
  }
  catch (error) {
    console.log(error)
  }

})


app.get('/urlshortner42.netlify.app/:generated_url', async (req, res) => {

  
  const generated_url = req.params.generated_url
 
  console.log(generated_url)
  const result = await url_shortner.findOne({ generated_url })
  res.redirect(result.url)


})



app.listen(port, () => {
  console.log(`server is started on ${port}`)
})