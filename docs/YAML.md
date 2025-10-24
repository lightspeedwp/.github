# YAML Frontmatter Schemas for GitHub, Copilot, Claude, and Gemini Files

A comprehensive breakdown of YAML frontmatter schemas for the following file types:

- GitHub issue and PR templates
- GitHub saved replies
- GitHub Copilot: custom instructions, prompt files, `AGENTS.md`, and `.chatmode.md`
- Claude agents (Anthropic YAML-based config)
- Gemini agents (Google)

For each, this guide includes:

- Maximum parameter set and required vs optional fields
- Example YAML frontmatter blocks
- Best practices and caveats
- Placeholder documentation next to each field
- Recommended folder/filename conventions
- YAML schema examples where available or inferred

## GitHub Issue Template Frontmatter (Issue Forms)

GitHub **issue templates** can use a YAML frontmatter (especially for the new **Issue Forms**) to define metadata and form fields. All issue form files **must** begin with at least three keys: `name`, `description` (often called “about” in legacy templates), and `body`[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=All%20issue%20form%20configuration%20files,value%20pairs). Additional optional keys let you preassign labels, assignees, etc. Here are the top-level frontmatter fields for an issue form template[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,repository%2C%20it%20will%20not%20be)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,using%20this%20template%20to%20have):

- **`name`** – Unique name for the template (appears in template picker UI) **(required)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,Required%20String).

- **`description`** – Short explanation of the template’s purpose (shown in picker UI) **(required)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=templates%2C%20including%20Markdown%20templates,Required%20String).

- **`body`** – An array defining the form fields and content blocks for the issue form **(required)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,assigned%20to%20issues%20created%20with).

- **`title`** – Default title that will pre-fill in the new issue title input **(optional)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=template,Optional%20String).

- **`labels`** – Labels to auto-apply on issue creation (array or comma-separated) **(optional)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,delimited%20string).

- **`assignees`** – GitHub usernames to auto-assign the issue to (array or comma-separated) **(optional)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,repository%2C%20it%20will%20not%20be).

- **`projects`** – GitHub Projects to auto-add the issue to (format `"OWNER/PROJECT-NUMBER"`) **(optional)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=to%20create%20a%20shared%20syntax,delimited%20string).

- **`type`** – Issue type to assign (if your organization uses custom issue types) **(optional)**[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,created%20with%20this%20template%20will).

Below is an **example** of a comprehensive issue form YAML frontmatter, including a variety of field types in the `body`. Comments (`# ...`) are added to explain each parameter and best practices:

`---`  
`name: "Bug Report"                      # Template name (must be unique in repo)`  
`description: "Report a bug in the project."  # Shown in the new issue template chooser`  
`title: "[Bug]: "                        # Default issue title prefix`  
`labels: ["bug", "needs-triage"]         # Labels to apply automatically`  
`assignees: ["octocat"]                  # Users to assign by default`  
`projects: ["my-org/42"]                 # Add issue to project board (org/project-number)`  
`type: bug                               # Issue type (if using typed issues in org)`

`body:`  
  `- type: markdown`  
    `attributes:`  
      `value: "## Thank you for reporting a bug!\nPlease fill out the sections below."`
      `# ^ A static guidance section (Markdown instructions for the user).`
      `# Note: Use quotes for text containing '#' or special YAML chars:contentReference[oaicite:11]{index=11},`  
      `# and use '|' for multi-line content as shown above.`

  `- type: input`  
    `id: "contact"`  
    `attributes:`  
      `label: "Contact Details"`  
      `description: "How can the team reach you for more info?"`  
      `placeholder: "e.g. email@example.com"`  
      `value: ""  # default can be left blank`  
    `validations:`  
      `required: false  # mark field optional (true would prevent submission if empty)`

  `- type: textarea`  
    `id: "steps"`  
    `attributes:`  
      `label: "Steps to Reproduce"`  
      `description: "Provide step-by-step instructions to reproduce the issue."`  
      `placeholder: |`  
        `1. Step one...`  
        `2. Step two...`  
        `3. *Feel free to add more steps as needed...*`  
      `value: ""  # you can pre-fill common steps or leave empty`  
      `render: markdown  # if provided, the submitted text will be formatted as a code block of this type (e.g. markdown, bash)`  
    `validations:`  
      `required: true  # this textarea must be filled in`

  `- type: dropdown`  
    `id: "browser"`  
    `attributes:`  
      `label: "Affected Browser(s)"`  
      `description: "Which web browsers show the issue?"`  
      `options:`  
        `- "Firefox"`  
        `- "Chrome"`  
        `- "Safari"`  
        `- "Edge"`  
      `multiple: true  # allow multiple selections`  
    `validations:`  
      `required: true   # at least one option must be selected`

  `- type: checkboxes`  
    `id: "agree"`  
    `attributes:`  
      `label: "Code of Conduct Agreement"`  
      `description: "Please confirm:"`
      `options:`  
        `- label: "I have searched for duplicate issues"`  
          `required: true   # this box must be checked to submit (ensures reporter did a search)`  
        `- label: "I agree to follow the project’s Code of Conduct"`  
          `required: true`  
`---`

In the **`body`** array above, we demonstrated each supported input type:

- **Markdown (`type: markdown`)** – Just static text guidance (not included in final issue content). Use this for instructions or banners. *Tip:* If using `#` in the text (for headings), wrap the value in quotes to prevent YAML treating it as a comment[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,if%20we%20need%20more%20info).

