const API_TIMEOUT = 60000;
const MIN_PROCESSING_TIME = 6000;

const MODEL = "llama-3.3-70b-versatile";

async function callGroqWithTimeout(
	prompt: string,
	config: { temperature: number; maxOutputTokens: number },
): Promise<string> {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error("API timeout")), API_TIMEOUT);
	});

	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY environment variable is not set");
	}

	const apiPromise = fetch("https://api.groq.com/openai/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [{ role: "user", content: prompt }],
			temperature: config.temperature,
			max_tokens: config.maxOutputTokens,
		}),
	}).then(async (response) => {
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Groq API error: ${response.status} - ${error}`);
		}
		const data = await response.json();
		return data.choices?.[0]?.message?.content || "";
	});

	return Promise.race([apiPromise, timeoutPromise]);
}

export interface RoastAnalysis {
	score: number;
	verdict: string;
	quote: string;
	issues: Array<{
		severity: "critical" | "warning" | "good";
		title: string;
		description: string;
	}>;
	suggestedFix: string;
}

function calculateShameScore(score: number): number {
	return Math.round((10 - score) * 10);
}

function determineVerdict(score: number): string {
	if (score < 2) return "code_nightmare";
	if (score < 4) return "needs_serious_help";
	if (score < 6) return "room_for_improvement";
	if (score < 8) return "decent_work";
	return "actually_acceptable";
}

function determineBadgeStatus(
	issues: Array<{ severity: string }>,
): "critical" | "warning" | "good" {
	const criticalCount = issues.filter((i) => i.severity === "critical").length;
	const warningCount = issues.filter((i) => i.severity === "warning").length;

	if (criticalCount >= 2) return "critical";
	if (criticalCount >= 1 || warningCount >= 2) return "warning";
	return "good";
}

function getGenericMockIssues(
	isBrutal: boolean,
	language: string,
): Array<{
	severity: "critical" | "warning" | "good";
	title: string;
	description: string;
}> {
	const prefix = isBrutal
		? "So you think you're clever, huh?"
		: "A few observations:";

	return [
		{
			severity: isBrutal ? "warning" : "good",
			title: isBrutal
				? "This code is suspiciously clean..."
				: "Code is well-structured",
			description: isBrutal
				? `${prefix} Using proper patterns for ${language}? Almost professional!`
				: `Good use of ${language} features and clean architecture.`,
		},
		{
			severity: "good",
			title: "Proper use of types",
			description: isBrutal
				? `Oh look, someone actually knows ${language}!`
				: `${language} features used correctly.`,
		},
		{
			severity: isBrutal ? "warning" : "good",
			title: isBrutal ? `Using ${language} features` : "Modern patterns",
			description: isBrutal
				? `Did you copy this from Stack Overflow?`
				: "Clean use of modern patterns.",
		},
		{
			severity: "good",
			title: "Single responsibility",
			description: isBrutal
				? "Methods are small and focused. I... I have no sarcasm for this."
				: "Methods do one thing and do it well.",
		},
	];
}

function getGenericMockFix(language: string): string {
	const fixes: Record<string, string> = {
		c: `#include <stdio.h>
#include <string.h>

int main() {
    char password[64];
    printf("Enter password: ");
    if (fgets(password, sizeof(password), stdin) != NULL) {
        password[strcspn(password, "\\n")] = '\\0';
        printf("You entered: %s\\n", password);
    }
    return 0;
}`,
		cpp: `#include <iostream>
#include <string>

int main() {
    std::string password;
    std::cout << "Enter password: ";
    std::getline(std::cin, password);
    std::cout << "You entered: " << password << std::endl;
    return 0;
}`,
		typescript: `// Well, since you asked for it:
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService {
  private readonly users: Map<string, User> = new Map();

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<ReadonlyArray<User>> {
    return Array.from(this.users.values());
  }
}

export { User, UserService };`,
		javascript: `// Your code is already pretty good, but here's a slightly improved version:
class UserService {
  constructor() {
    this.users = new Map();
  }

  async createUser(data) {
    const user = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id) {
    return this.users.get(id);
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }
}

module.exports = { UserService };`,
		java: `// Here's the Java equivalent - still not as good as your TS though:
public class UserService {
    private final Map<String, User> users = new HashMap<>();

    public User createUser(String name, String email) {
        User user = new User(
            UUID.randomUUID().toString(),
            name,
            email,
            LocalDateTime.now()
        );
        users.put(user.getId(), user);
        return user;
    }

    public Optional<User> getUserById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
}`,
		python: `# Here's the Python version - whitespace sensitive but functional:
import uuid
from datetime import datetime
from typing import Optional, List

class UserService:
    def __init__(self):
        self._users: dict[str, dict] = {}
    
    def create_user(self, name: str, email: str) -> dict:
        user = {
            'id': str(uuid.uuid4()),
            'name': name,
            'email': email,
            'created_at': datetime.now()
        }
        self._users[user['id']] = user
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[dict]:
        return self._users.get(user_id)
    
    def get_all_users(self) -> List[dict]:
        return list(self._users.values())`,
		rust: `// Here's the Rust version - memory safe by default:
use std::collections::HashMap;

struct User {
    id: String,
    name: String,
    email: String,
}

struct UserService {
    users: HashMap<String, User>,
}

impl UserService {
    fn new() -> Self {
        Self { users: HashMap::new() }
    }

    fn create_user(&mut self, name: String, email: String) -> User {
        let id = uuid::Uuid::new_v4().to_string();
        let user = User { id: id.clone(), name, email };
        self.users.insert(id, user.clone());
        user
    }

    fn get_user_by_id(&self, id: &str) -> Option<&User> {
        self.users.get(id)
    }
}`,
	};

	return fixes[language] || fixes.typescript;
}

export async function generateRoast(
	code: string,
	language: string,
	roastType: "brutal" | "friendly",
): Promise<RoastAnalysis> {
	const isBrutal = roastType === "brutal";
	const temperature = isBrutal ? 1.4 : 1.0;

	const startTime = Date.now();

	let tone: string;
	if (isBrutal) {
		tone = `You are a sarcastic but fair code reviewer. You're witty and clever, not just mean. You give credit where it's due and criticize only when deserved.`;
	} else {
		tone = `You are a helpful, constructive code reviewer. Be friendly but still point out issues clearly and directly. Focus on helping the developer improve without being mean about it.`;
	}

	const securityRequirements =
		language === "c" || language === "cpp"
			? `
CRITICAL SECURITY CHECKS FOR C/C++ CODE:
- Division by zero: Check for x/0 or any variable that could be zero
- Buffer overflow: Check strcpy, strcat, sprintf, gets against buffer sizes
- Out of bounds: Check array accesses like array[n] where n >= array size
- Uninitialized variables: Check for variables used before assignment
- Null pointer dereference: Check for dereferencing NULL pointers
- Use after free: Check for accessing freed memory
- Format string vulnerabilities: Check printf/scanf with user input as format string
- Integer overflow: Check for arithmetic that could overflow
- Undefined behavior: ANY undefined behavior should be marked CRITICAL`
			: "";

	const prompt = `You are analyzing ${language} code.

PERSONALITY: ${tone}

${securityRequirements}

SCORE INTERPRETATION (0-10) - BE EXTREMELY FAIR:
- 0-1: SEVERE - Buffer overflow, SQL injection, code that DEFINITELY crashes, critical security vulnerabilities
- 2-3: BAD - Multiple critical bugs that cause actual failures, completely unsafe code
- 4-5: MEDIUM - Real problems like missing validation, severe bugs, major issues
- 6-7: OK - Small improvements possible, code works fine
- 8-9: GOOD - Near perfect, minor style preferences
- 10: PERFECT - Flawless

CRITICAL RULE - SIMPLE CODE DESERVES HIGH SCORES:
- "Hello World" or 1-3 lines of basic code = score 7-10 (not shameful!)
- console.log("hello") or print("hello") = score 8-10
- If the code does what it says it does, it deserves at least 6-10
- DO NOT penalize for using wrong language keyword if intent is clear (e.g., print vs console.log in JS)
- Length alone is NOT a valid reason for low scores

IMPORTANT REQUIREMENTS:
1. For simple code (1-5 lines, basic functionality): identify 1-2 minor suggestions or praise, score 7-10
2. For longer code: identify real issues but be fair - don't invent problems
3. The quote MUST be about SPECIFIC issues found, not generic criticism
4. The suggestedFix MUST be the corrected code that FIXES real issues found
5. Use DECIMAL scores (2.5, 3.7, 5.2, 6.8, etc.) - NOT just whole numbers
6. If score < 4, the issues MUST be genuinely critical (security, crashes, bugs)

Respond ONLY with valid JSON matching this exact schema:
{
  "score": (number 0-10, FAIR score based on actual problems found, use decimals like 2.5, 5.3, 7.8),
  "quote": (funny roast quote about this ${language} code, max 120 chars, mention SPECIFIC issues),
  "issues": [
    {
      "severity": "critical" or "warning" or "good",
      "title": "short title of the issue",
      "description": "explanation"
    }
  ],
  "suggestedFix": "The COMPLETE corrected ${language} code that FIXES ALL issues. NO text description - just ${language} code!"
}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with valid JSON, NO markdown, NO explanation outside JSON.`;

	try {
		const text = await callGroqWithTimeout(prompt, {
			temperature,
			maxOutputTokens: 800,
		});

		await new Promise((resolve) =>
			setTimeout(
				resolve,
				Math.max(0, MIN_PROCESSING_TIME - (Date.now() - startTime)),
			),
		);

		interface OpenRouterResponse {
			score?: number;
			quote?: string;
			issues?: Array<{
				severity: string;
				title: string;
				description: string;
			}>;
			suggestedFix?: string;
		}

		let parsed: OpenRouterResponse;
		try {
			parsed = JSON.parse(text);
		} catch {
			parsed = JSON.parse(text.replace(/```json\n?|```\n?/g, ""));
		}

		if (!parsed || typeof parsed.score !== "number") {
			return getMockAnalysis(roastType, language);
		}

		const issues =
			parsed.issues?.map((issue) => ({
				severity: issue.severity as "critical" | "warning" | "good",
				title: issue.title,
				description: issue.description,
			})) || [];

		while (issues.length < 4) {
			issues.push({
				severity: "warning",
				title: "Could be more idiomatic",
				description:
					"This pattern could be written in a more modern, readable way.",
			});
		}

		return {
			score: parsed.score,
			verdict: determineVerdict(parsed.score),
			quote: parsed.quote || "Code speaks louder than words.",
			issues,
			suggestedFix: parsed.suggestedFix || getGenericMockFix(language),
		};
	} catch (error) {
		console.error("[GEMINI] API call failed, using fallback:", error);
		return getMockAnalysis(roastType, language);
	}
}

function getMockAnalysis(
	roastType: "brutal" | "friendly",
	language: string,
): RoastAnalysis {
	const baseScore = roastType === "brutal" ? 4.5 : 6.5;
	const variance = (Math.random() - 0.5) * 3;
	const score = Math.round((baseScore + variance) * 10) / 10;
	const isBrutal = roastType === "brutal";

	const quotes = isBrutal
		? [
				"Saw better code in a tutorial from 2005.",
				"I'm not saying it's bad, but your variable names could use some creativity.",
				"This code would pass a CS101 exam. Barely.",
				"The indentation is inconsistent and it hurts my eyes.",
				"Nothing wrong here... except for everything.",
			]
		: [
				"This code is decent! A few minor improvements could help.",
				"Good effort! Here are some things to consider.",
				"Not bad at all! Some small tweaks would make it better.",
				"Clean and functional! Just some style suggestions.",
				"Well structured! A few optional improvements ahead.",
			];
	const quote = quotes[Math.floor(Math.random() * quotes.length)];

	return {
		score,
		verdict: determineVerdict(score),
		quote,
		issues: getGenericMockIssues(isBrutal, language),
		suggestedFix: getGenericMockFix(language),
	};
}

export function calculateRoastShameScore(score: number): number {
	return calculateShameScore(score);
}

export function getBadgeStatus(
	issues: Array<{ severity: string }>,
): "critical" | "warning" | "good" {
	return determineBadgeStatus(issues);
}
