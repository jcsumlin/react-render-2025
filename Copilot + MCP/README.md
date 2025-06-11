## The shift from assistants to agents

- Copilot extensions that can understand intent.
- Can run across multiple files without manual intervention, no extra context switching involved.
- better at understanding broader tasks 
  -  User prompt -> plan -> act & observe -> back to plan (repeat) -> done
-  Depends on great communication skills to tell the agent what you want

### The addition of MCP (Multi-Context Prompting) 
- Breaking your prompts down is the most important part of the process.
- Don't ask for the world without building the foundation first. Make sure it knows what tools are available and be sure to iterate

MCP is an open standard inspired by apis and lsp:
- LSP language server protocol
- API application programming interface
- MCP modal context protocol
  - To standardizes how ai applications interact with external systems
    - Prompts 
    - Tools 
    - Resources
- MCP is managed by a json file in vscode where you will be able to provide api keys, urls, and other information to the agent.

### Vibe Coding 🎉 (Agent assisted coding)
- Make sure you VALIDATE the agent's response
- You can lay out custom instructions to tell the agent to program the way you do semantically. 
- Prompt files are usable to properly plan a feature or task.
- Sometimes you need to be explicit and tell it NOT to write code so that you can develop a proper plan.
- 

