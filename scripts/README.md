# Scripts

This directory contains utility scripts for the Quotes Application.

## generate-sample-quote.js

A Node.js script that generates sample quote data for testing the Quotes API. The generated quotes respect all DTO validation constraints.

### Prerequisites

- Node.js (v14 or higher)
- pnpm (for dependency management)

### Installation

Dependencies are automatically installed when you run `pnpm install` in the project root.

### Usage

```bash
# Generate a single quote
node scripts/generate-sample-quote.js

# Generate multiple quotes
node scripts/generate-sample-quote.js --count 5

# Generate with pretty formatting
node scripts/generate-sample-quote.js --pretty

# Generate multiple quotes with pretty formatting
node scripts/generate-sample-quote.js --count 3 --pretty

# Show help
node scripts/generate-sample-quote.js --help
```

### Output Format

The script generates JSON objects with the following structure:

```json
{
  "quote": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "tags": "inspiration;work;passion"
}
```

### Validation Constraints

The generated quotes automatically respect the DTO validation constraints:

- **quote**: Required, maximum 1000 characters
- **author**: Required, maximum 200 characters  
- **tags**: Optional, maximum 500 characters, semicolon-separated

### Features

- Uses realistic quote templates and author names
- Generates semicolon-separated tags from predefined categories
- Ensures all generated data respects validation constraints
- Supports batch generation for testing multiple scenarios
- Includes help documentation and usage examples

### Integration with Postman

The generated quotes can be directly copied and pasted into the Postman collection requests for testing the Quotes API endpoints.

### Examples

```bash
# Quick test data generation
node scripts/generate-sample-quote.js --count 10 > test-quotes.json

# Generate sample for Postman
node scripts/generate-sample-quote.js --pretty | pbcopy  # macOS
node scripts/generate-sample-quote.js --pretty | xclip -selection clipboard  # Linux
```
