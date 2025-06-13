const bookLibrary = new Array();

const bookForm = document.querySelector(".book-form");
const newBookBtn = document.querySelector(".add-btn");
const submitBtn = document.querySelector("#submit-btn");
const library = document.querySelector(".library");

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

// Object for creating multiple cards
function BookCard(title, author, pages, isRead) {
	this.tag = "div";
	this.attributes = { class: "book-card" };
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
						id: `read-${title}`,
						checked: isRead,
					},
				},
				{
					tag: "span",
					text: "I have read this book",
				},
			],
		},
	];
}

// FUNCTIONS ============================================================

Book.prototype.getUniqueID(function () {
	return this.id;
});

// Creates new Book object and push it into the array.
function addBooktoLibrary(title, author, pages, isRead) {
	bookLibrary.push(new Book(title, author, pages, isRead));
}

// for resetting input on add new book
function resetInput() {
	bookTitleName.value = '';
	bookAuthorName.value = '';
	bookPagesCount.value = '';
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

submitBtn.addEventListener("click", () => {
	let title = bookTitleName.value;
	let author = bookAuthorName.value;
	let pages = bookPagesCount.value;
	let isRead = bookIsRead.checked;

	addBooktoLibrary(title, author, pages, isRead);
	console.table(bookLibrary); // for logging

	// for creating the book card
	const bookCard = createBookCardElement(
		new BookCard(title, author, pages, isRead)
	);
	library.appendChild(bookCard);

	// for applying check on checkbox
	const isReadCheck = document.getElementById(`read-${title}`); // use to target the ID based on title
	isReadCheck.checked = isRead;

	resetInput();
	bookForm.setAttribute("style", "visibility: hidden");
});
