module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || '7ce9c738-34ba-11ea-aec2-2e728ce88125',
    DB_URL: process.env.DB_URL || 'postgresql://dunder-mifflin:password@localhost/test_scheduler',
}