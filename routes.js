module.exports = function(app) {
  'use strict';

  const encurtador = require('./Controllers/EncurtadorController');

   app.post('/link', async function (req, res)  {      
           
    // #swagger.description = 'Endpoint para encurtar uma URL longa.'
    /* #swagger.parameters['longurl'] = {
               in: 'body',
               required: true,
               example: 'http://www.example.com',
               description: 'URL longa que deseja-se encurtar.',
               type: 'object'
    } */

    res.json(await encurtador.encurtar(req.body.longurl))      
  })
  
  app.get('/links/:id', async function (req, res) {  
      
    // #swagger.description = 'Endpoint para recuperar uma URL encurtada a partir de um ID numérico.'
    /* #swagger.parameters['id'] = {
               required: true,
               example: '1',
               description: 'ID numérico que aponta para uma entrada no banco de dados.',
               type: 'number'
    } */

    var result = await encurtador.getByID(req.params.id)
    
    if (result === null){
      res.status(404).end() 
      return   
    }
      
    res.json(result)
  })
  
  app.get('/search/created_at', async function (req, res) {  
  
    // #swagger.description = 'Endpoint para pesquisar URLs criadas em uma data específica.'
    /* #swagger.parameters['data'] = {
               required: true,
               type: 'date',
               pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/,
               example: '2021-06-10',
               description: 'Data que será realizada a busca. Formato YYYY-MM-DD.',
        
    } */

    var result = await encurtador.buscaPorData(req.query.data)
    
    if (result === null || result.length == 0){
      res.status(404).end()    
      return
    }
         
    res.json(result)
    
  })
  
  app.get('/:shorturl', async function (req, res) {  
        
    // #swagger.description = 'Endpoint para recuperar a url grande a partir de uma url curta.'
    // #swagger.parameters['shorturl'] = { description: 'URL curta que será pesquisada.' }

    var result = await encurtador.getByShortURL(req.params.shorturl)
    
    if (result === null){
      res.status(404).end()
      return    
    }    
      
    encurtador.incrementaHit(result._id)
    
    result.hits++
  
    res.json(result)
  })
  
  return app;
}