package api

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sayamjn/geospatial-backend/internal/db"
)

func UploadFile(c *gin.Context) {
    file, header, err := c.Request.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    defer file.Close()

    if !isValidFileType(header.Filename) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only GeoJSON and KML files are allowed."})
        return
    }

    if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
        return
    }

    filename := header.Filename
    out, err := os.Create(filepath.Join("uploads", filename))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
        return
    }
    defer out.Close()

    _, err = io.Copy(out, file)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }

    userId := c.GetInt("userId")
    fileInfo := db.File{
        UserID: userId,
        Name:   filename,
    }
    if err := db.CreateFile(&fileInfo); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file information"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})
}

func GetFiles(c *gin.Context) {
    userId := c.GetInt("userId")
    files, err := db.GetFilesByUserId(userId)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch files"})
        return
    }

    c.JSON(http.StatusOK, files)
}

func isValidFileType(filename string) bool {
    ext := strings.ToLower(filepath.Ext(filename))
    return ext == ".geojson" || ext == ".kml"
}