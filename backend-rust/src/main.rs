mod database;

use axum::{
    routing::get,
    Router,
    extract::State,
    response::Json,
};
use std::net::SocketAddr;
use database::{create_pool, test_connection, DbPool};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::dotenv().ok();
    
    // Create database connection pool
    let pool = create_pool().await?;
    println!("✅ Database pool created");
    
    // Test connection
    test_connection(&pool).await?;
    println!("✅ Database connection verified");
    
    let app = Router::new()
        .route("/", get(health_check))
        .route("/health", get(health_check))
        .with_state(pool);

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse::<u16>()
        .unwrap_or(8000);
        
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    println!("🚀 Rust Wedding Backend running on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    
    Ok(())
}

async fn health_check(State(pool): State<DbPool>) -> Json<serde_json::Value> {
    let is_db_connected = test_connection(&pool).await.is_ok();
    
    Json(serde_json::json!({
        "status": "ok",
        "service": "Rust Wedding Backend",
        "database": if is_db_connected { "connected" } else { "disconnected" },
        "version": "0.1.0"
    }))
}
