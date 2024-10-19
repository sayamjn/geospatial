package db

import (
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/lib/pq"
)

var db *sql.DB

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type Shape struct {
	ID     int             `json:"id"`
	UserID int             `json:"userId"`
	Data   json.RawMessage `json:"data"`
}

type File struct {
    ID     int    `json:"id"`
    UserID int    `json:"userId"`
    Name   string `json:"name"`
}


func InitDB() error {
	var err error
	connStr := "host=localhost port=5432 user=sayamjain dbname=geospatial_db sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	fmt.Println("Successfully connected to database")
	return nil
}

func GetUserByEmail(email string) (*User, error) {
	user := &User{}
	err := db.QueryRow("SELECT id, email, password FROM users WHERE email = $1", email).Scan(&user.ID, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func CreateUser(user *User) error {
	_, err := db.Exec("INSERT INTO users (email, password) VALUES ($1, $2)", user.Email, user.Password)
	return err
}

func GetShapesByUserId(userId int) ([]Shape, error) {
	rows, err := db.Query("SELECT id, user_id, data FROM shapes WHERE user_id = $1", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var shapes []Shape
	for rows.Next() {
		var shape Shape
		if err := rows.Scan(&shape.ID, &shape.UserID, &shape.Data); err != nil {
			return nil, err
		}
		shapes = append(shapes, shape)
	}

	return shapes, nil
}

func CreateShape(shape *Shape) error {
	return db.QueryRow("INSERT INTO shapes (user_id, data) VALUES ($1, $2) RETURNING id", shape.UserID, shape.Data).Scan(&shape.ID)
}

func UpdateShape(shapeId string, userId int, shape *Shape) error {
	_, err := db.Exec("UPDATE shapes SET data = $1 WHERE id = $2 AND user_id = $3", shape.Data, shapeId, userId)
	return err
}

func DeleteShape(shapeId string, userId int) error {
	_, err := db.Exec("DELETE FROM shapes WHERE id = $1 AND user_id = $2", shapeId, userId)
	return err
}


func GetFilesByUserId(userId int) ([]File, error) {
    rows, err := db.Query("SELECT id, user_id, name FROM files WHERE user_id = $1", userId)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var files []File
    for rows.Next() {
        var file File
        if err := rows.Scan(&file.ID, &file.UserID, &file.Name); err != nil {
            return nil, err
        }
        files = append(files, file)
    }

    return files, nil
}

func CreateFile(file *File) error {
    _, err := db.Exec("INSERT INTO files (user_id, name) VALUES ($1, $2)", file.UserID, file.Name)
    return err
}