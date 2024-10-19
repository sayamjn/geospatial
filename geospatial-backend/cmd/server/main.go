package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sayamjn/geospatial-backend/internal/api"
	"github.com/sayamjn/geospatial-backend/internal/db"
	"github.com/sayamjn/geospatial-backend/internal/middleware"
)

func main() {
	if err := db.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	r.POST("/api/auth/login", api.Login)
	r.POST("/api/auth/register", api.Register)

	
	r.Use(middleware.AuthMiddleware())
	{
		r.POST("/api/upload", api.UploadFile)
		r.GET("/api/shapes", api.GetShapes)
		r.POST("/api/shapes", api.CreateShape)
		r.PUT("/api/shapes/:id", api.UpdateShape)
		r.DELETE("/api/shapes/:id", api.DeleteShape)
		r.GET("/api/files", api.GetFiles)

	}

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}