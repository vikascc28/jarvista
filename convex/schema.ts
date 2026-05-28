import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users:defineTable({
        name:v.string(),
        email:v.string(),
        picture:v.string(),
        credits:v.number(),
        orderId:v.optional(v.string())
    }).index("by_email", ["email"]),
    userAiAssistants:defineTable({
        id: v.number(),
        name: v.string(),
        title: v.string(),
        image: v.string(),
        instruction: v.string(),
        userInstruction: v.string(),
        sampleQuestions:v.array(v.string()),
        aiModelId:v.optional(v.string()),
        uid:v.id('users')
    })
      .index("by_uid", ["uid"])
      .index("by_uid_assistantId", ["uid", "id"])
      .index("by_uid_name", ["uid", "name"]),
    assistantConversations: defineTable({
        uid: v.id("users"),
        assistantId: v.number(),
        userMessage: v.string(),
        assistantMessage: v.string(),
        createdAt: v.number(),
    })
      .index("by_uid_assistant", ["uid", "assistantId"])
      .index("by_uid", ["uid"])
})