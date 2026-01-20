export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'default-secret-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
};

// Validation du secret JWT
if (JWT_CONFIG.secret.length < 32 && process.env.NODE_ENV === 'production') {
    console.error('❌ ERREUR: JWT_SECRET doit faire minimum 32 caractères en production');
    process.exit(1);
}

export default JWT_CONFIG;
