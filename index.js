const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')



connectToMongo();

const app = express()
const port = process.env.PORT || 5001;

app.use(cors())
app.use(express.json()) 

app.get('/', (req, res) => {
  res.send('Hello Vishesh!')
})

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// 3: Step heroku
  if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
  }

app.listen(port, () => {
  console.log(`eNotebook backend app listening on port http://localhost:${port}`)
  
})
