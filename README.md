# CSESOC Firebase Workshop
### How to use?
1. Download nodeJS from https://nodejs.org/en/
2. Clone this repo to your machine
3. Run the following command:
```bash
    npm install -g firebase-tools
    cd path/to/cloned/directory
    npm install
    firebase login
```
4. Set up your project with the necessary config and service account keys
5. To try the ports locally,
```bash
    firebase serve
```
6. To deploy the functions to the cloud,
```bash
    firebase deploy
```

### ROUTES:
* GET https://asia-east2-csesocworkshop.cloudfunctions.net/api/getMovies
	* Returns an array list of movies in the firestore database
	* Movies are in form of
	```javascript
	{movies: [
		title: string,
		yearReleased: number,
		imageURL: string, 
		genre: string[]
	]}
	```
* POST https://asia-east2-csesocworkshop.cloudfunctions.net/api/createNewMovie
	* Creates a new movie
	* Pass in a payload of:
	```javascript
	const payload = {
		title: string, 
		yearReleased: string, 
		imgeURL: string, 
		genres: string ("Action") or ("Action, Comedy") if multiple
	}
	```
	* Returns 
	```javascript
		const success = {
			status: string ("success"), 
			details: string
		}
		// OR
		const fail = {
			status: string ("failed"), 
		error: string (error code)
		}
	```
* GET https://asia-east2-csesocworkshop.cloudfunctions.net/api/movie/*movieId*
	* Gets a specific movie with the movie id passed in on the URL
	* Returns
	```javascript
		const success = {
			status: string ("success"), 
			movie: {
				title: string, 
				yearReleased: number, 
				imageURL: string,
				genres: string[]
			}
		}
		// OR
		const fail = {
			status: string ("failed"), 
			error: string (error code)
		}
	```

* POST https://asia-east2-csesocworkshop.cloudfunctions.net/api/movie/signup
	* Sign a user in with an email and password
	* Returns 
	```javascript
	const success = {
		token: string (JWT)
	}
	// or
	const fail = {
		error: err.code
	}
	```

* POST https://asia-east2-csesocworkshop.cloudfunctions.net/api/movie/login
	* Logs a user in with an email and password
	* Returns 
	```javascript
	const success = {
		token: string (JWT)
	}
	// or
	const fail = {
		error: err.code
	}