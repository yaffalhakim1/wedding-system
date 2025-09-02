use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;

pub type DbPool = PgPool;

pub async fn create_pool() -> Result<DbPool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");
    
    // Use PgPoolOptions for production configuration
    PgPoolOptions::new()
        .max_connections(10)
        .min_connections(1)
        .acquire_timeout(std::time::Duration::from_secs(8))
        .idle_timeout(std::time::Duration::from_secs(300))
        .max_lifetime(std::time::Duration::from_secs(1800))
        .connect(&database_url)
        .await
}

pub async fn test_connection(pool: &DbPool) -> Result<(), sqlx::Error> {
    sqlx::query("SELECT 1")
        .fetch_one(pool)
        .await?;
    Ok(())
}
