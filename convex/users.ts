import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { PLAN_LIMITS } from "../lib/constants";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      //if not then only  ->Add user
      const data = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: PLAN_LIMITS.freeCredits,
      };
      const id = await ctx.db.insert("users", data);
      return await ctx.db.get(id);
    }
    return user;
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

export const updateTokens = mutation({
  args: {
    credits: v.number(),
    uid: v.id("users"),
    orderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.orderId) {
      await ctx.db.patch(args.uid, {
        credits: args.credits,
      });
    } else {
      await ctx.db.patch(args.uid, {
        credits: args.credits,
        orderId: args.orderId
      });
    }
  }
});

export const applyProPlanFromWebhook = mutation({
  args: {
    uid: v.id("users"),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.uid, {
      orderId: args.orderId,
      credits: PLAN_LIMITS.proCredits,
    });
  },
});