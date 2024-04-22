const { PrismaClient } = require('@prisma/client')

let db
const prismaClientSingleton = () => {
    return new PrismaClient()
}

global.prismaGlobal = global.prismaGlobal || prismaClientSingleton();

db = global.prismaGlobal;

module.exports = {
    db
}


if (process.env.APP_MODE !== 'prod') globalThis.prismaGlobal = db