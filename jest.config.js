module.exports = {
    testTimeout: 30000,
    testEnvironment: 'node',
    verbose: true,
    testEnvironmentOptions: {
        NODE_ENV: 'test'
    },
    setupFilesAfterEnv: ['./tests/setup.js']
}; 