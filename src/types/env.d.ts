declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FINGRID_API_KEY: string;
            NODE_ENV: 'development' | 'production' | 'test';
            // Add other environment variables here if needed
        }
    }
}

// This needs to be an actual module with at least one export
export { };