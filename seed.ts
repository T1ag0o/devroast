import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/node-postgres";
import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import "dotenv/config";
import * as schema from "./src/db/schema";

const DB_URL =
	process.env.DATABASE_URL ||
	"postgresql://devroast:devroast@localhost:5432/devroast";

const roastTypeEnum = pgEnum("roast_type", ["brutal", "friendly"]);
const badgeStatusEnum = pgEnum("badge_status", [
	"excellent",
	"good",
	"needs-improvement",
	"bad",
	"terrible",
]);

const submissions = pgTable("submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull(),
	language: varchar("language", { length: 50 }).notNull(),
	ipHash: varchar("ip_hash", { length: 64 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

const roasts = pgTable("roasts", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id").notNull(),
	score: integer("score").notNull(),
	feedback: text("feedback").notNull(),
	roastType: roastTypeEnum("roast_type").notNull().default("brutal"),
	badgeStatus: badgeStatusEnum("badge_status"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

const leaderboard = pgTable("leaderboard", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id").notNull(),
	authorName: varchar("author_name", { length: 100 }),
	shameScore: integer("shame_score").notNull(),
	rankPosition: integer("rank_position"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

function generateCodeSnippet(language: string): string {
	const snippets: Record<string, string[]> = {
		javascript: [
			`function add(a, b) { return a + b; }`,
			`const fetchData = async () => { const res = await fetch('/api'); return res.json(); };`,
			`const users = data.map(u => u.name).filter(n => n.length > 3);`,
			`for (let i = 0; i < 10; i++) { console.log(i); }`,
			`const [state, setState] = useState(null);`,
		],
		python: [
			`def add(a, b): return a + b`,
			`for i in range(10): print(i)`,
			`data = [x for x in items if x > 5]`,
			`async def fetch(): return await request()`,
			`class User: def __init__(self, name): self.name = name`,
		],
		typescript: [
			`const add = (a: number, b: number): number => a + b;`,
			`interface User { id: number; name: string; }`,
			`type Result = Success | Error;`,
			`const [state, setState] = useState<string | null>(null);`,
			`function fetch<T>(url: string): Promise<T> { return fetch(url); }`,
		],
		rust: [
			`fn main() { println!("Hello!"); }`,
			`let x = vec![1, 2, 3].iter().sum();`,
			`fn add(a: i32, b: i32) -> i32 { a + b }`,
			`match result { Ok(v) => v, Err(_) => 0 }`,
			`pub struct User { pub name: String }`,
		],
		go: [
			`func main() { fmt.Println("Hello") }`,
			`func add(a, b int) int { return a + b }`,
			`ch := make(chan int)`,
			`if err != nil { return err }`,
			`var wg sync.WaitGroup`,
		],
	};

	const langSnippets = snippets[language] || snippets.javascript;
	return faker.helpers.arrayElement(langSnippets);
}

const feedbacks = [
	"This code is so bad that even your mother wouldn't approve. Use meaningful variable names instead of single letters!",
	"Congratulations! You've managed to write code that even a beginner would be ashamed of. Nested ternaries? Really?",
	"I've seen better code in a kindergarten's drawing. At least they know how to indent!",
	"This code is a crime against programming. Please stop immediately and learn the basics.",
	"Your code is so poorly written that I'm convinced you wrote it with your feet. Use functions properly!",
	"Wow! This is the worst code I've seen this week. And I browse Reddit for a living!",
	"This is why we can't have nice things. No error handling, no comments, no dignity.",
	"If this code were a person, it would be in jail. For multiple accounts of crimes against readability!",
	"Please, for the love of all that is holy, use proper naming conventions. 'x' and 'y' are not acceptable!",
	"I've seen more structure in a pile of spaghetti. At least spaghetti is edible!",
	"This code is so bad it's giving me physical pain. Use version control like a responsible developer!",
	"Your code looks like it was written during an earthquake. Please learn to indent!",
	"This is the programming equivalent of finger painting. But worse. Because finger painting has no bugs.",
	"I've reviewed code from nuclear reactors with better safety standards than this. Please add error handling!",
	"Debugging this would take longer than humanity has existed. Refactor immediately!",
	"This code is an insult to every developer who ever wrote clean code. Use meaningful names!",
	"If I had a penny for every bug in this code, I'd be richer than Elon Musk. Fix your logic!",
	"This is what happens when you code while angry. Take a break and rewrite everything!",
	"Your code is so messy it's like a tornado went through your IDE. Clean it up!",
	"I've seen more organized chaos in a toddler's toy room. Please use proper data structures!",
	"This code makes me want to cry. Please add comments so I can understand the suffering!",
	"You're the reason we can't have nice languages. Use modern JS features properly!",
	"This code is a masterclass in how not to write software. Please seek professional help!",
	"If this were a movie, it would get a 0% on Rotten Tomatoes. Rewrite it!",
	"This is why TypeScript exists. Use types! Please! I'm begging you!",
	"Your code has more bugs than a summer picnic. Add validation!",
	"I've seen better architecture in a Jenga tower. This is unstable and dangerous!",
	"This code would fail a job interview at McDonald's. Please learn the basics!",
	"You're making JavaScript cry. Use const/let instead of var!",
	"This is the programming equivalent of painting a car with a spray can. Use proper tools!",
];

const languages = ["javascript", "python", "typescript", "rust", "go"];
const statuses = [
	"excellent",
	"good",
	"needs-improvement",
	"bad",
	"terrible",
] as const;
const roastTypes = ["brutal", "friendly"] as const;

async function seed() {
	const db = drizzle(DB_URL, { schema: { submissions, roasts, leaderboard } });

	console.log("🌱 Starting seed...");

	const submissionIds: string[] = [];
	const roastIds: string[] = [];

	console.log("Creating 100 submissions and roasts...");

	for (let i = 0; i < 100; i++) {
		const language = faker.helpers.arrayElement(languages);
		const code = generateCodeSnippet(language);
		const ipHash = faker.string.alphanumeric(64);

		const [submission] = await db
			.insert(submissions)
			.values({
				code,
				language,
				ipHash,
			})
			.returning({ id: submissions.id });

		submissionIds.push(submission.id);

		const score = faker.number.int({ min: 0, max: 100 });
		const roastType = faker.helpers.arrayElement(roastTypes);
		const badgeStatus = faker.helpers.arrayElement(statuses);
		const feedback = faker.helpers.arrayElement(feedbacks);

		const [roast] = await db
			.insert(roasts)
			.values({
				submissionId: submission.id,
				score,
				feedback,
				roastType,
				badgeStatus,
			})
			.returning({ id: roasts.id });

		roastIds.push(roast.id);
	}

	console.log("Creating leaderboard entries...");

	const shameScores = Array.from({ length: 100 }, (_, i) => 100 - i);
	faker.helpers.shuffle(shameScores);

	for (let i = 0; i < 100; i++) {
		const authorName = faker.internet.username();
		const shameScore = shameScores[i];
		const submissionId = faker.helpers.arrayElement(submissionIds);

		await db.insert(leaderboard).values({
			submissionId,
			authorName,
			shameScore,
			rankPosition: i + 1,
		});
	}

	console.log("✅ Seed completed!");
	console.log(`   - Created ${submissionIds.length} submissions`);
	console.log(`   - Created ${roastIds.length} roasts`);
	console.log(`   - Created 100 leaderboard entries`);
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("Seed failed:", err);
		process.exit(1);
	});
