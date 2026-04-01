package main

import (
	"github.com/Henrique-M-Serafin/dn-project/database"
	"github.com/Henrique-M-Serafin/dn-project/routes"
)

func main() {
	database.DatabaseConnect()

	database.CloudinaryConnect()
	routes.SetupRoutes()
}
