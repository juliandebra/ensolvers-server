require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { Sequelize } = require("sequelize");

const caCert = process.env.CA_PEM;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: {
      require: true,
      ca: caCert,
    },
  },
  logging: (msg) => console.log(`[Sequelize] ${msg}`),
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

module.exports = sequelize;
