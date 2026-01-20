import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['patient', 'pro'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // N'inclut pas le mot de passe par défaut dans les requêtes
    },
    linkedProId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.role === 'patient';
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+33\d{9}$/, 'Format téléphone invalide (ex: +33612345678)'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

// Index pour performance des requêtes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ linkedProId: 1 }); // Pour requêtes dashboard pro

// Méthode pour hacher le mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas été modifié, passer au suivant
  if (!this.isModified('passwordHash')) return next();

  try {
    // Hachage avec 12 salt rounds
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode d'instance pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Méthode pour obtenir le nom complet
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

// Virtual pour le nom complet
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Assurer que les virtuals sont sérialisés
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Supprimer le passwordHash du JSON
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export default User;
