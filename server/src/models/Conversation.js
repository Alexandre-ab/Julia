import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            enum: ['user', 'ai'],
            required: true,
        },
        text: {
            type: String,
            required: true,
            maxlength: 2000,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        gravityScore: {
            type: Number,
            min: 1,
            max: 3,
            // Optionnel: calculé uniquement pour les messages du patient
        },
    },
    {
        _id: true, // MongoDB génère automatiquement un _id pour chaque message
    }
);

const conversationSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        messages: [messageSchema],
        status: {
            type: String,
            enum: ['active', 'ended'],
            default: 'active',
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt: {
            type: Date,
            default: null,
        },
        highestGravityScore: {
            type: Number,
            min: 1,
            max: 3,
            default: 1,
        },
        reportGenerated: {
            type: Boolean,
            default: false,
        },
        isBeingViewedByPro: {
            type: Boolean,
            default: false,
        },
        lastProViewAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index pour performance
conversationSchema.index({ patientId: 1, status: 1 }); // Récupérer conversation active
conversationSchema.index({ patientId: 1, endedAt: -1 }); // Historique
conversationSchema.index({ highestGravityScore: -1 }); // Tri dashboard pro

// Méthode pour ajouter un message
conversationSchema.methods.addMessage = async function (sender, text, gravityScore = null) {
    const message = {
        sender,
        text,
        timestamp: new Date(),
    };

    // Si c'est un message patient, ajouter le gravity score
    if (sender === 'user' && gravityScore !== null) {
        message.gravityScore = gravityScore;

        // Mettre à jour le highestGravityScore si nécessaire
        if (gravityScore > this.highestGravityScore) {
            this.highestGravityScore = gravityScore;
        }
    }

    this.messages.push(message);
    return await this.save();
};

// Méthode pour terminer la conversation
conversationSchema.methods.end = async function () {
    this.status = 'ended';
    this.endedAt = new Date();
    return await this.save();
};

// Méthode pour marquer comme vue par le pro
conversationSchema.methods.markAsViewedByPro = async function () {
    this.isBeingViewedByPro = true;
    this.lastProViewAt = new Date();
    return await this.save();
};

// Méthode statique pour récupérer la conversation active d'un patient
conversationSchema.statics.findActiveByPatient = function (patientId) {
    return this.findOne({
        patientId,
        status: 'active',
    });
};

// Méthode pour obtenir le nombre de messages
conversationSchema.virtual('messageCount').get(function () {
    return this.messages.length;
});

// Virtual pour obtenir seulement les messages du patient
conversationSchema.virtual('patientMessages').get(function () {
    return this.messages.filter((m) => m.sender === 'user');
});

// Assurer que les virtuals sont sérialisés
conversationSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
