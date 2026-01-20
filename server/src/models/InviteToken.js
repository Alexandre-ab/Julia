import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const inviteTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            default: () => uuidv4(), // Génère automatiquement un UUID v4
        },
        proId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: function () {
                // Par défaut: expire dans 7 jours
                const expirationDays = parseInt(process.env.INVITE_TOKEN_EXPIRATION_DAYS || '7');
                return new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
            },
        },
        usedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        usedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index pour performance
inviteTokenSchema.index({ token: 1 }, { unique: true });
inviteTokenSchema.index({ proId: 1, createdAt: -1 }); // Pour liste invitations par pro
inviteTokenSchema.index({ expiresAt: 1 }); // Pour nettoyage tokens expirés

// Méthode pour vérifier si le token est valide
inviteTokenSchema.methods.isValid = function () {
    // Token invalide si déjà utilisé
    if (this.usedBy !== null) {
        return false;
    }

    // Token invalide si expiré
    if (new Date() > this.expiresAt) {
        return false;
    }

    return true;
};

// Méthode pour marquer comme utilisé
inviteTokenSchema.methods.markAsUsed = async function (userId) {
    this.usedBy = userId;
    this.usedAt = new Date();
    return await this.save();
};

// Méthode statique pour nettoyer les tokens expirés
inviteTokenSchema.statics.cleanupExpired = async function (daysOld = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const result = await this.deleteMany({
        expiresAt: { $lt: cutoffDate },
    });

    return result.deletedCount;
};

const InviteToken = mongoose.model('InviteToken', inviteTokenSchema);

export default InviteToken;
