const bookLibrary = new Array();

const bookForm = document.querySelector(".book-form");
const newBookBtn = document.querySelector(".add-btn");
const submitBtn = document.querySelector("#submit-btn");
const library = document.querySelector(".library");
const cardReadCheck = document.querySelector(".isReadCheck");
const formCloseBtn = document.querySelector(".close-btn");

// Elements in form
const bookTitleName = document.getElementById("book-title");
const bookAuthorName = document.getElementById("book-author");
const bookPagesCount = document.getElementById("book-pages");
const bookIsRead = document.getElementById("book-read");

// OBJECTS ===============================================================

// Object for creating Books data
function Book(title, author, pages, isRead) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.isRead = isRead;
	this.id = crypto.randomUUID(); // Generates random unique ID for each Books.
}

// Prototype function

Book.prototype.updateReadStatus = function (isRead) {
	this.isRead = isRead;
};

Book.prototype.getID = function () {
	return this.id;
};

// Object for creating multiple cards
function BookCard(title, author, pages, isRead, id) {
	this.tag = "div";
	this.attributes = { class: "book-card", "data-id": id };
	this.children = [
		{
			tag: "p",
			attributes: { class: "book-title" },
			text: title,
		},
		{
			tag: "p",
			text: "Author: ",
			children: [
				{
					tag: "span",
					attributes: { class: "book-author" },
					text: author,
				},
			],
		},
		{
			tag: "p",
			text: "Pages: ",
			children: [
				{
					tag: "span",
					attributes: { class: "book-pages" },
					text: pages.toString(),
				},
			],
		},
		{
			tag: "p",
			children: [
				{
					tag: "input",
					attributes: {
						type: "checkbox",
						name: "Read",
						id: `isRead-${id}`,
						class: "isReadCheck",
						checked: isRead,
					},
				},
				{
					tag: "span",
					text: "I have read this book",
				},
			],
		},
		{
			tag: "div",
			attributes: { class: "del-btn-container" },
			children: [
				{
					tag: "button",
					text: "Delete",
					attributes: {
						class: "delete-btn",
					},
				},
			],
		},
	];
}

// FUNCTIONS ============================================================

// Creates new Book object and push it into the array.
function addBookToLibrary(title, author, pages, isRead) {
	bookLibrary.push(new Book(title, author, pages, isRead));
}

// for resetting input on add new book
function resetInput() {
	bookTitleName.value = "";
	bookAuthorName.value = "";
	bookPagesCount.value = "";
	bookIsRead.checked = false;
}

// for creating DOM elements for our card
function createBookCardElement(obj) {
	const element = document.createElement(obj.tag);

	if (obj.attributes) {
		for (let [key, value] of Object.entries(obj.attributes)) {
			element.setAttribute(key, value);
		}
	}

	if (obj.text) {
		element.appendChild(document.createTextNode(obj.text));
	}

	if (obj.children) {
		obj.children.forEach((child) => {
			element.appendChild(createBookCardElement(child));
		});
	}

	return element;
}

// EVENT LISTENERS ========================================================

newBookBtn.addEventListener("click", () => {
	bookForm.setAttribute("style", "visibility: visible");
});

formCloseBtn.addEventListener("click", () => {
	bookForm.setAttribute("style", "display: none");
	bookForm.setAttribute("style", "visibility: hidden");
});

submitBtn.addEventListener("click", (e) => {
	e.preventDefault();

	let title = bookTitleName.value;
	let author = bookAuthorName.value;
	let pages = bookPagesCount.value;
	let isRead = bookIsRead.checked;

	if (!title || !author || !pages) {
		alert("Fill out all the fields.");
		return;
	}

	if (isNaN(pages) || pages <= 0) {
		alert("Pages must be a number greater than 0");
		return;
	}

	addBookToLibrary(title, author, pages, isRead);
	console.table(bookLibrary); // for logging

	// Gets the current book and uses the prototype function to get its ID
	let currentBookID = bookLibrary[bookLibrary.length - 1].getID();

	// for creating the book card
	const bookCard = createBookCardElement(
		new BookCard(title, author, pages, isRead, currentBookID)
	);
	library.appendChild(bookCard);

	// for applying check on checkbox
	const isReadCheck = document.getElementById(`isRead-${currentBookID}`); // use to target the ID based on title
	isReadCheck.checked = isRead;

	resetInput();

	bookForm.setAttribute("style", "display: none");
	bookForm.setAttribute("style", "visibility: hidden");
});

library.addEventListener("change", (e) => {
	if (e.target.type === "checkbox" && e.target.name === "Read") {
		const bookCard = e.target.closest(".book-card"); // gets the card
		if (!bookCard) return;

		const bookID = bookCard.dataset.id; // gets the data-id

		// find the book in the array using the ID
		const book = bookLibrary.find((b) => b.getID() === bookID);

		if (book) {
			book.updateReadStatus(e.target.checked); // use prototype function
			console.log(`Book ID ${bookID} read status updated to : ${book.isRead}`);
		}
	}
});

library.addEventListener("click", (e) => {
	if (e.target.classList.contains("delete-btn")) {
		const bookCard = e.target.closest(".book-card");

		if (!bookCard) return;

		const bookID = bookCard.dataset.id;

		const book = bookLibrary.find((b) => b.getID() === bookID);

		const card = document.querySelector(`.book-card[data-id="${bookID}"]`);
		if(card) card.remove();

		if (book) {
			const index = bookLibrary.findIndex((b) => b.getID() === bookID);
			if(index !== -1) bookLibrary.splice(index, 1);
			// Log deletion
			console.log(`Successfully Deleted Book ID: ${bookID}`);
		}

		console.table(bookLibrary);
	}
});
