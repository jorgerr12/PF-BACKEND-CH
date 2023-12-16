import dotenv from "dotenv"
const NODE_ENV = process.env.NODE_ENV || 'development'
dotenv.config({
  path:`.env.${NODE_ENV}`
})

export const config = {
  server:{
    port:process.env.PORT ||8080
  },
  mongo:{
    url:process.env.MONGO_URL,
    urlTest:process.env.MONGO_URL_TEST
  },
  github:{
    client_id:process.env.GITHUB_CLIENT_ID,
    client_secret:process.env.GITHUB_CLIENT_SECRET
  },
  persistence:process.env.PERSISTENCE,
  EMAIL:process.env.EMAIL,
  EMAIL_PASSWORD:process.env.EMAIL_PASSWORD,

}