require('dotenv').config()

const express = require('express'); // import express from 'express'

const app = express()

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter', (req, res) => {
    res.send("MalikDotCo")
})

app.get('/login', (req, res) =>{
    res.send("<h1>Please Login To Your Account</h1>")
})

app.get("/api/users", (req, res) => {
    res.json([
        { name: "Suhail", age: 21 },
        { name: "Rahul", age: 22 }
    ]);
});
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})