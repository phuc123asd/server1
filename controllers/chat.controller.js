const OpenAI = require('openai');
const { DataAPIClient } = require('@datastax/astra-db-ts');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Init Astra client một lần (global)
const astraClient = new DataAPIClient();
const db = astraClient.db(process.env.ASTRA_DB_ENDPOINT, { token: process.env.ASTRA_DB_APPLICATION_TOKEN });
const collectionName = process.env.ASTRA_DB_COLLECTION;

// Hàm helper: Tìm chunks tương tự từ DB
const retrieveContext = async (query) => {
    try {
        console.log('Step 1: Embedding query...');
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query,
            encoding_format: "float",
        });
        const queryVector = embedding.data[0].embedding;
        console.log('Step 2: Query vector ready, length:', queryVector.length);

        console.log('Step 3: Searching DB...');
        const cursor = db.collection(collectionName).find(
            {},  // Filter rỗng
            {
                sort: { $vector: queryVector },
                limit: 3
            }
        );

        const results = [];
        for await (const doc of cursor) {
            results.push(doc);
        }
        console.log('Step 4: Found results:', results.length);

        // Debug structure doc (chạy 1 lần, xóa sau khi OK)
        if (results.length > 0) {
            console.log('First doc keys:', Object.keys(results[0]));
            console.log('First doc preview:', JSON.stringify(results[0], null, 2).substring(0, 200));
        }

        // Ghép text chunks (fallback fields, filter empty)
        const texts = results.map(doc =>
            doc.text || doc.body || doc.content || doc.chunk || ''  // Fallback phổ biến
        ).filter(t => t.length > 10);  // Chỉ lấy chunks có nội dung thực (>10 chars)

        const contexts = texts.join('\n\n---\n\n');

        // Nếu có results nhưng texts rỗng, return debug message
        if (results.length > 0 && texts.length === 0) {
            return "Ngữ cảnh tìm thấy nhưng field text rỗng (check insert ở loadDb.js).";
        }

        return contexts || "Không tìm thấy ngữ cảnh liên quan.";
    } catch (error) {
        console.error('Retrieve context failed:', error.message);
        console.error('Full error:', error);
        return "Không thể lấy ngữ cảnh từ DB.";
    }
};

// [POST] /api/chat - Handler chính với RAG
const chatWithOpenAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Bước 1: Lấy context từ DB
        const context = await retrieveContext(message);
        console.log('Retrieved context preview:', context.substring(0, 100) + '...');

        // Bước 2: Tạo system prompt với context
        const systemPrompt = `Tên bạn là Phúc GPT. Dựa trên ngữ cảnh sau từ dữ liệu mới nhất, 
        trả lời câu hỏi của user một cách chính xác và hữu ích. Nếu ngữ cảnh không liên quan hoặc rỗng, 
        dùng kiến thức chung của bạn nếu dữ liệu thiếu hãy suy luận theo kiến thức bạn đang có.

Ngữ cảnh từ DB :
${context}`;

        // Bước 3: Gọi OpenAI với messages có context
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error('Chat failed:', error);
        res.status(500).json({ error: 'OpenAI or DB request failed' });
    }
};

module.exports = { openai, chatWithOpenAI };