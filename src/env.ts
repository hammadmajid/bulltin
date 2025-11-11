import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface DatabaseEnv {
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
}

function getEnvVar(name: string, alternatives: string[] = []): string {
    let value = process.env[name];
    if (value) return value;
    for (const alt of alternatives) {
        value = process.env[alt];
        if (value) return value;
    }
    throw new Error(`Missing required environment variable: ${name}${alternatives.length ? ' / ' + alternatives.join(' / ') : ''}`);
}

const env: DatabaseEnv = {
    DB_USER: getEnvVar('DB_USER', ['DATABASE_USER']),
    DB_PASSWORD: getEnvVar('DB_PASSWORD', ['DATABASE_PASSWORD']),
    DB_HOST: getEnvVar('DB_HOST', ['DATABASE_HOST', 'DATABASE_IP', 'DB_IP']),
    DB_PORT: Number(getEnvVar('DB_PORT', ['DATABASE_PORT'])),
};

export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = env;