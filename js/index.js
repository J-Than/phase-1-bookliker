// Declare global variables
const db = 'http://localhost:3000/books';
let currentBook;
let currentBookDetails = {};
let liked;

// Set DOM interaction constants
const bookList = document.getElementById('list');
const showPanel = document.getElementById('show-panel');

// Initialize
fetchBooks();

// Fetch books
function fetchBooks() {
  fetch(db)
  .then(resp => resp.json())
  .then(json => makeBookList(json));
}

// Populate book list
function makeBookList(books) {
  for (book of books) {
    let a = document.createElement('li');
    a.textContent = book.title;
    a.id = book.id;
    a.addEventListener('click', e => selectBook(e));
    bookList.appendChild(a);
  }
}

// Select new book
function selectBook(e) {
  e.preventDefault();
  currentBook = e.target.id;
  fetchDetails();
}

// Fetch book details
function fetchDetails() {
  showPanel.replaceChildren();
  fetch(`${db}/${currentBook}`)
  .then(resp => resp.json())
  .then(json => displayBook(json));
}

// Display book details
function displayBook(book) {
  currentBookDetails = book;
  let a = document.createElement('img');
  let b = document.createElement('h4');
  let c = document.createElement('h4');
  let d = document.createElement('h4');
  let e = document.createElement('p');
  let f = document.createElement('ul');
  let h = document.createElement('button');
  let userArray = [];
  a.src = book.img_url;
  b.textContent = book.title;
  if (book.subtitle) {c.textContent = book.subtitle};
  d.textContent = book.author;
  e.textContent = book.description;
  for (user of book.users) {
    let g = document.createElement('li');
    g.textContent = user.username;
    f.appendChild(g);
    userArray.push(user.id)
  }
  liked = userArray.find(id => id === 1);
  console.log(liked);
  h.textContent = `${liked ? 'UNLIKE' : 'LIKE'}`
  h.addEventListener('click', () => liker());
  showPanel.appendChild(a);
  showPanel.appendChild(b);
  if (book.subtitle) {showPanel.appendChild(c)};
  showPanel.appendChild(d);
  showPanel.appendChild(e);
  showPanel.appendChild(f);
  showPanel.appendChild(h);
}

// Like handler
function liker() {
  if (!liked) {
    currentBookDetails.users.push({
      id: 1,
      username: 'pouros'
    })
  } else {
    currentBookDetails.users.pop()
  }
  fetch(`${db}/${currentBook}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      users: currentBookDetails.users
    }),
  })
  .then(resp => fetchDetails(resp));
}

