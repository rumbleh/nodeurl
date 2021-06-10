const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster-database.8fzzj.mongodb.net/shortener?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
           .then( conn => global.conn = conn.db('shortener'))
           .catch( err => console.log (err));

           
async function proximoId(seqName) {
  const sequencia = await global.conn.collection('sequencias').findOneAndUpdate(
      { _id: seqName },
      { $inc: { value: 1 } },
      { returnDocument: 'after' }
  );
  return sequencia.value.value;
}

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

function findOne(collection, id) {    
  data = global.conn.collection(collection).findOne({_id: parseInt(id)});
  return data
}

function findByShortURL(collection, shortUrl) {    
  data = global.conn.collection(collection).findOne({shorturl: shortUrl});
  return data
}

function findByData(collection, data) {    
  data = global.conn.collection(collection).find({data: data}).toArray();
  return data
}

function findAll() {
  return global.conn.collection("links").find().toArray();
}

function update(id, link) {
    return global.conn.collection("links").updateOne({ _id: new ObjectId(id) }, { $set: link });
}

function deleteOne(id) {
  return global.conn.collection("links").deleteOne({ _id: new ObjectId(id) });
}
  
module.exports = { findOne, findByShortURL, findAll, insert, update, deleteOne, incrementaHit, findByData }
/*
async function connect(){
  if (global.connection && global.connection.state !== 'disconnected')
    return global.connection

  const mysql = require('mysql2/promise')
  const connection = await mysql.createConnection(
    `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  )
  global.connection = connection
  return connection
}

async function pesquisa_urllong (longurl){
  const conn = await connect()
  const sql = 'select * from links where longurl = ? limit 1'
  const [rows] = await conn.query(sql, [longurl])
  return rows
}

async function buscaPorData (data){
  const conn = await connect()
  inicial = data + ' 00:00'
  final = data + ' 23:59:59'
  const sql = 'select * from links where created_at >= ? and created_at <= ?'
  const [rows] = await conn.query(sql, [inicial, final])
  return rows
}

async function buscaPorId (id){
  const conn = await connect()
  const sql = 'select * from links where id = ?'
  const [rows] = await conn.query(sql, [id])
  return rows
}

async function incrementaHit (id){
  const conn = await connect()
  const sql = 'update links set hits = hits + 1 where id = ?'
  return await conn.query(sql, [id])  
}

async function buscaPorShorturl (id){
  const conn = await connect()
  const sql = 'select * from links where shorturl = ?'
  const [rows] = await conn.query(sql, [id])
  return rows
}

async function encurtar(longurl){
  pesquisa = await pesquisa_urllong(longurl)
  if (pesquisa.length){
    link = {
      shorturl: process.env.URL_BASE + pesquisa[0].shorturl,
      longurl: pesquisa[0].longurl 
    }
    return link
  }
  
  id = nanoid(8)

  const conn = await connect()
  const sql = 'insert into links (shorturl, longurl) values (?,?)'
  const result = await conn.query (sql, [id, longurl])  

  link = {
    shorturl: process.env.URL_BASE + id,
    longurl: longurl 
  }

  return link
  
}
module.exports = {encurtar, buscaPorData, buscaPorId, buscaPorShorturl, incrementaHit}
*/