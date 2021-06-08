require('dotenv/config');
const nanoid  = require('nano-id')

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