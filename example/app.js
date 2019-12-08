import { join } from "path";
import express from "../lib/myExpress";
const app = express();
const port = 3000;
app.setConfig({
    templatePath: join(__dirname, "templates")
});
app.use((req, res, next) => {
    console.log("First Middleware");
    next();
});
app.use((req, res, next) => {
    console.log("Second Middleware");
    next();
});
app.get("/", (req, res) => {
    res.json({ route: "Route / GET" });
});
app.post("/", (req, res) => {
    res.send({ route: "Route / POST" });
});
app.put("/test", (req, res) => {
    res.html("Route /test PUT");
});
app.delete("/test", (req, res) => {
    res.html("Route /test DELETE");
});
app.all("/all", (req, res) => {
    res.html(`Route /all ${req.method}`);
});

app.listen(port, () => {
    console.log("Server started !");
});
