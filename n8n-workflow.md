# n8n Workflow Explanation

## Why Custom API Chosen Over n8n:
- **Speed**: Faster MVP development with direct Next.js API routes
- **Simplicity**: No additional infrastructure needed for n8n server
- **Deployment**: Easier deployment on Vercel without Docker complexity

## Equivalent n8n Workflow:
1. **Webhook Trigger** → Image upload from admin
2. **AI Processing Node** → LangChain + Gemini integration  
3. **Database Node** → Save to Supabase
4. **Notification Node** → Confirm product added

## Future Enhancement with n8n:
- Order management automation
- Payment webhook processing
- Customer notification system
