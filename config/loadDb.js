const { DataAPIClient } = require('@datastax/astra-db-ts');
const { PuppeteerWebBaseLoader } = require('@langchain/community/document_loaders/web/puppeteer');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { openai } = require("../controllers/chat.controller");

module.exports.connect = async () => {
    try {
        const endpoint = process.env.ASTRA_DB_ENDPOINT;
        const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
        if (!endpoint || !token) {
            throw new Error('Missing ASTRA_DB_ENDPOINT or ASTRA_DB_APPLICATION_TOKEN in .env. Check Astra Console.');
        }
        console.log('Endpoint:', endpoint);

        const client = new DataAPIClient();
        const db = client.db(endpoint, { token });
        console.log('Connected to DB ID:', db.id);

        const SimilarityMetric = "dot_product";
        const data = [
            'https://vi.wikipedia.org/wiki/Qu%E1%BA%A3_b%C3%B3ng_v%C3%A0ng_ch%C3%A2u_%C3%82u_2025',
            'https://vi.wikipedia.org/wiki/2_ng%C3%A0y_1_%C4%91%C3%AAm_(m%C3%B9a_4)',
            'https://vi.wikipedia.org/wiki/Ng%C3%A2n_98',
            'https://nhandan.vn/tu-vu-an-nam-sinh-dam-ban-tu-vong-canh-bao-phap-ly-cho-nguoi-chua-thanh-nien-post916515.html'
        ];

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 512,
            chunkOverlap: 100
        });

        const collectionName = process.env.ASTRA_DB_COLLECTION;

        const createCollection = async () => {
            try {
                const collectionNames = await db.listCollections({ nameOnly: true });
                const exists = collectionNames.includes(collectionName);

                if (exists) {
                    console.log(`Collection ${collectionName} already exists.`);
                    return;
                }

                const res = await db.createCollection(collectionName, {
                    vector: {
                        dimension: 1536,
                        metric: SimilarityMetric
                    }
                });
                console.log('Collection created:', res);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log('Collection already exists, skipping.');
                } else {
                    throw err;
                }
            }
        };

        const scrapePage = async (url) => {
            try {
                const load = new PuppeteerWebBaseLoader(url, {
                    launchOptions: { headless: true },
                    gotoOptions: { waitUntil: "domcontentloaded" },
                    evaluate: async (page) => {
                        const result = await page.evaluate(() => document.body.innerHTML);
                        return result;
                    }
                });
                const docs = await load.load();
                const content = docs[0]?.pageContent || '';
                return content.replace(/<[^>]*>?/gm, '');
            } catch (error) {
                console.error(`Scrape failed for ${url}:`, error.message);
                return '';
            }
        };

        const loadSampleData = async () => {
            const collection = db.collection(collectionName);
            let insertedCount = 0;
            for (const url of data) {
                console.log(`Processing: ${url}`);
                const content = await scrapePage(url);
                if (!content) continue;

                const chunks = await splitter.splitText(content);
                for (const chunk of chunks) {
                    if (chunk.length < 10) continue;

                    try {
                        const embedding = await openai.embeddings.create({
                            model: "text-embedding-3-small",
                            input: chunk,
                            encoding_format: "float",
                        });

                        const vector = embedding.data[0].embedding;
                        const res = await collection.insertOne({
                            $vector: vector,
                            text: chunk
                        });
                        console.log('Inserted:', res);
                        insertedCount++;
                    } catch (error) {
                        console.error('Insert failed:', error.message);
                    }
                }
            }
            console.log(`Total inserted: ${insertedCount}`);
        };

        await createCollection();
        await loadSampleData();
        console.log('Data loading completed!');
    } catch (error) {
        console.error('Connect failed:', error.message);
    }
};