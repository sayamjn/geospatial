package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sayamjn/geospatial-backend/internal/db"
)

func GetShapes(c *gin.Context) {
	userId := c.GetInt("userId")
	shapes, err := db.GetShapesByUserId(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shapes"})
		return
	}

	c.JSON(http.StatusOK, shapes)
}

func CreateShape(c *gin.Context) {
	var shape db.Shape
	if err := c.ShouldBindJSON(&shape); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	shape.UserID = c.GetInt("userId")

	if err := db.CreateShape(&shape); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create shape"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Shape created successfully", "id": shape.ID})
}

func UpdateShape(c *gin.Context) {
	shapeId := c.Param("id")
	userId := c.GetInt("userId")

	var shape db.Shape
	if err := c.ShouldBindJSON(&shape); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.UpdateShape(shapeId, userId, &shape); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update shape"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Shape updated successfully"})
}

func DeleteShape(c *gin.Context) {
	shapeId := c.Param("id")
	userId := c.GetInt("userId")

	if err := db.DeleteShape(shapeId, userId); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete shape"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Shape deleted successfully"})
}

