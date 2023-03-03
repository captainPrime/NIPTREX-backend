import express from "express";
const app = express(),
    port = process.env.PORT || 3003;

app.get("/", (req, res) => {
    res.send("Project Is Running on Browser");
});

app.listen(port, () => {
    console.table(`Express server is running & listening on port ${port}`);
});
