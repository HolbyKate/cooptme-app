"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});
const profileRoutes = require('./routes/profiles').default;
app.use('/api', profileRoutes);
const authRoutes = require('./routes/auth').default;
app.use('/api/auth', authRoutes);
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Serveur en cours d'exécution sur http://${HOST}:${PORT}`);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield app.listen(PORT);
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Le port ${PORT} est déjà utilisé. Veuillez utiliser un autre port.`);
            }
            else {
                console.error('Erreur du serveur:', error);
            }
            process.exit(1);
        });
        console.log(`Serveur démarré avec succès sur:
        - http://localhost:${PORT}
        - http://127.0.0.1:${PORT}`);
    }
    catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
});
startServer();
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({
        success: false,
        error: 'Une erreur interne est survenue'
    });
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
exports.default = app;
//# sourceMappingURL=server.js.map