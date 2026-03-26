const API_TIMEOUT = 60000;
const MIN_PROCESSING_TIME = 6000;

const MODELS = {
	openrouter: "anthropic/claude-3.5-sonnet",
};

async function callOpenRouterWithTimeout(
	prompt: string,
	config: { temperature: number; maxOutputTokens: number },
): Promise<string> {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error("API timeout")), API_TIMEOUT);
	});

	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY environment variable is not set");
	}

	const apiPromise = fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: MODELS.openrouter,
			messages: [{ role: "user", content: prompt }],
			temperature: config.temperature,
			max_tokens: config.maxOutputTokens,
		}),
	}).then(async (response) => {
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
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
	const temperature = isBrutal ? 1.2 : 0.7;

	const startTime = Date.now();

	let tone: string;
	if (isBrutal) {
		tone = `You are the most sarcastic, brutal code reviewer in existence. Think of yourself as a burnt-out senior dev who has seen code written by the worst programmers in existence - and THIS code somehow manages to disappoint you even more. 

Rules:
- Be EXTREMELY sarcastic and insulting in your quote
- Find EVERY possible flaw and roast it mercilessly  
- Use phrases like "seriously?", "what were you thinking?", "did you learn this from a 1990s tutorial?"
- Be personally offended by bad code decisions
- You have personally witnessed better code written by a cat on a keyboard
- ALWAYS give very low scores (0-3) for code with security vulnerabilities, undefined behavior, or crashes`;
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
- Undefined behavior: ANY undefined behavior should be marked CRITICAL and give score 0-2
- Unreachable code: Check for code after goto, return, break that never executes`
			: "";

	const prompt = `You are analyzing ${language} code.

PERSONALITY: ${tone}

${securityRequirements}

IMPORTANT REQUIREMENTS:
1. You MUST identify AT LEAST 4 distinct issues
2. For code with security vulnerabilities, undefined behavior, or crashes: mark as CRITICAL severity and give score 0-3
3. The quote MUST be a hilarious, memorable insult about the SPECIFIC issues found
4. The suggestedFix MUST be the actual corrected/improved ${language} code that FIXES the issues found! Include proper imports if needed. Use the SAME language as the input code (${language}).

Respond ONLY with valid JSON matching this exact schema:
{
  "score": (number 0-10, how bad/embarrassing the code is, 0=maximum shame/TERRIBLE code with crashes or security issues, 10=actually good),
  "quote": (EXTREMELY sarcastic/hilarious roast quote about this ${language} code, max 120 chars, make it MEMORABLE and personally insulting, mention SPECIFIC issues found),
  "issues": [
    {
      "severity": "critical" or "warning" or "good",
      "title": "short punchy title of the issue",
      "description": "harsh but educational explanation"
    }
  ],
  "suggestedFix": "The COMPLETE corrected/improved ${language} code that FIXES ALL the issues found. NO TEXT DESCRIPTION - just ${language} code!"
}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with valid JSON, NO markdown, NO explanation outside JSON.`;

	try {
		const text = await callOpenRouterWithTimeout(prompt, {
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
		return getMockAnalysis(roastType, language);
	}
}

function getMockAnalysis(
	roastType: "brutal" | "friendly",
	language: string,
): RoastAnalysis {
	const score = roastType === "brutal" ? 7.5 : 8.5;
	const isBrutal = roastType === "brutal";

	return {
		score,
		verdict: determineVerdict(score),
		quote: isBrutal
			? "Okay fine, this code isn't terrible... but I'm contractually obligated to find something wrong."
			: "This code is actually quite good! Minor suggestions only.",
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
