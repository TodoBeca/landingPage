const fs = require("fs");

const configContent = `
const CONFIG = {
  API_URL_GET_BECAS: "${process.env.API_URL_GET_BECAS}",
  API_URL_GET_PARAMETROS: "${process.env.API_URL_GET_PARAMETROS}",
  API_URL_POST_USUARIO: "${process.env.API_URL_POST_USUARIO}",
  API_URL_POST_LOGIN: "${process.env.API_URL_POST_LOGIN}",
  API_URL_GET_USER: "${process.env.API_URL_GET_USER}",
  API_URL_UPDATE_USER: "${process.env.API_URL_UPDATE_USER}",
};
`;

fs.writeFileSync("public/config.js", configContent);
