function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${ item.text }</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`;
}

let outputHTML = items.map((item) => {
    return itemTemplate(item);
}).join('');

document.getElementById("item-list").insertAdjacentHTML("beforeend", outputHTML);

// Create:
let createField = document.getElementById('create-field');

document.getElementById('create-form').addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('create-item', {text: createField.value})
        .then((response) => {
            document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data));
            createField.value = '';
            createField.focus();
        })
        .catch((error) => {
            console.log(error.message);
        });
});

document.addEventListener("click", (e) => {
    // Update:
    if(e.target.classList.contains('edit-me')) {
        const userInput = prompt('Enter your desired new text', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
        
        if(userInput) {
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute('data-id') })
            .then(() => {
                // Update item when the server responds ok
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
            })
            .catch((error) => {
                console.log(error.message);
            });
        }
    }

    // Delete:
    if(e.target.classList.contains('delete-me')) {
        if(confirm("Do you really want to delete this item?")) {
            axios.post('/delete-item', { id: e.target.getAttribute('data-id') })
            .then(() => {
                // Remove the <li> when the server responds ok
                e.target.parentElement.parentElement.remove();
            })
            .catch((error) => {
                console.log(error.message);
            });
        }
    }
});