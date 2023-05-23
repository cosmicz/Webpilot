export function processHtml(html) {
  // Parse the input HTML string into a DOM tree
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  stripHtmlOfEverything(doc)
  removeEmptyTags(doc)
  removeEmptySubtrees(doc)
  squashTree(doc)

  // Serialize the modified DOM tree back into an HTML string
  const serializer = new XMLSerializer()
  return serializer.serializeToString(doc.documentElement)
}

export function squashTree(doc) {
  // compress the tree to remove unnecessary intermediate elements
  // for example, <div><div><div>hello</div></div></div> becomes <div>hello</div>

  // Recursive function to traverse and modify the DOM tree
  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Process child nodes
      for (const child of Array.from(node.childNodes)) {
        processNode(child)
      }

      // If the element has only one child, and it's an element, and it has the same tag name, then squash it
      if (
        node.childNodes.length === 1 &&
        node.firstChild.nodeType === Node.ELEMENT_NODE &&
        node.firstChild.tagName.toLowerCase() === node.tagName.toLowerCase()
      ) {
        // Move the child's attributes to the parent
        for (const attr of Array.from(node.firstChild.attributes)) {
          node.setAttribute(attr.name, attr.value)
        }

        // Move the child's children to the parent
        while (node.firstChild.firstChild) {
          node.appendChild(node.firstChild.firstChild)
        }

        // Remove the child
        node.removeChild(node.firstChild)
      }
    }
  }

  // Process the DOM tree
  processNode(doc.documentElement)
}

export function stripHtmlOfEverything(doc) {
  // Recursive function to traverse and modify the DOM tree
  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Remove all attributes except class, id, and href
      for (const attr of Array.from(node.attributes)) {
        if (!['class', 'id', 'href'].includes(attr.name)) {
          node.removeAttribute(attr.name)
        }
      }

      // Remove script elements
      if (node.tagName.toLowerCase() === 'script') {
        node.parentNode.removeChild(node)
      } else {
        // Process child nodes
        for (const child of Array.from(node.childNodes)) {
          processNode(child)
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Remove unnecessary whitespace from text nodes
      node.textContent = node.textContent.trim().replace(/\s+/g, ' ')
    }
  }

  // Process the DOM tree
  processNode(doc.documentElement)
}

export function removeEmptyTags(doc) {
  // Recursive function to remove empty elements
  function removeEmptyElements(element) {
    // Iterate through the child nodes in reverse order
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
      const child = element.childNodes[i]
      removeEmptyElements(child)
    }

    // Check if the element is empty and remove it
    if (
      element.nodeType === Node.ELEMENT_NODE &&
      element.attributes.length === 0 &&
      element.childNodes.length === 0 &&
      !element.textContent.trim()
    ) {
      element.parentNode.removeChild(element)
    }
  }

  // Start the process with the document's body
  removeEmptyElements(doc.body)
}

export function hasInnerText(element) {
  if (element.nodeType === Node.TEXT_NODE && element.textContent.trim() !== '') {
    return true
  }

  for (const child of element.childNodes) {
    if (hasInnerText(child)) {
      return true
    }
  }

  return false
}

export function removeEmptySubtrees(element) {
  const childElements = Array.from(element.children)

  for (const child of childElements) {
    if (!hasInnerText(child)) {
      child.remove() // Remove the empty subtree [javascripttutorial.net](https://www.javascripttutorial.net/dom/manipulating/remove-a-dom-element/)
    } else {
      removeEmptySubtrees(child) // Recursively check its children
    }
  }
}

export function splitSubtrees(root) {
  const subtrees = []

  function traverse(node, subtree, depth) {
    if (node.nodeType === 1) {
      const serializedNode = node.outerHTML.slice(0, node.outerHTML.indexOf('>') + 1)
      const closingTag = `</${node.tagName}>`

      if (subtree.length + serializedNode.length + closingTag.length <= 2500) {
        subtree += serializedNode

        for (const child of node.childNodes) {
          subtree = traverse(child, subtree, depth + 1)
        }

        subtree += closingTag
      } else {
        if (subtree.length > 0) {
          subtrees.push(subtree)
        }
        subtree = serializedNode

        for (const child of node.childNodes) {
          subtree = traverse(child, subtree, depth + 1)
        }

        subtree += closingTag
      }
    } else if (node.nodeType === 3) {
      subtree += node.nodeValue
    }

    return subtree
  }

  const finalSubtree = traverse(root, '', 0)
  if (finalSubtree.length > 0) {
    subtrees.push(finalSubtree)
  }

  return subtrees
}

export function elementsToStrings(elements) {
  return Array.from(elements, el => el.innerText)
}

export function collectUserInputFields(doc) {
  const inputTypes = [
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week',
  ]
  const inputSelector = inputTypes.map(type => `input[type="${type}"]`).join(', ')
  const elements = doc.querySelectorAll(inputSelector)
  return Array.from(elements)
}

export function getInteractiveElements(document) {
  const interactiveElements = []

  // Extract buttons, inputs, select elements, and anchors
  const buttons = document.querySelectorAll('button')
  const inputs = document.querySelectorAll('input')
  const selects = document.querySelectorAll('select')
  const anchors = document.querySelectorAll('a')

  // Append the extracted elements to the interactiveElements array
  interactiveElements.push(...buttons, ...inputs, ...selects, ...anchors)

  // Return the array of interactive elements
  return interactiveElements
}