- **Text Input (`type: input`)** – Single-line text field. Supports `label`, `description`, `placeholder`, `value` (default text), and validations like `required`[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=%23%23%23%20Current%20Behavior%3A%20%3C%21,)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=1.%20See%20error...%20).

- **Textarea (`type: textarea`)** – Multi-line text field for longer input. Supports the same attributes as input, plus `render` (to automatically format user text as a code block of a given language)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=attributes%3A%20label%3A%20Relevant%20log%20output,attributes%3A%20label%3A%20Code%20of%20Conduct)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=description%3A%20Please%20copy%20and%20paste,Code%20of%20Conduct%5D%28https%3A%2F%2Fexample.com).

- **Dropdown (`type: dropdown`)** – Single or multi-select from a list of options. Requires an `options` list. You can set `multiple: true` for multi-select. If you include a `default:` index (0-based) in attributes, that option will be pre-selected[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=id%3A%20version%20attributes%3A%20label%3A%20Version,3%20%28Edge%29%20default%3A%200%20validations). Validation `required: true` means the user must select at least one[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,type%3A%20dropdown).

- **Checkboxes (`type: checkboxes`)** – A group of one or more checkbox items. Each option has a `label` (supports basic Markdown) and optionally `required: true` if that particular box must be checked[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=id%3A%20terms%20attributes%3A%20label%3A%20Code,Code%20of%20Conduct%20required%3A%20true). If any checkbox option is marked required, the form won’t submit until it’s checked (useful for “I agree” confirmations).

**Best Practices:**

- **Formatting:** Enclose the frontmatter between `---` lines at the top of the template file. Indentation is significant in YAML – use consistent two-space indents for nested fields.

- **Quoting:** Quote strings that contain special characters (like `:` or `#`) or begin with square brackets. For instance, the `title` value `[Bug]:` is quoted in YAML[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=name%3A%20%20Bug%20description%3A%20File,already%20exists%20for%20the%20bug) to avoid parsing issues.

- **Multiline Text:** Use the pipe `|` in YAML to input multiline default text or placeholders (as shown for the steps placeholder above) so that line breaks are preserved[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,if%20we%20need%20more%20info).

- **Required Fields:** Use `validations: required: true` judiciously – only when the issue cannot be submitted without that info. Otherwise, leave as optional to not frustrate contributors.

- **Unique IDs:** The `id` fields in inputs aren’t mandatory, but assigning them (alphanumeric, `-` or `_` only) can help reference responses programmatically (or for future automation).

- **Keep it Short:** While you can include many fields, try not to overwhelm the contributor. Only ask for information that is necessary to triage the issue.

## **GitHub Pull Request Template Frontmatter**

