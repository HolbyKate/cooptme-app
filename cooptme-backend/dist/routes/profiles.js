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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/profiles/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID invalide. Il doit être un nombre.' });
    }
    try {
        const profile = yield prisma.profile.findUnique({
            where: { id: Number(id) },
        });
        if (!profile) {
            return res.status(404).json({ error: 'Profil introuvable.' });
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
}));
router.get('/profiles/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const profile = yield prisma.profile.findUnique({
            where: { id: Number(id) },
        });
        if (!profile) {
            res.status(404).json({ error: 'Profil introuvable.' });
            return;
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
}));
exports.default = router;
//# sourceMappingURL=profiles.js.map