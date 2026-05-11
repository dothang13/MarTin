const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.render("index", {
    title: "FOMO to PRO - AOEC Marketing Campaign",
    printMode: false,
  });
});

app.get("/print", (_req, res) => {
  res.render("index", {
    title: "FOMO to PRO - PDF Export",
    printMode: true,
  });
});

app.listen(PORT, () => {
  console.log(`FOMO to PRO deck is running at http://localhost:${PORT}`);
});
