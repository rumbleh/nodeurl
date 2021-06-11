const express = require('express')
const app = express()
const rotas = require('./src/Routes/routes')
require('dotenv/config');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./src/Routes/routes')(app)

app.listen(8080, () => console.log('Servidor escutando na porta 8080')) 