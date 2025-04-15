const mongoose = require("mongoose")
const express = require("express")
const app = express()
const cors = require("cors")

require("dotenv").config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err.message))

// Rutas
app.use("/partidos", require("./routes/partidos"))
// ... otras rutas

app.get("/", (req, res) => {
  res.send("API funcionando correctamente")
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`)
})
