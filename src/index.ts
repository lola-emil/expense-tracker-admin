import express from "express";
import session from "express-session";
import flash from "connect-flash";

import pagesRoute from "./pages/routes";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(express.urlencoded({ extended: false }));

// Initialize session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
        },
    })
);


app.use(flash());

// Add pages
app.use(pagesRoute);



const PORT = 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));