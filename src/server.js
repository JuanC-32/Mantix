require('dotenv').config();

const app = require('./app');
const database = require('./config/database');

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
    try {
        await database.query('SELECT 1');
        const server = app.listen(PORT, () => {
            console.log(`Mantix running on port ${PORT}`);
        });

        const shutdown = async () => {
            server.close(async () => {
                await database.end();
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (error) {
        console.error('Could not connect to the database:', error.message);
        await database.end();
        process.exit(1);
    }
}

startServer();
