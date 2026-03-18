# How to Build Effective Prompts for AI

## 1. Be Clear and Specific
- **What it means**: Provide explicit details about what you want
- **Example**: Instead of "Write code," say "Write a Python function that validates email addresses using regex"
- **Why it matters**: Vague prompts lead to generic or irrelevant responses

## 2. Provide Context
- Include relevant background information
- Specify your skill level or constraints
- Mention the purpose or intended use case
- **Example**: "I'm a beginner in JavaScript. Show me how to fetch data from an API and handle errors"

## 3. Break Down Complex Tasks
- Divide large requests into smaller, manageable steps
- Ask for one thing at a time when clarity is needed
- **Example**: Instead of asking for a full app in one prompt, ask for the data model first, then the UI, then the API

## 4. Use Examples
- Show AI what you want with examples or patterns
- Provide sample input/output formats
- **Example**: "Here's a JSON structure I'm using... Can you help me validate it?"

## 5. Specify the Format and Style
- State how you want the answer formatted
- Mention the tone or style you prefer
- **Example**: "Explain this in simple terms, like I'm 10 years old" or "Provide the answer as a bulleted list"

## 6. Set Constraints
- Mention limitations like word count, file size, or complexity level
- Specify technical requirements
- **Example**: "Keep it under 50 lines of code" or "Use only standard library imports"

## 7. Ask for Explanations
- Request explanations alongside code or solutions
- Ask "why" to deepen understanding
- **Example**: "Here's my code. Why is this inefficient and how can I improve it?"

## 8. Iterate and Refine
- If the first response isn't quite right, provide feedback
- Ask clarifying questions to guide the AI
- **Example**: "That's close, but I need it to handle edge cases like empty arrays"

## 9. Be Explicit About Your Goals
- State whether you want to learn, build something, or troubleshoot
- Mention if you prefer detailed explanations or just the solution
- **Example**: "I'm trying to understand how closures work in JavaScript, not just get code"

## 10. Review and Verify
- Don't automatically trust AI output
- Verify code works and explanations are accurate
- Cross-reference with documentation when possible
- **Example**: Test code before deploying and validate facts against official sources

## Tips for Best Results

✓ **Do**: Ask follow-up questions
✓ **Do**: Provide code snippets or error messages when relevant
✓ **Do**: Specify your preferred programming language/framework
✓ **Do**: Ask for pros and cons of different approaches

✗ **Don't**: Assume AI understands implicit context
✗ **Don't**: Ask too many things in one prompt
✗ **Don't**: Accept answers without verification
✗ **Don't**: Give up after one attempt—refine your prompt

## Example of a Well-Structured Prompt

"I'm building a Node.js REST API using Express. I'm a junior developer trying to learn best practices. Can you show me how to create a middleware that validates incoming JSON request bodies and returns a 400 error with a descriptive message if validation fails? Please include an explanation of why this pattern is useful."

This prompt:
- ✓ Specifies the tech stack (Node.js, Express)
- ✓ Provides context (junior developer, learning)
- ✓ Is specific about requirements (validate JSON, return 400 with message)
- ✓ Asks for explanation (learning-focused)
- ✓ Is reasonable in scope
