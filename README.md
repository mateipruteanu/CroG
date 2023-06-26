# CroG (Creative Coding Resource Collector)
- 2nd Year Web Technologies project graded 9.75 / 10 (Creative Coding Resource Collector).
- Frontend built only with `HTML, CSS and JS`
- Backend built from scratch with `Vanilla NodeJS` with a `microservice architecture` _(no frameworks were allowed)_

  
### Click here to go to the [app features](#features) and here for the [demo](#demo) or go to the [video presentation](https://youtu.be/XvJXHpOBcYQ) :)

Project requirements can be found at this [Pastebin](https://pastebin.com/F5GyqhHJ).

Resources used to populate DB are taken from [this Github Page](https://github.com/terkelg/awesome-creative-coding)

## My Responsabilities
- Worked on the Frontend for the Search page (design & filtering) & on the CSS for the project
- Made the Authentication part of the app (microservice and handling of forms from frontend, session management)
- Implemented the update account feature

## Features
- Microservices are used through their own APIs and are stateless
- Session based authentication using cookies & randomly generated sessionIDs
  ```Javascript
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  const params = [username, hashedPassword];
  dbConn.query(query, params, function (err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      console.log("[authAPI/login] Login successful");

      // generating the session ID
      const sessionId = crypto.randomUUID();
      const updateSIDQuery = "UPDATE users SET session_id = ? WHERE username = ?";
      const updateSIDParams = [sessionId, username];
      dbConn.query(updateSIDQuery, updateSIDParams, function (err, rows, fields) {
          if (err) throw err;
          console.log("[authAPI/login] Updated session ID");
      });
  
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({authenticated: true, sessionId: sessionId}));
    } [...]
  ```
- Protection against SQL Injection using prepared SQL statements:
   ```Javascript
   const query = "UPDATE users SET username = ?, password = ?, email = ? WHERE session_id = ?";
   const params = [username, hashedPassword, email, sessionId];
   dbConn.query(query, params, function (err, rows, fields) {
     [...]});
   ```
- Hashing & salting passwords before they are added into DB
  ```Javascript
  const saltedPassword = data.password + username;
  const hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');
   ```
- Account & resource management built in


## Demo

### Homepage
![home](https://github.com/mateipruteanu/CroG/assets/35728927/f05d5b82-71ac-420a-ad6a-947f31619a14)

### Login
![login](https://github.com/mateipruteanu/CroG/assets/35728927/82bc74fe-8367-4c1f-800f-cc65b1a97635)

### Signup
![signup](https://github.com/mateipruteanu/CroG/assets/35728927/169e3e10-0ab2-4472-ab53-17c19afbf413)

### Search for resources
![3search](https://github.com/mateipruteanu/CroG/assets/35728927/a914124c-6823-4169-aa18-975719b17e3b)
