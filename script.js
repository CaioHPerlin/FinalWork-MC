class CustomError extends Error {
	constructor(name, message, userMessage) {
		super(message);
		this.name = name;
		this.message = message;
		this.userMessage = userMessage;
	}

	log() {
		console.log(this.name + ": " + this.message);
		return `<article>${this.userMessage}</article>`;
	}
}

class Article {
	constructor(title, author, publishedAt, description, url, name) {
		this.title = title;
		this.author = author;
		this.publishedAt = publishedAt;
		this.description = description;
		this.url = url;
		this.name = name;
	}

	showArticle() {
		try {
			if (this.title && this.author && this.publishedAt && this.description && this.url && this.name) {//Checks if the variables aren't falsy (empty strings, null, false, 0, undefined...)
				let convertedDate = convertDate(this.publishedAt)
				return `<article onclick="window.open('${this.url}', target='_self')">
							<h2>${this.title}</h2>
							<p>${this.description}</p>
							<h3 style="display:inline-block">${this.name}</h3>
							<h3 style="float:right">${convertedDate} | ${this.author}</h3>
						</article>`;
			} else {
				throw new CustomError("Falsy Variables", `Article attributes can't have falsy values attached to them, such as: "", NaN, undefined, null, 0 and false`, "An error occurred while loading this article, please try again later");
			}
		} catch (error) {
			return error.log();
		}
	}
}

class FeaturedArticle extends Article {
	constructor(title, author, publishedAt, description, url, name, urlToImage) {
		super(title, author, publishedAt, description, url, name);
		this.urlToImage = urlToImage;
	}

	showArticle() {
		try {
			if (this.title && this.author && this.publishedAt && this.description && this.url && this.name && this.urlToImage) {//Checks if the variables aren't falsy (empty strings, null, false, 0, undefined...)
				let convertedDate = convertDate(this.publishedAt);
				return `<article onclick="window.open('${this.url}', target='_self')">
							<img src=${this.urlToImage}></img>
							<h2>${this.title}</h2>
							<p>${this.description}</p>
							<h3 style="display:inline-block">${this.name}</h3>
							<h3 style="float:right">${convertedDate} | ${this.author}</h3>
						</article>`
			} else {
				throw new CustomError("Falsy Variables", `Article attributes can't have falsy values attached to them, such as: "", NaN, undefined, null, 0 and false`, "An error occurred while loading this article, please try again later");
			}
		} catch (error) {
			return error.log();
		}
	}
}

function convertDate(date) {
	return date.replace(/-/g, "/").replace(/[T Z]/g, " ");
}

document.getElementsByTagName("footer")[0].insertAdjacentHTML("beforebegin", `<section id="article-container"></section>`);
let htmlArticleContainer = document.getElementById("article-container");

let path = "https://www.luizpicolo.com.br/api.json";
let request = new XMLHttpRequest();
request.open("GET", path);
request.responseType = "json";
request.send();

request.onload = function() {
	let response = request.response;

	response.articles.forEach((article, i) => {
		let newArticle;
		if (i == 0) {//Checks for the newest article on the database
			newArticle = new FeaturedArticle(article.title, article.author, article.publishedAt, article.description, article.url, article.source.name, article.urlToImage);
		} else {
			newArticle = new Article(article.title, article.author, article.publishedAt, article.description, article.url, article.source.name);
		}
		htmlArticleContainer.insertAdjacentHTML("beforeend", newArticle.showArticle());
	});

	colorArticles();
}

//Styling
function colorArticles() {
	let HTMLarticles = document.getElementsByTagName("article");
	for (let article of HTMLarticles) {
		let r, g, b;
		r = Math.random() * 255;
		g = Math.random() * 255;
		b = Math.random() * 255;
		article.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.25)`;
	}
}
