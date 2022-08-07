document.addEventListener("DOMContentLoaded", function() {
    fetchBooks()
 });
  
 function fetchBooks() {
    const ul = document.getElementById("list")
    fetch(`http://localhost:3000/books`)
    .then(response => response.json())
    // .then(response => console.log(response))
    .then(response => {
        for(let book of response) {
            // console.log(book)
        // using for..of
        const li = document.createElement("li")
        li.textContent = book.title
        // li.id is in reference to the id attribute html and will set that to equal to book.id from dbjson so that each li has its own if that we can reference to pass in that book id so we can grab that
        li.id = book.id
        // click event listener
        li.addEventListener("click", e => showBookDetails(e, book))
        ul.append(li)
 }})
 }
  
 function showBookDetails(e, book) {
    e.preventDefault()
       // using getElementById vs querySelctore because qselector will have to be detailed such as ("#id") #
       const showPanel = document.getElementById("show-panel")
       const img = document.createElement("img")
       img.src = book.img_url
       img.alt = book.title
       // description to be displayed
       const p = document.createElement('p')
       p.textContent = book.description
       // create two elements
       // ul unordered list or ol orderedlist
       const userUl = document.createElement("ul")
       // arrays of objects for users by looping to be able to create li's for those
       book.users.forEach(user => {
  
        const userLi = document.createElement("li")
        userLi.textContent = user.username
        userUl.append(userLi)
       })
       const button = document.createElement("button")
       // will allow when the user clicks on the book there will be a dataset and we can access it
       button.dataset.id = book.id
       button.innerText = "Like"
       const user = randomlyGetUsers()
       button.addEventListener("click", (e) => addUsertoLikes(e, user, book))
       // PATCH Request?
       // append everything to the showPanel
       showPanel.append(img, p, userUl, button)
 }
  
 function addUsertoLikes(e, user, book) {
    e.preventDefault()
    let userList = []
    if(book.users.includes(user)) {
        // then fetch to remove
        userList = book.users.filter(bookUser => bookUser.id !== user.id)
    // otherwise fetch to add above
    } else {
        // add users to List object to array
        userList = [...book.users, user]
    }
  
 fetch (`http://localhost:3000/books${book.id}`, {
        // PATCH 2nd argument
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({users: userList})
    })
    .then(response => response.json)
    .then(response => {
        console.log(response)
    })
 }
  
 // GET users inside users
 function randomlyGetUsers() {
    fetch(`http://localhost:3000/users`)
    .then(response => response.json())
    // returning the users that we retrieve from this lists of users and call the function when we like and unlike the books
    .then(response => {
        // .length to get the numbers of array
        const numOfUsers = response.length
        function randomNumberGenerator() {
            const randomNumber = Math.floor(Math.random() * 20)
            if(randomNumber < numOfUsers) {
                // that will be out users
                return response[randomNumber]
            } else {
                // if the random number is outside of the range if its not less than users then we have to regenerate the number until we get the number that will work
                randomNuGenerator()
            }
        }
    })
 }
 // When a user clicks the title of a book, display the book's thumbnail, description, and a list of users who have liked the book. This information should be displayed in the div#show-panel element.
 