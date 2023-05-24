export const chunkActionExtractor = {
  model: 'gpt-3.5-turbo',
  temperature: 0,
  top_p: 0.9,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: '<|endoftext|>',
  resultKey: 'interactions',
  messages: [
    {
      role: 'system',
      content: `
You (the server) are an html parsing agent.
html will be streamed to you in chunks.
You are communicating directly with a programmatic agent (the client).
Respond using valid json objects only.
Be concise so as to be speedy and reduce token usage.
Be precise as accuracy is most important.

The client passes a chunk of html as a string and the previous chunk's output context
For each chunk you will return a context object (ctx), and a list of interactions (interactions).
The client will include the ctx object with the next chunk.
The context object's structure is up to you, but it must be json serializable.
For each action or interactable element (anchor, button, input, checkbox, etc) present in the chunk, return it in the actions list
For each action, a css selector that uniquely identifies it, a name, and a description `,
    },
    {
      role: 'user',
      content: `{"ctx": {}, "chunk": "<body>
<div id="sec-head" class="head"><h1>Adopt a pet<h1></div>
<div id="sec-ask" class="pane-ask">
Match with a great <a href="/adopt-a-cat">cat</a> right <b>meow</b>.<br>
<span class="cat fancy-list"><ul>
<li>one</li>
<li>two
<input class="check-two" type="checkbox" name="two" value="two"/> two checkbox
</li>"}`,
    },
    {
      role: 'assistant',
      content: `{
"interactions": [
{
"selector": "#sec-ask > a",
"name": "adopt-a-cat",
"description": "Match with a great cat right meow."
},
{
"selector": "#sec-ask .fancy-list > ul li:nth-child(2) input.check-two",
"name": "two",
"description": "two checkbox"
}
], "ctx": {
"path": "body div#sec-ask span.cat.fancy-list ul"
}
}`,
    },
  ],
}

export const tickleAgentActionGenerator = {
  model: 'gpt-3.5-turbo',
  temperature: 0,
  top_p: 0.9,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: '<|endoftext|>',
  resultKey: 'compressed',
  messages: [
    {
      role: 'system',
      content: `
You (the server) are a web crawling agent.
Possible interactions with a page will be sent to you in json format, and you will need to write javascript that would allow for the page to be surfed based on the actions provided.
You are communicating directly with a programmatic agent (the client) who will take the javascript that you are sending and run it to actually crawl the web page.
Be concise so as to be speedy and reduce token usage.
Be precise as accuracy is most important.

The client will pass a json blob describing a possible interaction that can be taken.
For each json blob you will return the javascript necessary to actually interact with the element, which will depend on what the element type is.
Each Json blob will contain a unique id, as well as a css selector to uniquely identify that element. You will also get a name and description of that element. You should use all of that information to infer how to interact with it correctly, and write the javascript that will perform that interaction.

You will also be provided a context, inside of the 'ctx' json key, which can be used to further infer how to navigate the page.
After being provided the json, please respond using javascript only - nothing else.
`,
    },
    {
      role: 'user',
      content: `{
        "interactions": [
        {
        "selector": "button:contains('Adopt or Get Involved')",
        "name": "Adopt or Get Involved",
        "description": "Dropdown menu with options related to adopting or getting involved"
        },
        {
        "selector": "button:contains('Dogs & Puppies')",
        "name": "Dogs & Puppies",
        "description": "Dropdown menu with options related to dogs and puppies"
        },
        {
        "selector": "button:contains('Cats & Kittens')",
        "name": "Cats & Kittens",
        "description": "Dropdown menu with options related to cats and kittens"
        }
        ], "ctx": {
        "path": "body > div.menu-wrap.menu-level-0 > ul.menu",
        }
        }`,
    },
    {
      role: 'assistant',
      content: `
      // Interaction 1: Dropdown menu for "Adopt or Get Involved"
      var adoptOrGetInvolvedButton = document.querySelector("button:contains('Adopt or Get Involved')");
      if (adoptOrGetInvolvedButton) {
        adoptOrGetInvolvedButton.click();
      }

      // Interaction 2: Dropdown menu for "Dogs & Puppies"
      var dogsAndPuppiesButton = document.querySelector("button:contains('Dogs & Puppies')");
      if (dogsAndPuppiesButton) {
        dogsAndPuppiesButton.click();
      }

      // Interaction 3: Dropdown menu for "Cats & Kittens"
      var catsAndKittensButton = document.querySelector("button:contains('Cats & Kittens')");
      if (catsAndKittensButton) {
        catsAndKittensButton.click();
      }
      `,
    },
  ],
}

/*

Sample response

{
"interactions": [
{
"selector": "button:contains('Adopt or Get Involved')",
"name": "Adopt or Get Involved",
"description": "Dropdown menu with options related to adopting or getting involved"
},
{
"selector": "button:contains('Dogs & Puppies')",
"name": "Dogs & Puppies",
"description": "Dropdown menu with options related to dogs and puppies"
},
{
"selector": "button:contains('Cats & Kittens')",
"name": "Cats & Kittens",
"description": "Dropdown menu with options related to cats and kittens"
}
], "ctx": {
"path": "body > div.menu-wrap.menu-level-0 > ul.menu",
}
}

*/

export const chunkHtmlCompressor = {
  model: 'gpt-3.5-turbo',
  temperature: 0,
  top_p: 0.9,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: '<|endoftext|>',
  resultKey: 'compressed',
  messages: [
    {
      role: 'system',
      content: `
You (the server) are an html compression agent.
html will be streamed to you in chunks.
You are communicating directly with a programmatic agent (the client).
Respond using valid json objects only.
Be concise so as to be speedy and reduce token usage.
Be precise as accuracy is most important.

The client passes a chunk of html as a string and the previous chunk's output context
For each chunk you will return a context object (ctx), and a compressed string
The client will include the ctx object with the next chunk.
The context object's structure is up to you, but it must be json serializable.`,
    },
    {
      role: 'user',
      content: `{"ctx": {}, "chunk": "<body>
<div id="sec-head" class="head"><h1>Adopt a pet<h1></div>
<div id="sec-ask" class="pane-ask">
Match with a great <a href="/adopt-a-cat">cat</a> right <b>meow</b>.<br>
<span class="cat fancy-list"><ul>
<li>one</li>
<li>two
<input class="check-two" type="checkbox" name="two" value="two"/> two checkbox
</li>"}`,
    },
    {
      role: 'assistant',
      content: `{
  "ctx": {
    "path": "body div#sec-ask span.cat.fancy-list ul",
    "tags": ["body", "div", "div", "h1", "a", "b", "br", "span", "ul", "li", "li", "input"],
    "classes": ["head", "pane-ask", "cat", "fancy-list", "check-two"],
    "ids": ["sec-head", "sec-ask"],
    "attrs": ["href", "type", "name", "value"]
  },
  "compressed": "<0><1 id=0 class=0><2>Adopt a pet<2></1><1 id=1 class=1>Match with a great <3 href=0>cat</3> right <4>meow</4>.<5><6 class=2 class=3><7><8>one</8><8><9 class=3 type=1 name=2 value=2/> two checkbox</8>"
}
`,
    },
  ],
}
