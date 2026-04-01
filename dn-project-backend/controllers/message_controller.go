package controllers

import (
	"net/http"

	"github.com/Henrique-M-Serafin/dn-project/database"
	"github.com/Henrique-M-Serafin/dn-project/models"
	"github.com/gin-gonic/gin"
)

// Cria ou retorna conversa existente para um listing
func GetOrCreateConversation(c *gin.Context) {
	buyerID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	var body struct {
		ListingID uint `json:"listing_id"`
		SellerID  uint `json:"seller_id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	var conversation models.Conversation
	result := database.DB.Where(
		"listing_id = ? AND buyer_id = ? AND seller_id = ?",
		body.ListingID, buyerID, body.SellerID,
	).First(&conversation)

	// Se não existe, cria
	if result.Error != nil {
		conversation = models.Conversation{
			ListingID: body.ListingID,
			BuyerID:   buyerID.(uint),
			SellerID:  body.SellerID,
		}
		database.DB.Create(&conversation)
	}

	c.JSON(http.StatusOK, conversation)
}

// Lista todas as conversas do usuário logado
func GetConversations(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	var conversations []models.Conversation
	database.DB.Where("buyer_id = ? OR seller_id = ?", userID, userID).Find(&conversations)

	c.JSON(http.StatusOK, conversations)
}

// Busca histórico de mensagens de uma conversa
func GetMessages(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	conversationID := c.Param("id")

	// Verifica se o usuário faz parte da conversa
	var conversation models.Conversation
	result := database.DB.Where(
		"id = ? AND (buyer_id = ? OR seller_id = ?)",
		conversationID, userID, userID,
	).First(&conversation)

	if result.Error != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
		return
	}

	var messages []models.Message
	database.DB.
		Where("conversation_id = ?", conversationID).
		Order("created_at ASC").
		Find(&messages)

	// Marca como lidas as mensagens que não são do usuário logado
	database.DB.Model(&models.Message{}).
		Where("conversation_id = ? AND sender_id != ? AND is_read = ?", conversationID, userID, false).
		Update("is_read", true)

	c.JSON(http.StatusOK, messages)
}

// Envia uma mensagem (fallback REST, o principal será WebSocket)
func SendMessage(c *gin.Context) {
	senderID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	var body struct {
		ConversationID uint   `json:"conversation_id"`
		Content        string `json:"content"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Verifica se o usuário faz parte da conversa
	var conversation models.Conversation
	result := database.DB.Where(
		"id = ? AND (buyer_id = ? OR seller_id = ?)",
		body.ConversationID, senderID, senderID,
	).First(&conversation)

	if result.Error != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
		return
	}

	message := models.Message{
		ConversationID: body.ConversationID,
		SenderID:       senderID.(uint),
		Content:        body.Content,
		IsRead:         false,
	}
	database.DB.Create(&message)

	c.JSON(http.StatusCreated, message)
}
