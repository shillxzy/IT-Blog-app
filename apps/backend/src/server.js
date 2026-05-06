const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const articlesRoutes = require("./routes/articles.routes");

const app = express();

app.use(express.json());

app.use("/api/articles", articlesRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});