Pull request templates are simpler – GitHub **does not currently support form-style PR templates with YAML-defined inputs** (issue forms are for issues only)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=Issue%20forms%20are%20not%20supported,request%20template%20for%20your%20repository)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=When%20a%20contributor%20fills%20out,issue%20created%20through%20other%20methods). However, you *can* include a YAML frontmatter at the top of a PR template file to pre-specify metadata like title, labels, etc., but as of now, **GitHub ignores these frontmatter fields for PRs** – any frontmatter will simply remain in the text of the PR body (not parsed out)[stackoverflow.com](https://stackoverflow.com/questions/66392676/github-pull-request-template-detect-yaml-front-matter-using-config-yml-and-apply#:~:text=5). In practice, this means the YAML block would just be visible to users opening the PR, which is usually undesirable. (There is no PR template picker UI, unlike issues.)

For completeness, here are the **frontmatter keys** that parallel issue templates (even though they won’t be auto-applied by GitHub for PRs as of 2025):

- **`name`** – Name of the PR template (if multiple templates via query parameter).

- **`about`** – Description of the template’s use.

- **`title`** – Default title for pull requests using this template.

- **`labels`** – Labels to add to the PR.

- **`assignees`** – Users to assign to the PR.

These keys mirror the issue template keys (note: here it’s `about` instead of `description`). For example, a PR template might start like:

`---`  
`name: "Feature PR Template"`
`about: "Use this template for pull requests adding a new feature"`
`title: "feat: <brief description of feature>"`
`labels: enhancement, needs-review`
`assignees: octocat`
`---`

*Even though you can include such a frontmatter in a PR template file, GitHub will currently just display it as text in the PR body[stackoverflow.com](https://stackoverflow.com/questions/66392676/github-pull-request-template-detect-yaml-front-matter-using-config-yml-and-apply#:~:text=5).* Therefore, many repositories omit YAML frontmatter in PR templates altogether, and instead just provide a structured markdown checklist or guidance for the contributor. A good pull request template includes sections like “Linked Issue”, “Summary of Changes”, “Testing Instructions”, etc., written as comments or headings in Markdown (since those will guide the PR author).

**Best Practices:**

- If you include a YAML header in a PR template, be aware it won’t be processed by GitHub (it might confuse contributors seeing raw `---` lines). It’s often better to stick to plain Markdown for PR templates.

- Use HTML comments (`<!-- ... -->`) in the template to provide guidance that won’t appear in the final PR description. For example, `<!-- Describe the changes and why they are needed -->`.

- Encourage linking issues in the PR body (e.g., “Closes \#123”) and including screenshots or test output if applicable. These aren’t frontmatter parameters, but important content for PR quality.

*(Note: GitHub might add support for parsing PR template frontmatter in the future, but at the time of writing it’s not implemented[stackoverflow.com](https://stackoverflow.com/questions/66392676/github-pull-request-template-detect-yaml-front-matter-using-config-yml-and-apply#:~:text=5).)*

## **GitHub Saved Replies**

GitHub **saved replies** are canned responses for commenting on issues and PRs. They **do not use file-based YAML frontmatter** at all – instead, they are created and managed via the GitHub web UI (under your profile’s **Saved replies** settings)[docs.github.com](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies#:~:text=Creating%20a%20saved%20reply). Each saved reply simply has two pieces of metadata:

- **Title** – a short name you give the saved reply (for your own reference in the UI).

- **Body content** – the actual text (which can include Markdown formatting) that will be inserted when you use the saved reply.

For example, you might have a saved reply titled “Duplicate Issue Response” with a body like:

“Thank you for reporting this. We’re tracking this issue in \#XYZ, so I’ll close this as a duplicate. Please follow the other thread for updates.”

When you insert that saved reply, GitHub will populate the comment box with that message.

**Key points:**

- **No frontmatter file:** Saved replies are not stored in a repository file. They’re tied to your GitHub account. (There is no native way to define them in code or config files, thus no YAML format to document here.)

- **Usage:** You create/edit them via **Settings \> Saved replies**. Each reply’s title is just for your menu; it isn’t inserted into the comment. Only the body content gets inserted[docs.github.com](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies#:~:text=Using%20saved%20replies).

- **Markdown Support:** The body supports normal comment formatting (Markdown links, lists, etc.), so you can include checklists or bold text as part of the saved reply.

- **Best Practices:** Keep saved replies concise and general. You can always customise the inserted text after picking it, so they serve best as starting templates. For instance, it’s fine to include a placeholder like “\[issue link\]” in the saved reply text that you replace with a real link after insertion.

*(Since saved replies don’t utilize YAML, there are no frontmatter parameters to list here.)*

## **GitHub Copilot – Repository & Path-Specific Custom Instructions**

GitHub Copilot allows you to provide **custom instructions** to guide code suggestions. These can be set at different levels:

- **Personal instructions** (via your GitHub Copilot settings in your account) – not a file, just text you save in your profile.

- **Repository-wide instructions** – a special file in the repository.

- **Path-specific instructions** – files that apply only to certain files/paths in a repo.

For **repository-wide instructions**, create a Markdown file named **`.github/copilot-instructions.md`** at the root of your repo[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=Creating%20repository). This file contains plain Markdown text with whatever guidance you want Copilot to always consider for this repository. For example, you might describe coding style, architectural guidelines, or context about the project. There is *no YAML frontmatter needed or used* in this file – it’s just a Markdown document of instructions (whitespace and newlines don’t matter to Copilot; it treats it as one block of text)[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=2,the%20file%2C%20in%20Markdown%20format).

For **path-specific instructions**, create a folder `.github/instructions/`, and inside it one or more files with names like `XYZ.instructions.md` (the name can indicate the context). These files **do use YAML frontmatter** to specify where they apply. At the very top, include an `applyTo` key with a glob pattern (or multiple patterns) matching file paths[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=3,directories%20the%20instructions%20apply%20to)[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=). For example:

`---`  
`applyTo: "app/models/**/*.rb,app/controllers/**/*.rb"   # apply to all Ruby files in app/models or app/controllers`  
`---`  
`# Rails Model/Controller Conventions`

`- Follow Ruby on Rails idioms for models and controllers.`  
`- Ensure to include necessary unit tests for any new model methods.`

**Frontmatter fields for `*.instructions.md`:**

- **`applyTo`** – Glob pattern of files that this instructions file should apply to[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=3,directories%20the%20instructions%20apply%20to). Use Unix shell style globs (e.g. `"**/*.ts"` for all TypeScript files, or `"docs/**/*"` for anything under docs). You can specify multiple patterns by separating with commas[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=You%20can%20specify%20multiple%20patterns,use%20the%20following%20frontmatter%20block). For a file that should apply to all files in the repo, use `applyTo: "**"`[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=).

- **`description`** – *(Optional)* A short description of these instructions. In VS Code’s Copilot Chat UI, this description will show on hover or in the list of available instruction files[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-instructions#:~:text=Instructions%20files%20use%20the%20,extension%20and%20have%20this%20structure). This is mainly for your own organization; Copilot itself doesn’t use the description content for suggestions.

After the frontmatter, the rest of the file is just Markdown text describing the instructions (similar to the repo-wide file). **Whitespace or blank lines are ignored** by Copilot, so you can format the instructions for readability[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=2,the%20file%2C%20in%20Markdown%20format). You can even use Markdown links to reference other files or documentation within your instructions.

**Example path-specific instructions file:**

`---`  
`applyTo: "**/*.py"                        # apply to all Python files`  
`description: "Python code style guidelines for this repo"`  
`---`  
`# Python Coding Guidelines`

``- Follow PEP 8 style guide for Python code (use `black` for formatting).``  
`- Use type hints for all functions and methods.`  
`- Prefer list comprehensions and generator expressions for simple loops.`  
``- Avoid using wildcard `import` statements; import only what is needed.``

In the above, whenever Copilot is generating suggestions **while editing a `.py` file**, it will factor in these Python Coding Guidelines in addition to any repo-wide instructions. If multiple instruction files apply (say you had one for all backend code and one for Python specifically), all relevant instructions are combined.

**Best Practices:**

- Keep instruction statements **concise and in natural language** (Copilot works best with clear, high-level guidance). For example, “Use 4 spaces for indentation” or “All API calls must include error handling.”

- Use **separate files for distinct domains** – e.g., language-specific guidelines, or testing guidelines vs. deployment guidelines. This modular approach makes it easier to maintain. You can have many instruction files as needed.

- Name the files logically (the name before `.instructions.md` doesn’t affect function, but helps you identify it). For example, `python.instructions.md`, `frontend.instructions.md`, `security.instructions.md`, etc.

- Leverage the `applyTo` glob to target precisely. Be careful that your pattern isn’t too broad or too narrow. (Multiple patterns can be combined in one file if the instructions are identical.)

- **Tip:** In VS Code, you can manually attach an instructions file to a chat even if its pattern doesn’t auto-apply, via the *Add Context \> Instructions* option. This is useful if you want to use an instruction file in a one-off manner outside its auto scope.

## **GitHub Copilot – Custom Prompt Files (`.prompt.md`)**

Copilot also supports **reusable prompt files** (especially in VS Code’s Copilot Chat context). A prompt file is a Markdown file (with extension `.prompt.md`) that defines a specific prompt or task for the AI, which you can invoke easily. The file can include a YAML frontmatter header to configure how it runs[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=Prompt%20files%20are%20Markdown%20files,extension%20and%20have%20this%20structure). Here are the frontmatter fields for prompt files[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=):

- **`description`** – A short description of what the prompt does. This is used as tooltip or help text in the UI.

- **`mode`** – Which Copilot chat mode to execute the prompt in. Options: `"ask"`, `"edit"`, or `"agent"`.

  - **ask** \= default Q\&A chat mode,

  - **edit** \= the mode for modifying code,

  - **agent** \= the “agent” mode which can use tools.  
     If not specified, it defaults to the normal (currently selected) mode, which is typically “agent” for prompt files[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=,If%20not%20specified).

- **`model`** – The AI model to use for this prompt. If omitted, it uses whatever model is currently selected by the user. You can specify something like `"gpt-4"`, `"GPT-4 Code Assist"`, `"Claude 2"`, etc., depending on what models are available in your environment[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=,in%20model%20picker%20is%20used).

- **`tools`** – A list of tools or tool-set names that this prompt is allowed to use (only applicable if running in agent mode and if tools are available). For example, you might list `['terminal', 'browser', 'search']` to allow those tools during the prompt execution[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=,If). If a listed tool isn’t actually available, it will be ignored. (If not running in agent mode, tools list is ignored.)

After the frontmatter, the **body of the `.prompt.md` file** is where you write the actual prompt instructions, in Markdown. This can be multiple paragraphs, include code blocks, etc. You can also reference other files or other prompt/instruction files by relative Markdown links to avoid duplication[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=Reference%20other%20workspace%20files%2C%20prompt,location%20of%20the%20prompt%20file).

**Example prompt file with frontmatter:**

`---`  
`description: "Convert a code snippet into a well-documented function"`
`mode: "edit"                    # use edit mode (applies changes to code)`  
`model: "GPT-4"                  # ensure a powerful model for better docs`  
`tools: []                       # (no external tools needed for this prompt)`  
`---`  
`# Convert to Documented Function`

`Take the selected code and refactor it into a self-contained function with a clear name.`

`- The new function should have a concise docstring explaining its purpose, inputs, and output.`  
`- Add comments inside the function to explain complex logic, if any.`  
`- **Do not** change the external behavior of the code.`

`If the selected code is not a complete snippet (e.g., part of a larger expression), make an assumption to create a valid function.`

In this example, the prompt file (say we named it `refactor.prompt.md`) can be invoked in VS Code by typing `/refactor` in the Copilot chat, or by running a command. It tells Copilot (in edit mode) to transform the selected code into a documented function. The YAML header ensures it uses the edit mode and GPT-4 model.

**Notes and Best Practices:**

- When writing the prompt (body), clearly state the task and any format you expect in the answer. The AI will follow these instructions when you run the prompt.

- You can include **placeholders or variables** in prompt files. For instance, VS Code supports placeholders like `${selection}` (the currently selected text), `${file}` (current filename), or custom inputs like `${input:variableName}` where the user can supply additional data[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=Within%20a%20prompt%20file%2C%20you,can%20reference%20the%20following%20variables). In our example, we implicitly rely on the selected code (since it’s an edit mode prompt).

- **Link to instructions or other prompts:** You can compose prompt files by linking to other instruction files or prompt files. For example, you might have a general style guide in an instructions file and within your prompt say “Follow our Python style guide” to automatically bring in those rules[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=Reference%20other%20workspace%20files%2C%20prompt,location%20of%20the%20prompt%20file).

- Keep the `description` concise – think of it as tooltip text. It should summarize the prompt’s action (e.g., “Generate a release notes summary from commit messages”).

- The `mode` field is important: use *ask* for things that don’t involve editing code (just Q\&A or explanation), *edit* for code transformations, and *agent* if the prompt might require using tools (like browsing documentation, running tests, etc.)[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=,If%20not%20specified).

- Only list necessary `tools`. For instance, if your prompt needs to search the codebase or run a shell command, include those; otherwise leaving it empty (or omitting the field) is fine. Unnecessary tools can introduce side effects or extra context that might confuse the AI.

## **GitHub Copilot – Custom Chat Modes (`.chatmode.md`)**

**Custom chat modes** allow you to define an entirely new mode for Copilot Chat, with specialized behaviour or purpose. Each mode is defined in a file with extension `.chatmode.md`. The structure is similar to prompt files: an optional YAML frontmatter header, followed by Markdown instructions in the body[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=Chat%20mode%20files%20are%20Markdown,extension%20and%20have%20this%20structure)[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=).

**YAML frontmatter fields for chat modes**[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=)[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=,in%20model%20picker%20is%20used):

- **`description`** – A brief description of the chat mode’s purpose. This is displayed as placeholder text in the chat input when the mode is active and as a tooltip when hovering over the mode in the mode selector[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=,in%20model%20picker%20is%20used).

- **`tools`** – A list of tool names or predefined tool sets that are available in this mode[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=displayed%20as%20placeholder%20text%20in,and%20instructions%20in%20Markdown%20format). You might include built-in tools like `'terminal'`, `'browser'`, `'search'`, or any extension-contributed tools. (This works just like the `tools` field in prompt files, but here it defines tools for any prompt in this mode.)

- **`model`** – The AI model to use when this mode is active. If not specified, it will use whichever model the user has currently selected by default[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=contributed%20by%20extensions,in%20model%20picker%20is%20used). You can set this if the mode is best suited to a particular model (e.g., a lightweight model for quick responses, or a specific one like `"Claude Instant 1"` or `"GPT-4"` if available).

The body of the file contains the **detailed instructions or persona for that mode**. These instructions will be *prepended* or considered alongside the user’s inputs whenever this mode is used in chat. Essentially, this is where you set the behaviour. For example, a “SQL Assistant” mode might have instructions like “You are an expert SQL assistant. Answer all questions with SQL examples when possible,” etc. You can include whatever guidance needed, including sections, lists, or Markdown formatting.

You may also **reference other instruction or prompt files** in the mode’s body via Markdown links if you want to pull in shared rules (the content of those files will be included when the mode runs)[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=This%20is%20where%20you%20provide,when%20in%20this%20chat%20mode).

**Example of a custom chat mode file:**

`---`  
`description: "Plan new features without writing any code (outputs an implementation plan)"`  
`tools: ['search', 'codebase']   # allow searching the repository and codebase introspection`  
`model: "GPT-4"                  # use a powerful model for thorough analysis`  
`---`  
`# Planning Mode`

`You are in **Planning Mode**. Your job is to help plan out implementations for new feature requests or major refactors, without writing actual code.`

`When the user asks a question or provides a feature description in this mode:`  
 `- Do **not** produce any source code.`  
 `- Instead, break the problem down into a series of steps, considerations, or tasks.`  
 `- Provide the output as a Markdown document with sections for "Overview", "Requirements", "Implementation Plan", and "Testing Strategy".`

`Always ask for clarification if requirements are ambiguous. This mode is about high-level planning and clarification.`

In this example, we set up a mode that helps with planning. We gave it a description (which would show up as placeholder text like “Plan new features without writing code…” in the chat input when selected). We limited tools to just `'search'` and `'codebase'` (so it can search the project, but not run terminal commands or web fetches, for instance). We also specified the model as GPT-4 for better quality. The body instructions clearly state the role and what the assistant should and shouldn’t do in this mode.

**Using and creating chat modes:**

- Chat mode files for a **workspace** are typically stored in `.github/chatmodes/` (you may need to create this folder). You can also keep personal modes in your user profile (outside of any repo)[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=2,mode%20file%20should%20be%20created).

- Once a mode is created and the file is present, it will appear in the Copilot Chat interface as a selectable mode (alongside default modes like “Ask”, “Edit”, etc.). The `description` will show as ghost text in the input box, guiding the user on what that mode is for[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=).

- Provide a clear **name** for the mode by the file name itself. For example, `planning.chatmode.md` will create a mode named “planning” (VS Code will use the file name as the mode name).

- The YAML frontmatter is optional; if you omit, the mode will just use the current model and no special tool restrictions (which might be fine in some cases). However, providing at least a description is recommended for clarity.

- **Tool configuration:** Only list tools that are needed for the mode’s purpose. For instance, a “Web Research” mode might enable a browser or web search tool, whereas a “Code Cleanup” mode might only need access to the codebase and perhaps a terminal to run linters.

- **Testing:** After writing a mode’s instructions, test it by switching to that mode and prompting the assistant. Tweak the instructions as needed if the output isn’t as expected. For complex modes, sometimes breaking the instructions into bullet points (as in the example) helps the AI follow them systematically.

## **Unified Multi-Agent Instructions – `AGENTS.md`**

There is an emerging convention (sometimes called the “Agent Rules standard”) to use a file named **`AGENTS.md`** at the root of a project to provide guidelines that apply to *all* AI assistants/agents working on the repository[github.com](https://github.com/continuedev/continue/issues/6716#:~:text=The%20Agent%20Rules%20initiative%20proposes,continue%2Frules%2F%20system)[github.com](https://github.com/continuedev/continue/issues/6716#:~:text=,as%20natural%20language%20if%20none). Think of it as a central place to define coding conventions, architectural overviews, or any rules that any AI (whether GitHub Copilot, Claude, Gemini, or others) should follow when generating content for this repo.

In the context of **GitHub Copilot in VS Code**, an `AGENTS.md` file (if enabled in settings) will automatically be pulled into context for **all Copilot chat requests**, regardless of mode[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-instructions#:~:text=If%20you%20work%20with%20multiple,chat%20requests%20within%20this%20workspace). This is useful if you work with multiple AI backends (GitHub’s model, OpenAI’s, Anthropic’s, etc.) so they all get the same project-specific instructions.

**Format:** The `AGENTS.md` file is simply a Markdown file. Typically, it does **not require any YAML frontmatter** – you can just start with normal text or Markdown headings. For example, your `AGENTS.md` might contain:

`# Project AI Guidelines`

`- All code must follow the style guide in [CONTRIBUTING.md](CONTRIBUTING.md).`  
`- Assume the user is familiar with the project’s domain; avoid explaining basic concepts.`  
`- Prioritize security and privacy: do not output secrets or credentials, and mention security implications of code changes.`  
`- Every generated function *must* have a docstring.`

This would act as a set of universal instructions. Whenever Copilot (or other integrated agents) generate code or responses for this repository, they would ideally consider these guidelines. The **scope** of `AGENTS.md` is broad – by design it should hold rules that are generally applicable to any AI actions in the repo (akin to an `.editorconfig` but for AI).

**Do’s and Don’ts:**

- **Do include high-level or project-wide concerns**: e.g., “We use tabs, not spaces”, “No external library imports without approval”, “Follow OWASP security best practices”, etc.

- **Don’t include extremely granular instructions** that might only apply in certain contexts – those might be better in the specific prompt or handled by an `.instructions.md` for that context. `AGENTS.md` should be relatively static and universal.

- Typically, you don’t need `applyTo` patterns here, because it’s meant to always apply to everything (the tools or editors that support `AGENTS.md` treat it as global). Some tools or proposals allow YAML frontmatter in `AGENTS.md` to fine-tune applicability[github.com](https://github.com/continuedev/continue/issues/6716#:~:text=,as%20natural%20language%20if%20none), but generally you can omit it. The file is implicitly applied to all files/agents.

- Keep it maintainable: since many AI tools now look for `AGENTS.md`, it’s a single source of truth. Update it as your practices evolve. If it gets too long, consider splitting certain parts into more targeted instruction files (and you can reference them from `AGENTS.md` if needed).

**Note:** This concept is gaining traction to unify AI assistant behaviour across different platforms. GitHub’s documentation notes that instead of multiple `.instructions.md` files, you can also use a single `AGENTS.md` (or model-specific files like `CLAUDE.md`, `GEMINI.md` as noted below) and the “nearest” such file up the directory tree will be used[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=,by%20AI%20agents). The goal is to avoid duplicating rules for each AI vendor.

In summary, if you have a **mixed AI environment** or just want a one-stop config, `AGENTS.md` is the way to go. If you’re only using GitHub Copilot, `.github/copilot-instructions.md` plus selective instruction files might suffice, but there’s no harm in also having an `AGENTS.md` as a fallback for other tools (many third-party AI dev tools now check for this file).

## **Anthropic Claude – Custom Instructions (`CLAUDE.md`)**

Anthropic’s Claude (especially **Claude Code**, their coding assistant) allows project-specific customisation via a file commonly named **`CLAUDE.md`**. This file serves a purpose similar to `AGENTS.md` but specifically for Claude. According to Anthropic, Claude will automatically look for a file named `CLAUDE.md` in your repository and load it as part of its system prompt (what Anthropic calls a “memory file”) every time you start a Claude session in that project[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=System%20prompt%20availability).

**Format:** `CLAUDE.md` is a plain Markdown file. There is no required YAML frontmatter schema for it – you just fill it with any instructions or context you want Claude to always have. This could include things like coding style guidelines, a high-level overview of the project, important conventions, etc. Essentially, it’s a way to give Claude persistent knowledge or rules without having to repeat them in each prompt.

For example, `CLAUDE.md` might contain:

`# Claude Instructions for MyProject`

`**Project Overview:** This is a web application for online book reviews. It uses a Python Flask backend and a React frontend.`

`**Coding Style:** Follow PEP8 for Python code (use 4 spaces indentation, snake_case for functions). For JavaScript/React, follow Airbnb style guide.`

`**Testing:** Whenever you write new code, include unit tests (PyTest for backend, Jest for frontend).`

`**Do’s:**`
`- Be concise in explanations.`  
`- Use docstrings in all public functions.`

`**Don’ts:**`  
`- Don’t disclose any API keys or secrets that might be in the code.`  
`- Don’t make assumptions about user data; validate everything.`

When you open Claude in the context of this repo, it will read that file and incorporate these points into its responses. This mechanism is powerful for shaping Claude’s behaviour.

**Tips:**

- Think of `CLAUDE.md` as “setting the stage” for Claude. It’s loaded as part of Claude’s initial prompt. So it can contain a mix of factual info (project summary) and normative guidelines (style rules, etc.).

- You can use Markdown formatting, but remember that it’s primarily for you – the formatting (bold, headings) might slightly influence Claude (it might assume bold means important), but mostly it’s to keep the file organized.

- Keep it reasonably sized. Claude has context limits; a very large CLAUDE.md could consume a lot of tokens. Focus on the most important guidance.

- If you have multiple Claude-specific files (though typically one is enough), Claude will by default load the one in the root. Anthropic’s tooling might also recognize `docs/claude.md` or similar, but **the standard is root-level `CLAUDE.md`**.

**Note:** Claude also supports an **API for “sub-agents”** (discussed next) which use YAML frontmatter. But the top-level CLAUDE.md itself is straightforward Markdown. It’s essentially a special case of the more general `AGENTS.md` idea, dedicated just to Claude. GitHub’s Copilot integration notes that you can use a `CLAUDE.md` in combination with Copilot’s agent, presumably for when Copilot is backed by Claude or working alongside Claude[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=You%20can%20create%20one%20or,directory%20tree%20will%20take%20precedence).

## **Anthropic Claude – Custom Sub-Agents (YAML Configuration)**

Claude’s advanced **subagent** feature allows you to create multiple specialized AI “agents” under the main Claude agent. Each sub-agent is defined by a Markdown file with a YAML frontmatter header that Claude reads to configure that agent’s identity and permissions[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=Subagent%20configuration)[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=Subagents%20are%20defined%20as%20Markdown,or%20from%20your%20user%20scope). These are usually stored in a `.claude/agents/` directory (for project-specific agents) or `~/.claude/agents/` (for user-wide agents)[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=Claude%20Code%20supports%20custom%20AI,Markdown%20files%20with%20YAML%20frontmatter).

A subagent file’s **YAML frontmatter** typically includes:

- **`name`** – The name of the subagent. This is how you will invoke it (Claude can be prompted to delegate tasks to an agent by name)[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=,plus%20the%20system%20prompt).

- **`description`** – A short description of what the subagent’s role or specialty is[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=,plus%20the%20system%20prompt). Claude may use this to decide when to auto-delegate tasks. It’s also useful documentation for you and your team.

- **`tools`** – *(Optional)* A list of tools that this subagent is allowed to use[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=). Claude operates with a set of tools (like reading files, writing files, running shell commands, web search, etc.). By specifying `tools` here, you **whitelist** which ones the subagent can access. If you omit `tools`, the subagent inherits all the tools available to the main Claude session (which might be too permissive in some cases)[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=%60Use%20the%20implementer,presets). For tighter control, list only what it needs (e.g., maybe a “DatabaseAgent” only gets read/write database access, nothing else).

After the frontmatter, the rest of the file is the **subagent’s prompt/instructions** – essentially a dedicated system prompt for that subagent. This is where you describe in detail how the subagent should behave, its step-by-step approach, or any domain knowledge it should have.

**Example subagent file (`architect-review.md`):**

`---`  
`name: "architect-review"`  
`description: "Architect Agent – validates designs against constraints and produces an architecture decision record."`  
`tools: ["Read", "Search"]  # e.g., can read files and search documentation, but not write code`  
`---`  
`You are the **Architect** sub-agent. Your goal is to review proposed software designs or feature specifications and ensure they meet the system's constraints and best practices.`

`When activated, you will:`  
``- Read the feature specification from the repository (`specs/` directory).``  
`- Analyze it for compliance with our scalability and security requirements.`  
`- Output an **Architecture Decision Record (ADR)** with sections for Context, Decision, Rationale, and Consequences.`

`You should not write any code. Focus only on architectural guidance. If the spec is unclear, list assumptions or ask for clarification.`

In this file, the YAML header gives the subagent a name (“architect-review”), a description, and limits its tools. The body instructs it on exactly what to do when called. Claude’s main agent can be asked, *“Use the architect-review subagent on the new feature spec,”* and it will spin up this specialized agent with these instructions to perform that task[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=%2A%20Usage%3A%20Claude%20can%20auto,presets).

**Key Points for Claude Subagents:**

- Store project subagents in the repository under `.claude/agents/`. This makes them shareable with the team (and version controlled). User-level (global) agents go in `~/.claude/agents/` on your machine[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=Claude%20Code%20supports%20custom%20AI,Markdown%20files%20with%20YAML%20frontmatter).

- The **filename** isn’t directly used as the name; it’s the `name:` in YAML that counts. However, by convention, you might name the file the same as the agent name for clarity.

- The `description` should be action-oriented, because Claude can auto-select subagents based on descriptions. For instance, if the description says “writes unit tests”, Claude might automatically use that agent when a task is about testing.

- If `tools` is not specified, the subagent can use any tool the main agent has, which might be fine for general-purpose agents. If you want to sandbox an agent, list only specific tools. For example, a “QA” agent might only need read access (to verify code) and perhaps run tests, but not write access.

- You can define multiple subagents to form a pipeline. For example, one subagent could be “planner”, another “coder”, another “tester”, each with its own YAML config and instructions, and you orchestrate them (often using Claude’s **hooks** or by manual prompts)[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=%2A%20Reproducibility%3A%20Stop%20re,and%20hooks%20codify%20repeatable%20steps)[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=We%20started%20with%20a%20three,that%E2%80%99s%20generic%20to%20any%20stack).

- **Best practices:** Give each subagent one clear responsibility (single responsibility principle)[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=1%29%20Single). Keep their instructions focused on that role. This makes the overall AI workflow more reliable and easier to troubleshoot.

- **Security:** Use the `tools` limitation to prevent a subagent from doing things it shouldn’t. For instance, a planning agent probably doesn’t need the `Execute` (shell command) tool. And as noted in Anthropic’s docs, if you want to exclude access to certain files entirely, you’d configure that in Claude’s permissions (which is outside the scope of the YAML, done in `.claude/settings.json`)[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=,working%20directories%20that%20Claude%20has)[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=,to%20prevent%20%60bypassPermissions).

In summary, Claude’s subagents use YAML frontmatter for **metadata and permissions** and Markdown body for the **agent’s persona/instructions**. It’s a powerful system to split tasks among “expert” agents.

## **Google Gemini – Custom Instructions (`GEMINI.md`)**

Google’s **Gemini** (an AI model from Google) is still relatively new on the scene for code assistance, and detailed public documentation on project-specific config is sparse. However, we can draw parallels from patterns established by others and hints from tools:

GitHub’s Copilot documentation and community standards suggest that you can use a **`GEMINI.md`** file at the root of your repository to provide custom instructions when using a Gemini-based AI assistant[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=You%20can%20create%20one%20or,directory%20tree%20will%20take%20precedence). This is analogous to `CLAUDE.md` for Claude. For example, if an AI extension or tool uses Google’s Gemini model to assist with your code, it could check for `GEMINI.md` to preload instructions.

Since specifics aren’t officially published, we’ll assume **`GEMINI.md` is treated like a free-form instructions file**, just like `CLAUDE.md`. That means likely no required YAML keys, just Markdown content (unless a specific tool layer adds its own frontmatter options).

What might you put in a `GEMINI.md`? Probably similar content to CLAUDE.md or AGENTS.md: high-level guidelines, project overview, dos/don’ts for the AI. For example:

`# Gemini Instructions for MyProject`

`This project is a machine learning pipeline for image classification.`

`- The codebase is primarily TensorFlow (Python) and some C++ for performance-critical components.`  
`- **Style Guidelines:** Follow Google Python style guide. In C++ code, follow Google C++ style.`  
`- **Important:** Do not use external packages that are not already in the requirements.txt.`  
`- Focus on clarity and maintainability over cleverness.`

`If asked to produce a solution, prefer simple implementations and add comments explaining any non-obvious steps.`

If a Gemini-powered tool is being used, it would incorporate those notes.

**Parameters for custom agents:** If in the future tools allow more structured config for Gemini, it would likely mirror the structure of subagents (name, description, etc.) if Gemini supports multiple specialized agents. There’s also mention that some CLI tools (Codex CLI, Aider, etc.) and potentially a “Gemini CLI” support the same **Agent Rules** standard (i.e., `AGENTS.md`)[github.com](https://github.com/continuedev/continue/issues/6716#:~:text=The%20Agent%20Rules%20initiative%20proposes,continue%2Frules%2F%20system). This means Gemini might already respect a unified format with YAML frontmatter if present. For now, though, a single `GEMINI.md` with plain text instructions is the safe bet.

**Best Practices:**

- Treat `GEMINI.md` much like `CLAUDE.md`: keep it concise and focused on things unique to your project or preferences.

- Since Gemini is from Google and likely tuned with different data, be explicit about things like privacy or licensing constraints in your instructions (e.g., “Don’t suggest any solution that would violate our licence terms” if relevant).

- Update the file as the project evolves – if certain frameworks are deprecated or new conventions adopted, reflect that in the instructions.

**Note:** If you’re not actively using any Gemini-based coding assistant, you don’t need a GEMINI.md yet. But some teams include it preemptively as part of adopting the `AGENTS.md` convention, in case collaborators use different AI tools. It doesn’t harm anything to have it there. In the future, we expect more concrete schemas or tools for Gemini; until then, stick to the general guidance approach.

---

**Summary:** The table below recaps the **YAML frontmatter fields** discussed for each file type:

- **Issue Template (YAML form)** – `name`, `description` (or `about`), `title`, `labels`, `assignees`, `projects`, `type`, and a structured `body` with `type`, `id`, `attributes`, and `validations` for each input[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,repository%2C%20it%20will%20not%20be)[docs.github.com](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms#:~:text=,using%20this%20template%20to%20have).

- **PR Template** – *(same fields as issue template, but not currently parsed by GitHub)*[stackoverflow.com](https://stackoverflow.com/questions/66392676/github-pull-request-template-detect-yaml-front-matter-using-config-yml-and-apply#:~:text=,request%20assignees%3A%20self).

- **Saved Reply** – *no YAML (title & body managed via UI)*.

- **Copilot Repo Instructions** – *no YAML needed (just markdown content in* `.github/copilot-instructions.md`*)*.

- **Copilot Path Instructions** – `applyTo` (pattern) and optional `description` in frontmatter[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=3,directories%20the%20instructions%20apply%20to)[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-instructions#:~:text=,Body%3A%20Instructions%20in%20Markdown%20format); body is markdown instructions.

- **Copilot Prompt File** – `description`, `mode` (`ask|edit|agent`), `model`, `tools` in frontmatter[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/prompt-files#:~:text=); body is the prompt text.

- **Copilot Chat Mode** – `description`, `tools`, `model` in frontmatter[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/customisation/custom-chat-modes#:~:text=,in%20model%20picker%20is%20used); body is mode-specific instructions.

- **AGENTS.md** – *generally no fixed fields; global instructions for all AIs (some tools may parse frontmatter if included, but typically just markdown content)*.

- **Claude CLAUDE.md** – *no fixed fields; markdown instructions for Claude*[docs.claude.com](https://docs.claude.com/en/docs/claude-code/settings#:~:text=System%20prompt%20availability).

- **Claude Subagent** – `name`, `description`, `tools` (optional) in frontmatter[pubnub.com](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/#:~:text=,plus%20the%20system%20prompt); body is that agent’s system prompt.

- **Gemini GEMINI.md** – *no known fixed schema; markdown instructions (analogous to CLAUDE.md)*[docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#:~:text=You%20can%20create%20one%20or,directory%20tree%20will%20take%20precedence).

By using the above configurations, you can customise issue and PR workflows on GitHub, as well as tailor AI assistants (like Copilot, Claude, and eventually Gemini) to better suit your project’s needs. Each file has a specific role – from guiding human contributors (templates) to guiding AI behaviour (instructions and prompts). Use them in combination for the best effect (for instance, an issue template can gather structured data from a user, and your Copilot instructions can remind the AI to utilize that data when generating code or responses).
