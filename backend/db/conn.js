const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/getapet')
    console.log("[INFO-DB] Mongoose conectado com sucesso!")
}

main().catch((err) => console.log(err))

module.exports = mongoose