// We define a traverser function which accepts an AST and a visitor.
// Inside we're going to define two functions...
function traverser(ast,visitor) {
    
    // A 'traverseArray' function that will allow us to interate over
    // an array and call the next function that we will define: 'traverseNode'.
    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent);
        });
    }

    // 'traverseNode' will accept a 'node' and its 'parent' node. So that it can 
    // pass both to our visitor methods.
    function traverseNode(node, parent) {

        // We start by testing for the existence of a method on the visitor with a 
        // matching 'type'.
        let methods = visitor[node.type];

        // If there is an 'enter' method for this node type we'll call it with the
        // 'node' and its 'parent'.
        if (methods && methods.enter) {
            methods.enter(node, parent);
        }

        // Next we are going to split things up by the current node type.
        switch (node.type) {

            // We'll start with our top level 'Program'. Since Program nodes have a
            // property named body that has an array of no0des, we will call
            // 'traverseArray' to traverse down into them.
            //
            // (Remember that 'traverseArray' will in turn call 'traverseNode' so we
            // causing the tree to be traversed recursively)
            case 'Program':
                traverseArray(node.body,node);
                break;

            // Traversing 'CallExpression''s 'params'
            case 'CallExpression':
                traverseArray(node.params,node);
                break;

            // No child nodes for 'NumberLiteral' and 'StringLiteral' so break.
            case 'NumberLiteral':
            case 'StringLiteral':
                break;

            // If we haven't recognized node type, throw error
            default:
                throw new TypeError(node.type);
        }

        // If there is an 'exit' method for this node type we'll call it with the
        // 'node' and its 'parent'
        if (methods && methods.exit) {
            methods.exit(node, parent);
        }
    }
    // Finally we kickstart the traverser by calling 'traverseNode' with our ast
    // with no 'parent' because the top level of the AST doesn't have a parent.
    traverseNode(ast, null);
}
module.exports = traverser;