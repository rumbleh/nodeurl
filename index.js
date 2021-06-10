const express = require('express')
const app = express()
const rotas = require('./routes')
require('dotenv/config');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./routes')(app)

app.listen(3000, () => console.log('Servidor escutando na porta 3000')) 