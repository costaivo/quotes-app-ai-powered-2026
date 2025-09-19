#!/usr/bin/env node

import { faker } from '@faker-js/faker';

// Set seed for consistent results during development
faker.seed(12345);

// Predefined quote templates to ensure realistic content
const quoteTemplates = [
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Your time is limited, don't waste it living someone else's life.",
  "Stay hungry, stay foolish.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The way to get started is to quit talking and begin doing.",
  "Life is what happens to you while you're busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "The only impossible journey is the one you never begin.",
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
  "Believe you can and you're halfway there.",
  "The only person you are destined to become is the person you decide to be.",
  "Go confidently in the direction of your dreams. Live the life you have imagined.",
  "When you have a dream, you've got to grab it and never let go.",
  "Nothing is impossible, the word itself says 'I'm possible'!",
  "There is nothing impossible to they who will try.",
  "The bad news is time flies. The good news is you're the pilot.",
  "Life has got all those twists and turns. You've got to hold on tight and off you go."
];

// Predefined author names for realistic results (mixed case to demonstrate normalization)
const authorNames = [
  "Steve Jobs",
  "eleanor roosevelt",
  "WINSTON CHURCHILL",
  "Maya Angelou",
  "albert einstein",
  "Nelson Mandela",
  "OPRAH WINFREY",
  "Martin Luther King Jr.",
  "mother teresa",
  "MAHATMA GANDHI",
  "Helen Keller",
  "walt disney",
  "THOMAS EDISON",
  "Henry Ford",
  "benjamin franklin",
  "Mark Twain",
  "OSCAR WILDE",
  "Ralph Waldo Emerson",
  "henry david thoreau",
  "DALE CARNEGIE"
];

// Predefined tag categories (mixed case to demonstrate normalization)
const tagCategories = [
  "inspiration",
  "MOTIVATION", 
  "Success",
  "life",
  "WISDOM",
  "dreams",
  "COURAGE",
  "perseverance",
  "Leadership",
  "innovation",
  "CREATIVITY",
  "philosophy",
  "Love",
  "happiness",
  "GROWTH",
  "change",
  "Time",
  "work",
  "PASSION",
  "purpose"
];

function generateQuote() {
  // Select a random quote template or generate a new one
  const useTemplate = faker.datatype.boolean({ probability: 0.7 });
  let quote;
  
  if (useTemplate) {
    quote = faker.helpers.arrayElement(quoteTemplates);
  } else {
    // Generate a new quote ensuring it's within the 1000 character limit
    const sentenceCount = faker.number.int({ min: 1, max: 3 });
    quote = faker.lorem.sentences(sentenceCount);
    
    // Ensure quote doesn't exceed 1000 characters
    if (quote.length > 1000) {
      quote = quote.substring(0, 997) + "...";
    }
  }

  // Select a random author
  const author = faker.helpers.arrayElement(authorNames);

  // Generate tags (1-3 tags, space-separated, max 500 characters total)
  // Note: Semicolons are not allowed in tag values due to validation rules
  // Tags will be normalized to lowercase, deduplicated, and sorted by the API
  const tagCount = faker.number.int({ min: 1, max: 3 });
  const selectedTags = faker.helpers.arrayElements(tagCategories, tagCount);
  let tags = selectedTags.join(' ');
  
  // Ensure tags don't exceed 500 characters
  if (tags.length > 500) {
    tags = tags.substring(0, 497) + "...";
  }

  return {
    quote: quote.trim(),
    author: author.trim(),
    tags: tags.trim()
  };
}

function generateMultipleQuotes(count = 1) {
  const quotes = [];
  for (let i = 0; i < count; i++) {
    quotes.push(generateQuote());
  }
  return quotes;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const count = args.includes('--count') ? 
    parseInt(args[args.indexOf('--count') + 1]) || 1 : 1;
  
  const pretty = args.includes('--pretty');
  
  const quotes = generateMultipleQuotes(count);
  
  if (count === 1) {
    const output = pretty ? JSON.stringify(quotes[0], null, 2) : JSON.stringify(quotes[0]);
    console.log(output);
  } else {
    const output = pretty ? JSON.stringify(quotes, null, 2) : JSON.stringify(quotes);
    console.log(output);
  }
}

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node generate-sample-quote.js [options]

Options:
  --count <number>  Generate multiple quotes (default: 1)
  --pretty         Format JSON output with indentation
  --help, -h       Show this help message

Examples:
  node generate-sample-quote.js
  node generate-sample-quote.js --count 5
  node generate-sample-quote.js --pretty
  node generate-sample-quote.js --count 3 --pretty

The generated quotes will respect the DTO validation constraints:
- quote: max 1000 characters, required
- author: max 200 characters, required  
- tags: max 500 characters, optional, space-separated (semicolons not allowed)

Tag and Author Normalization:
- Tags are normalized to lowercase, deduplicated, and sorted alphabetically
- Authors are case-insensitive deduplicated and sorted alphabetically
- Semicolons in tags will cause validation errors
`);
  process.exit(0);
}

// Run the script
main();
