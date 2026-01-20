import mongoose from 'mongoose';

const sessionReportSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        aiSummary: {
            type: String,
            required: true,
        },
        gravityScore: {
            type: Number,
            min: 1,
            max: 3,
            required: true,
        },
        keyTopics: {
            type: [String],
            default: [],
        },
        triggerReason: {
            type: String,
            enum: ['conversation_ended', 'high_gravity', 'message_threshold'],
            required: true,
        },
        status: {
            type: String,
            enum: ['unread', 'read'],
            default: 'unread',
        },
        readAt: {
            type: Date,
            default: null,
        },
        readBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index pour performance
sessionReportSchema.index({ patientId: 1, status: 1 }); // Badge alertes non lues
sessionReportSchema.index({ conversationId: 1 }, { unique: true }); // Éviter doublons
sessionReportSchema.index({ gravityScore: -1, createdAt: -1 }); // Tri dashboard

// Méthode pour marquer comme lu
sessionReportSchema.methods.markAsRead = async function (proId) {
    this.status = 'read';
    this.readAt = new Date();
    this.readBy = proId;
    return await this.save();
};

// Méthode statique pour compter les rapports non lus par patient
sessionReportSchema.statics.countUnreadByPatient = function (patientId) {
    return this.countDocuments({
        patientId,
        status: 'unread',
    });
};

// Méthode statique pour récupérer les rapports d'un pro (tous ses patients)
sessionReportSchema.statics.findByPro = async function (proId, filters = {}) {
    // Récupérer tous les patients du pro
    const User = mongoose.model('User');
    const patients = await User.find({ linkedProId: proId }).select('_id');
    const patientIds = patients.map((p) => p._id);

    // Construire la query
    const query = {
        patientId: { $in: patientIds },
    };

    // Appliquer les filtres optionnels
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.patientId) {
        query.patientId = filters.patientId;
    }

    return this.find(query)
        .populate('patientId', 'firstName lastName email')
        .sort({ gravityScore: -1, createdAt: -1 })
        .limit(filters.limit || 50);
};

const SessionReport = mongoose.model('SessionReport', sessionReportSchema);

export default SessionReport;
