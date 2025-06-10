<h1>SaaS AI</h1>
<p>A Saas With a Chatbot and Text to speech functionalities</p>

<h2>Chatbot functionalities: </h2>
<p>Save Chats</p>
<p>Delete Chats</p>

<br />

<p>All messages and chats are saved in a DB</p>

<hr />

<h2>Text to speech functionalities: </h2>
<p>Generate audios from text</p>
<p>Save generated audios</p>
<p>Delete generated audios</p>
<p>Download generated audios</p>

<br />

<p>All audios are saved in a DB</p>

<hr />

<h2>Other functionalities: </h2>
<h3>Login and Register: </h3> 
<p>Users must be registered and logged to use functionalities page</p>
<p>Each user have a personal jsonwebtoken to autheticate account</p>
<h3>Subscrition system: </h3> 
<p>Users can buy subscription to access to Text to speech functionalities</p>
<p>Middleware to check expiration date, membership plan and jwt token</p>
<p>Stripe webhook configured to listen subscription events</p>

<br />

<p>Used dependencys can be saw in package.json</p>

<i>A NextJS project, 2025 Saas AI.</i>
