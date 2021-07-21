const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const { render } = require('ejs')
require('dotenv').config()

const app = express()

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sgvpm.mongodb.net/node-crash-course?retryWrites=true&w=majority`
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen('8080', () => {
      console.log('🚀 listening for requests on port 8080')
    })
  })
  .catch(err => console.log(err))

// register view engine
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs')
})

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' })
})

// blog routes
app.get('/blogs', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(result => {
      res.render('index', {
        title: 'All Blogs',
        blogs: result,
      })
    })
    .catch(err => console.log(err))
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog' })
})

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body)
  blog
    .save()
    .then(result => {
      res.redirect('/blogs')
    })
    .catch(err => console.log(err))
})

app.get('/blogs/:id', (req, res) => {
  const { id } = req.params
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' })
    })
    .catch(err => {
      console.log(err)
    })
})

app.delete('/blogs/:id', (req, res) => {
  const { id } = req.params
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' })
    })
    .catch(err => console.log(err))
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' })
})
