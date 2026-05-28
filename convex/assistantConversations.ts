import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveConversationTurn = mutation({
  args: {
    uid: v.id("users"),
    assistantId: v.number(),
    userMessage: v.string(),
    assistantMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("assistantConversations", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const GetRecentAssistantTurns = query({
  args: {
    uid: v.id("users"),
    assistantId: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("assistantConversations")
      .withIndex("by_uid_assistant", (q) =>
        q.eq("uid", args.uid).eq("assistantId", args.assistantId),
      )
      .order("desc")
      .take(args.limit ?? 10);

    return rows.reverse();
  },
});

export const GetSmartSuggestions = query({
  args: {
    uid: v.id("users"),
    assistantId: v.number(),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("assistantConversations")
      .withIndex("by_uid_assistant", (q) =>
        q.eq("uid", args.uid).eq("assistantId", args.assistantId),
      )
      .order("desc")
      .take(5);

    return rows
      .map((row) => row.userMessage.trim())
      .filter(Boolean)
      .slice(0, 3);
  },
});
