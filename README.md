# Open-Wiki

## Project Overview
The website is designed to maintain the ease of search provided by Wikipedia while implementing additional features to enhance user interaction. Users can search for articles using the Wikipedia API and save their preferred articles to their personal library. Furthermore, the site allows users to edit and update these saved articles, providing a customized experience. This added functionality enables users to manage and curate their content, ensuring it meets their specific needs. The user-friendly interface and intuitive navigation, combined with the ability to personalize articles, make this platform a powerful tool for both casual users and researchers alike.

#### Homepage:

![enter image description here](https://i.ibb.co/pLsyMTG/Homepage-Preview.jpg)


## Database

### Relationships and Prisma ORM

Relationships are managed by Prisma by linking the `_id` field of the User collection with the `userId` field of the Article collection.

### User Model in Prisma

    model user { 
	    id String @id @default(auto()) @map("_id") @db.ObjectId
	    firstName String
	    lastName String
	    email String @unique
	    password String
	    articles article[]
	}
 
 #### User Database Example

    {
	    "_id": {
		    "$oid": "665585565de8026ead4a1781"
		},
		"firstName": "Name",
		"lastName": "Surname",
		"email": "example@email.com",
		"password": "6f1a82c6c5a6cd1421849b7b...." }

### Article Model in Prisma
   

    model article {
	    id String @id @default(auto()) @map("_id") @db.ObjectId
	    articleData Json
	    pageId Int
	    userId String @db.ObjectId
	    user user @relation(fields: [userId], references: [id], onUpdate: Cascade, onDelete: Cascade)
	    
	    @@unique(name: "pageIdUserId", [pageId, userId])
	}

#### Article Database Example

    {
		"_id": { 
		    "$oid": "66673c5f69f039f5498b4635" 
		},
		"articleData": { 
			 "time": { 
				 "$numberLong": "1718041695892"
			 },
			 "blocks": [
				 {
					 "id": "OXekO9KHYn",
					 "type": "image",
					 "data": { 
						"file": { 
							 "url": "https://upload.wikimedia.org/wikipedia/en/7/76/FileName.jpg"
						},
						"caption": "Image Caption Text",
						"withBorder": false,
						"stretched": false,
						"withBackground": false
					}
				 },
				 {
					"id": "BigUGoTuYU", 
					"type": "header",
					"data": {
						"text": "Some Text in Title Field",
						"level": 1
					}
				 },
				 {
					"id": "uFcH7PxiFo",
					"type": "paragraph",
					"data": {
						"text": "Some Text in Paragraph Field"
					}
				 }
			  ],
			  "version": "2.29.1"
		},
		"pageId": 13950959,
		"userId": {
			"$oid": "66673b7569f039f5498b4634"
		}
	}

### Data Validation and Constraints
Data validation and constraints are handled by the functions in the routes. Prisma performs targeted queries to retrieve only the requested data, which is then processed and reordered in the functions within the backend routes.

### Migrations

Migrations are handled with the terminal command:

    npx prisma db push

### Security

Authentication data is stored in the `user` collection, where the email is in plain text and the password is encrypted using the `crypto` library.

## Backend

### Folder Structure

-   `prisma`: Contains the `schema.prisma` file with the database models.
-   `db`: Contains the Prisma script to connect the application to the database.
-   `src`: Contains subfolders for routing, middleware, validations, and the main application file (`index.js`).

### Main Functions

Include all CRUD operations related to users and articles, as well as article search functions, which manage libraries for communication with the Wikipedia API and scraping Wikipedia pages.

#### Creating a User

    app.post("/user", userValidation, async (req, res) => {
		const newUser = await prisma.user.create({
	        data: {
	            firstName: req.body.firstName,
	            lastName: req.body.lastName,
	            email: req.body.email,
	            password: crypto.pbkdf2Sync(req.body.password, "salt", 10000, 100, "sha512").toString("hex")
	        }
	    });

	    res.status(201).json(newUser);
    });
  
#### Deleting an Article

    app.delete("/article", isLoggedIn, async (req, res) => {
	    try {
	        const userId = req.user.id;
	        const pageId = +req.body.pageId;
	        const deletedArticle = await prisma.article.delete({
	            where: {
	                pageIdUserId: {
	                    pageId: pageId,
	                    userId: userId
	                }
	            }
	        });

	        res.json(deletedArticle);
	    } catch (err) {
	        console.log(err);
	        res.status(404).json({ message: 'Article not Found' });
	    }
    });

### Authentication and Middleware

Login requests are handled by sending data in POST to the login route, where they are first validated by middleware and then compared to the credentials stored in the database.

The backend uses two main middleware:

-   `isLoggedIn`: Utilizes the `jwt` library to create and verify token validity.
-   `userValidation`: Used only during new user registration to validate the received data using `validate` library.

### Wikipedia API and Scraping

Connecting to the Wikipedia API occurs in three steps:

1.  Send a request with the user's search string and obtain a list of matching pages.
2.  Perform a targeted search using the page ID to obtain the official page URL.
3.  Scrape the official page to obtain article data (main photo, title, paragraphs).

### Error Handling

Errors are managed through the `try-catch` block, sending a status and message to the frontend based on the encountered error.

### Security

Security strategies include validating received data, managing errors, and encrypting sensitive data.

## Frontend

### Layout and Style

The layout is simple and intuitive, inspired by Wikipedia. It uses:

-   **TailwindCSS**: To write CSS directly in the HTML pages.
-   **DaisyUI**: For pre-assembled graphical components that leverage TailwindCSS classes.

### Communication with the Backend

Pages use JavaScript scripts to communicate with the backend APIs. On each page change, a session check is performed to verify the validity of the token.


### Layout Dynamism

The data received from the backend is used to dynamically update the HTML of the page, modifying the layout according to specific needs or providing data to libraries such as Swiper to display articles as slides. Additionally, the site is fully responsive, ensuring it is optimized for all mobile devices. This means the layout adapts seamlessly to different screen sizes, providing an optimal user experience on smartphones, tablets, and desktops alike. The use of TailwindCSS and DaisyUI helps maintain a consistent and flexible design across various devices, enhancing accessibility and usability for all users.

#### Swiper library example:

![enter image description here](https://i.ibb.co/wgSKYYs/Swiper-Library-Example.jpg)

### Editor.js

Editor.js is a library used to create or edit text and images within an HTML page. Scripts collect the entered data and save it to the database via the backend APIs.

#### Editor.js library example:

![enter image description here](https://i.ibb.co/tQc4hxd/Editor-js-example.jpg)


### Objective

The goal is to make everything clear and intuitive, with simple and explanatory actions for users.

### Technologies Used

-   Frontend written in JavaScript with the Express framework.
-   Dynamic layout that makes calls to the backend without interrupting the user experience.
-   Use of TailwindCSS and DaisyUI for design.

### Security

The frontend and backend implement security strategies such as validating received data, managing errors, and encrypting sensitive data to protect user information.
