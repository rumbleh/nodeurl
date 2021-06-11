/**
 * @module EncurtadorController
 */

require('dotenv/config');
const nanoid  = require('nano-id')
const db = require('./DatabaseController');

/**
 * Função que encurta uma URL e salva no banco de dados
 * @param {string} url Url que será encurtada
 */
function encurtar(url){
  
  link = {
    shorturl: nanoid(8),
    longurl: url,
    hits: 0,
    data: new Date().toISOString().slice(0, 10)
  }
  
  db.insert('links', link)

  return link
}

/**
 * Função que encurta uma URL e salva no banco de dados
 * @param {string} url Url que será encurtada
 */
 function getByID(id){  
    return db.findOne('links', id)
  }


/**
 * Funcao que recupera o registro a partir de uma ShortUrl
 * @param {string} shorturl URL curta para ser localizado
 * @returns objeto com o registro
 */
function getByShortURL(shorturl) {
  return db.findByShortURL('links', shorturl)
}


/**
 * Funcao que recupera todos os registros a partir de uma data
 * @param {string} data Data no formato YYYY-MM-DD em que os registros foram criados
 * @returns objeto com todos os registros
 */
 function buscaPorData(data) {
  return db.findByData('links', data)
}

/**
 * Incrementa a quantidade de acessos de uma URL curta
 * @param {integer} _id Id para acessar o registro
 */
function incrementaHit(_id) {
  db.incrementaHit('links', _id)
}

module.exports = { encurtar, getByID, getByShortURL, incrementaHit, buscaPorData }