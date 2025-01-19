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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        console.log('Register attempt for:', email);
        const existingUser = yield prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'Cet email est déjà utilisé'
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                provider: 'email'
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre-secret', { expiresIn: '24h' });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'inscription'
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Login attempt:', req.body);
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: { email }
        });
        if (!user || !user.password) {
            res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre-secret', { expiresIn: '24h' });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la connexion'
        });
    }
}));
router.post('/forgot-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log('Forgot password attempt for:', email);
        const user = yield prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'Aucun compte associé à cet email'
            });
            return;
        }
        const resetToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre-secret', { expiresIn: '1h' });
        res.json({
            success: true,
            message: 'Email de réinitialisation envoyé'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'envoi de l\'email'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map