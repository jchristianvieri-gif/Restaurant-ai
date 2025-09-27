# Technical Architecture & Decisions

## Stack Implementation:

### Frontend: Next.js 14 ✅
- App router digunakan untuk routing
- Server components untuk data fetching
- Client components untuk interactivity

### Database: Supabase ✅
- PostgreSQL database
- Storage untuk images
- Real-time subscriptions

### AI Processing: LangChain + Google Gemini ✅
- **Primary**: LangChain dengan Google Gemini Vision untuk image analysis
- **Fallback**: Manual product extraction ketika AI tidak available
- Error handling robust dengan fallback mechanism

### Why Custom Backend vs n8n:
- **Decision**: Custom API routes dengan Next.js
- **Reason**: Lebih cepat untuk development MVP
- **Benefit**: Simplified deployment dan better control
- **Trade-off**: Kurang visual workflow seperti n8n

### Payment Integration: Midtrans ✅
- Sandbox environment
- Snap API untuk payment UI
- Webhook handling untuk status update

## AI Workflow:
1. Admin uploads image → Formidable processing
2. Image buffer → LangChain + Gemini Vision
3. Jika AI success: Extract product info
4. Jika AI fail: Fallback ke manual extraction (smart filename-based)
5. Save to Supabase → Display di frontend

## Deployment Ready:
- Environment variables configured
- Vercel deployment compatible
- Error handling implemented
