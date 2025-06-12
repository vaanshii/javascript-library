const bookLibrary = new Array();

function Book(title, author, pages, isRead) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.isRead = isRead;
	this.id = crypto.randomUUID(); // Generates random unique ID for each Books.
}

// Creates new Book object and push it into the array.
function addBooktoLibrary(title, author, pages, isRead) {
	bookLibrary.push(new Book(title, author, pages, isRead));
}
