import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import HostIP from './host-ip.js'
import open from 'open'
import { resolve } from 'path'

const PORT = Number(process.env.PORT) || 2022
const GAME_URL = `http://${HostIP}:${PORT}/`
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const __dirname = resolve()
const INDEX_PAGE = `${__dirname}/public/index.html`

app.use('/public', express.static('public'))
app.use('/node_modules', express.static('node_modules'))
app.get('/', (req, res) => res.sendFile(INDEX_PAGE))

io.on('connection', (socket) => {
  socket.on('talking', (data) => io.emit('listening', data))
})

httpServer.listen(PORT, () => {
  console.log('Listening on ', GAME_URL)
  open(`${GAME_URL}`)
})
