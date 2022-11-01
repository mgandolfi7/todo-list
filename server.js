const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    uri = process.env.MONGODB_URI,
    dbName = 'todo-list'

MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (req, res)=>{
    const todoItems = await db.collection('tasks').find().toArray()
    const itemsLeft = await db.collection('tasks').countDocuments({completed: false})
    res.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (req, res) => {
    db.collection('tasks').insertOne({thing: req.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (req, res) => {
    db.collection('tasks').updateOne({thing: req.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (req, res) => {
    db.collection('tasks').updateOne({thing: req.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (req, res) => {
    db.collection('tasks').deleteOne({thing: req.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        res.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})