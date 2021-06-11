/**
 * @module DatabaseController
 */
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster-database.8fzzj.mongodb.net/shortener?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
           .then( conn => global.conn = conn.db('shortener'))
           .catch( err => console.log (err));

/**
 * Retorna qual é o próximo ID para mantermos um id sequencial
 * @param {string} seqName nome da sequencia que criamos no MongoDB
 * @returns {integer} Valor da próxima sequencia
 */           
async function proximoId(seqName) {
  const sequencia = await global.conn.collection('sequencias').findOneAndUpdate(
      { _id: seqName },
      { $inc: { value: 1 } },
      { returnDocument: 'after' }
  );
  return sequencia.value.value;
}
/**
 * Incrementa a quantidade de acessos que o recurso teve
 * @param {string} collection Coleção que vamos guardar no mongo
 * @param {integer} id Chave numérica que sera usada para encontrar o id e incrementar o numero de acessos que a url teve
 */
async function incrementaHit(collection, id) {
  await global.conn.collection(collection).findOneAndUpdate(
      { _id: id },
      { $inc: { hits: 1 } }
  );  
}

/**
 * Realiza a inserção de um objeto em uma coleção
 * @param {string} collection Coleção que o objeto será inserido 
 * @param {object} data Objeto que será inserido na coleção
 * @returns resultado da inserção 
 */  
async function insert(collection, data) {
  data._id = await proximoId(proximoId)
  return global.conn.collection(collection).insertOne(data);
}

/**
 * Encontra um registro na tabela de links a partir do id
 * @param {string} collection Coleção que vamos buscar
 * @param {string} id String com o id, que será convertido em inteiro
 * @returns O objeto encontrado ou null se não encontrar
 */
function findOne(collection, id) {    
  data = global.conn.collection(collection).findOne({_id: parseInt(id)});
  return data
}

/**
 * Encontra um registro no banco a partir de uma url curta
 * @param {string} collection Nome da coleção que contem os links
 * @param {string} shortUrl Url curta que estamos procurando
 * @returns O objeto encontrado ou null se não encontrar
 */
function findByShortURL(collection, shortUrl) {    
  data = global.conn.collection(collection).findOne({shorturl: shortUrl});
  return data
}

/**
 * Encontra todos os registros criados em uma determinada data
 * @param {string} collection Nome da coleção que contem os links
 * @param {string} data Data da criação no formato YYYY-MM-DD
 * @returns Um array contendo todos os objetos encontrado ou [] null se não encontrar registros
 */
function findByData(collection, data) {    
  data = global.conn.collection(collection).find({data: data}).toArray();
  return data
}
  
module.exports = { findOne, findByShortURL, insert, incrementaHit, findByData }
