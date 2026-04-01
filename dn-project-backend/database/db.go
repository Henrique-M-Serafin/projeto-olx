package database

import (
	"fmt"
	"log"
	"os"

	"github.com/Henrique-M-Serafin/dn-project/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DatabaseConnect() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	DB = db
	DB.AutoMigrate(&models.Users{}, &models.Listing{}, &models.Vehicle{}, &models.ListingPhoto{}, &models.Conversation{}, &models.Message{})
	log.Println("Database connected and migrated successfully")
}
