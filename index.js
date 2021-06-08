const express = require('express')
const app = express()
const db = require('./db')
require('dotenv/config');

app.use(express.json())

app.get('/created_at', async function (req, res) {  
  
  result = await db.buscaPorData(req.query.data)
  if (result.length === 0){
    res.status(404).end()
  }
  res.json(result)      

})

app.get('/:shorturl', async function (req, res) {  
  
  result = await db.buscaPorShorturl(req.params.shorturl)
  
  if (result.length === 0){
    res.status(404).end()
  }
  saida = await db.incrementaHit(result[0].id)
  
  res.json({longurl: result[0].longurl})      

})

app.get('/id/:id', async function (req, res) {  
  
  result = await db.buscaPorId(req.params.id)
  if (result.length === 0){
    res.status(404).end()
  }
    
  res.json(result[0])      

})

app.post('/create', async function (req, res)  {    

  result = await db.encurtar(req.body.longurl)
  res.json(result)      

})

app.listen(3000, () => console.log('Servidor escutando na porta 3000')) 

