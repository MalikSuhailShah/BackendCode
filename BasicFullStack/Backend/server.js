import express from 'express'

const app = express()

app.get('/', (req, res) =>{
    res.send('Server is Ready')
})

//get a list of 5 jokes
app.get('/api/jokes', (req, res) => {
    const jokes=[
        {
            id:1,
            title: 'A joke',
            content:'first joke'
        },       
        {
            id:2,
            title: 'B joke',
            content:'Sedcond joke'
        },
        {
            id:3,
            title: 'C joke',
            content:'Third joke'
        },
        {
            id:4,
            title: 'D joke',
            content:'Fouth joke'
        },
        {
            id:5,
            title: 'E joke',
            content:'Fifth, joke'
        }
]

    res.json(jokes)
})

const Port = process.env.PORT || 4000;

app.listen(Port, () => {
    console.log(`Server at http://localhost:${Port}`)
})