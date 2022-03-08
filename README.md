# ITEM
A tool that allows one to use javascript to more efficiently write text documents.


# What is ITEM
ITEM is a tool used to write text documents. It is compiled to a txt format. It is designed to be a lightweight and simple tool that is easy to use and customize, that allows users to write text documents in an efficent manner.


# How to compile ITEM documents
ITEM can be compiled using the compiler, in the format of `item [input] <output>`. For example, if one wanted to compile a file named `document.item` to a file named `finishedDocument.txt`, they would run `item document.item finishedDocument.txt`. They could also just run `item document.item` and would receive their compiled file with the name `document.txt`.


# How to write and use ITEM
An ITEM document has multiple parts to it.

```js
// Everything before the '===' is interpreted as code and is not in the final document.

===
Header

Paragraph

Footer
```

Would compile to the following:

```txt
Header

Paragraph

Footer
```

This allows users to write javascript code without the code ending up in the final document.
<hr>

### The Write Function

You can add a string to the document using the `write()` function, which is created by the compiler.



```js
write(`Hello World.\n\n`)
===
Header

Paragraph

Footer
```

Would compile to the following:

```txt
Hello World.

Header

Paragraph

Footer
```
<hr>

### Compiler Macros

Compiler macros can be declared using `#define`. These are strings that are detected in the document and executed as code.

```js
#define helloWorld write(`Hello World.\n`);

===
helloWorld
helloWorld
```

Would compile to the following:

```txt
Hello World.

Hello World.

```

You can take inputs in macros using the * character.

```js
#define ${*} write(*)
#define :*: *

let words = ["eggs", "bacon", "breakfast"];

===

The current date is ${new Date()}

:for (let i = 0; i < words.length; i++)
    write(words[i] + ", ");:
```

Would compile to the following:

```txt

The current date is (Whatever the date is at compile time)

eggs, bacon, breakfast, 
```
<hr>

### Inclusion

Other scripts can be included to be run during compilation. This is done using `#include`.

```js
//math.js
console.log("Math has been imported."); // This message will show up during compilation. The same should apply to any other usage of `console.log`.

function sqrt(n) {
    return Math.sqrt(n);
}

let pi = Math.PI;
```


```js
#define ${*} *
#include "math.js"

===
${write(sqrt(270 * pi/180));}
```

Would compile to the following:

```
2.1708037636748028
```

### ITEMLib

Files can also be included globally, from the so-called `ITEMLib`. This is not a "standard library," this merely exists as a way to allow users to further customize their experience using ITEM. If a user has a script they use often, they may want to make it easier to access.

This is done as follows:
```js
// ITEMLib files can be accessed using angle braces instead of quotation marks.
#define ${*} *
#include <math.js>

===

${write(sqrt(270 * pi/180));}
```

The ITEMLib directory can be found in the same directory as the ITEM script.
