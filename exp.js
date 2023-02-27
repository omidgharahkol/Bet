const express = require('express')
const app = express()
const port = 3030

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log()
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})