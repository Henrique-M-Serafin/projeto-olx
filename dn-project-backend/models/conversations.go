package models

import "gorm.io/gorm"

type Conversation struct {
	gorm.Model
	ListingID uint `json:"listing_id"`
	BuyerID   uint `json:"buyer_id"`
	SellerID  uint `json:"seller_id"`
}

type Message struct {
	gorm.Model
	ConversationID uint   `json:"conversation_id"`
	SenderID       uint   `json:"sender_id"`
	Content        string `json:"content"`
	IsRead         bool   `json:"is_read"`
}
