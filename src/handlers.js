const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  let finished = false

  if (pageCount === readPage) {
    finished = true
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.header('Content-Type', 'application/json')
    response.code(201)

    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal untuk menambahkan buku'
  })

  response.code(400)
  return response
}

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let bookFilter = JSON.parse(JSON.stringify(books))

  if (name !== undefined) {
    bookFilter = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading !== undefined) {
    if (reading === '0') {
      bookFilter = books.filter((book) => book.reading === false)
    } else {
      bookFilter = bookFilter.filter((book) => book.reading === true)
    }
  }

  if (finished !== undefined) {
    if (finished === '0') {
      bookFilter = books.filter((book) => book.finished === false)
    } else {
      bookFilter = books.filter((book) => book.finished === true)
    }
  }
  console.log(finished)

  const response = h.response({
    status: 'success',
    data: {
      books: bookFilter.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })

  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const isFind = books.filter((book) => book.id === bookId).length > 0

  if (isFind) {
    const book = books.filter((book) => book.id === bookId)[0]
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  let finished = false
  const updatedAt = new Date().toISOString()

  const indexBook = books.findIndex((book) => book.id === bookId)

  if (indexBook !== -1) {
    if (pageCount === readPage) finished = true

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })

      response.code(400)
      return response
    }

    if (name === undefined || name === '') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })

      response.code(400)
      return response
    }

    const book = books[indexBook]
    books[indexBook] = {
      ...book,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const bookIndex = books.findIndex((book) => book.id === bookId)

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler
}
