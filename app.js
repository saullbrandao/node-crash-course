const express = require('express')

const app = express()

// register view engine
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  const blogs = [
    { title: 'Title 1', snippet: 'Lorem ipsum dolor sit amet consectetur.' },
    { title: 'Title 2', snippet: 'Lorem ipsum dolor sit amet consectetur.' },
    { title: 'Title 3', snippet: 'Lorem ipsum dolor sit amet consectetur.' },
  ]
  res.render('index', {
    title: 'Home',
    blogs,
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
  })
})

app.get('/blogs/create', (req, res) => {
  res.render('create', {
    title: 'Create a new Blog',
  })
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404',
  })
})

app.listen('8080', () => {
  console.log('🚀 listening for requests on port 8080')
})
