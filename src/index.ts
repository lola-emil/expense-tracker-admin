import express from "express";

import pagesRoute from "./pages/routes";
import apiRoute from "./api/routes";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(express.urlencoded({extended: false}));


// Add pages
app.use(pagesRoute);

// Add API routes
app.use("/api", apiRoute);


const PORT = 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));