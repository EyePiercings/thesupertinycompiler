function tokenizer(input) {

    // A variable for trackiing our position in the code like a cursor
    let current = 0;

    // And an array for pushing our tokens to.
    let tokens = [];

    while(current < input.length) {

        // Store the current character in 'input'
        let char = input[current];

        // The first thing we want to check for is an open paren.
        // Will be used later for 'CallExpression'

        if(char === '(') {

            // If so, push a new token with type 'paren' and set
            // val to open paren.
            tokens.push({
                type: 'paren',
                value: '(',                
            });

            // Then increment 'current'
            current++;

            // 'continue' onto the next cycle of loop.
            continue;
        }

        // Check for closing paren. Do same as before
        if (char === ')') {

            tokens.push({
                type: 'paren',
                value: ')',
            });
            current++;
            continue;
        }

        // Checking for whitespace. Don't need to store it as a token
        // so we're going to test for existence and if it does exist we're
        // gioing to 'continue' on.
        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // Check for number. Need to capture a sequence of characters as a
        // token since numbers could be any number of characters.
        //
        //  (add 123 456)
        //       ^^^ ^^^
        //       Only two separate tokens
        //
        // Start with first number in a sequence
        let NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {

            // Create a 'value' string that we push characters to
            let value = '';

            // We'll skip the opening double quote in our token.
            char = input([++currrent]);

            // Then we'll iterate through each character until we reach
            // another double quote.
            while(char !== '"') {
                value += char;
                char = input[++current];
            }

            // Skip the closing double quote.
            char = input[++current];

            // And add our 'string' token to the 'tokens' array.
            tokens.push({type: 'string', value});

            // And we continue on.
            continue;
        }

        // We'll also add support for strings in our language which will be any
        // text surrounded by double quotes (").
        //
        //  (concat "foo" "bar")
        //           ^^^   ^^^ string tokens
        //
        //  We'll start by checking for the opening quote:
        if (char === '"') {
            // Keep a 'value variable for building up our string token.
            let value = '';

            // We'll skip the opening double quote in our token.
            char = input[++current];

            // Then we'll iterate through each character untiul we reach
            // another double quote.
            while (char !== '"') {
                value += char;
                char = input[++current];
            }

            // Skip the closing double quote.
            char = input[++current];

            // And add our 'string' token to the 'tokens' array.
            tokens.push({ type: 'string', value});
            
            continue;
        }

        // The last type of token will be a 'name' token. This is a sequence
        // of letters instead of numbers, that are the names of functions in
        // our lisp syntax.
        //
        //  (add 2 4)
        //   ^^^
        //   Name token
        //
        let LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let value = '';

            // Again we're just going to loop through all the letters pushing them to 
            // a value.
            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }

            // And pushing that value as a token with the type 'name' and continuing.
            tokens.push({ type: 'name', value});
            
            continue;
        }

        // Finally if we have not matched a character by now, we're going to throw
        // an error and completely exit.
        throw new TypeError('I dont know what this character is: ' + char);
    }

    // Then at the end of our 'tokenizer' we simply return the tokens array.
    return tokens;
}

// Just exporting our tokenizer to be used in the final compiler...
module.exports = tokenizer;
