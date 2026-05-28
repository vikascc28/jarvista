import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const assistantRecordValidator = v.object({
    id: v.number(),
    name: v.string(),
    title: v.string(),
    image: v.string(),
    instruction: v.string(),
    userInstruction: v.string(),
    sampleQuestions: v.array(v.string()),
    aiModelId: v.optional(v.string()),
});

export const InsertSelectedAssistants=mutation({
    args:{
        records:v.array(assistantRecordValidator),
        uid:v.id('users')
    },
    handler:async(ctx , args)=>{
        const insertedIds = [];
        for (const record of args.records) {
            const existing = await ctx.db
                .query("userAiAssistants")
                .withIndex("by_uid_assistantId", (q) => q.eq("uid", args.uid).eq("id", record.id))
                .first();

            if (existing) continue;

            const insertedId = await ctx.db.insert('userAiAssistants',{
                ...record,
                aiModelId: record.aiModelId ?? 'gemini-1.5-flash',
                uid:args.uid
            });
            insertedIds.push(insertedId);
        }
        return insertedIds;
    }
});

export const GetAllUserAssistants = query({
    args: {
        uid: v.id('users'),
    },
    handler: async (ctx, args) => {
       const result = await ctx.db.query('userAiAssistants')
       .withIndex("by_uid", (q) => q.eq("uid", args.uid))
       .collect();

       return result;
    }
})

export const UpdateUserAiAssistant =mutation({
    args:{
        id:v.id('userAiAssistants'),
        userInstruction:v.string(),
        aiModelId:v.string()
    },
    handler:async(ctx, args)=>{
        const result =await ctx.db.patch(args.id,{
            aiModelId:args.aiModelId,
            userInstruction: args.userInstruction
        })
        return result;
    }
})
export const DeleteAssistant = mutation({
    args:{
        id:v.id('userAiAssistants')
    },
    handler:async (ctx , args)=>{
        await ctx.db.delete(args.id);
    }
})