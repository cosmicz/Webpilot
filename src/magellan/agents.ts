import { askOpenAI, parseStream } from '@/io'

import { chunkActionExtractor, tickleAgentActionGenerator } from './models'
import { processHtml } from './parsers'

export async function executeTestChain(authKey: string, docString: string) {
  const interactions = await extractInteractions(authKey, docString)
  return interactions
}

export async function extractInteractions(authKey: string, docString: string): Promise<JSON[]> {
  let interactions = []
  for (const chunk of processHtml(docString).slice(3, 6)) {
    const model = {
      ...chunkActionExtractor,
      messages: [
        ...chunkActionExtractor.messages,
        {
          role: 'user',
          content: chunk,
        },
      ],
    }
    const chunkResponseReader = await askOpenAI({ authKey, model })
    const chunkResponse = await parseStream(chunkResponseReader)
    // console.log('AAAAAAA')
    // console.log(chunkResponse)
    const cleanedChunk = cleanUpJsonString(chunkResponse)
    let parsedChunk
    try {
      parsedChunk = JSON.parse(cleanedChunk)
    } catch (error) {
      console.log("Got this error: " + error)
      continue
    }
    interactions.push(parsedChunk)
  }
  console.log(interactions)
  return interactions
}

function cleanUpJsonString(jsonString: string): string {
  // Replace single-quoted keys with double-quoted keys.
  jsonString = jsonString.replace(/'/g, '"')

  // Remove trailing commas.
<<<<<<< HEAD
  jsonString = jsonString.replace(/,\s*([\]}])/g, '$1')

  // Concatenate strings split with +
  jsonString = jsonString.replace(/"\s*\+\s*"/g, '')

=======
  jsonString = jsonString.replace(/,\s*([\]}])/g, '\$1')

>>>>>>> 6dc9e05 (Adding the tickle agent which returns only JS which needs to be run to tickle the page)
  return jsonString
}

export async function getJSActions(authKey: string, interactions: JSON[]): Promise<string[]> {
  let actionsJavaScript = []
  for (const interactionJson of interactions) {
    // For each interaction, ask the model to make JS from it
    const interactionString = JSON.stringify(interactionJson)
    const model = {
      ...tickleAgentActionGenerator,
      messages: [
        ...tickleAgentActionGenerator.messages,
        {
          role: 'user',
          content: interactionString,
        },
      ],
    }
    console.log("interaction string: " + interactionString)
    const actionJsReader = await askOpenAI({ authKey, model })
    const actionJs = await parseStream(actionJsReader)
    actionsJavaScript.push(actionJs)
  }

  return actionsJavaScript

  /* 

  JS output from this function:

  // Interaction 1: Click on "Sign Up" link
var signUpLink = document.querySelector("#react_menu-profile > ul > li:nth-child(1) > a");
if (signUpLink) {
  signUpLink.click();
}

// Interaction 2: Click on "Log In" link
var loginLink = document.querySelector("#react_menu-profile > ul > li:nth-child(2) > a");
if (loginLink) {
  loginLink.click();
},// Interaction 1: Select the search field and type in "Dogs"
      var searchField = document.querySelector("#simpleSearchAnimalType");
      if (searchField) {
        searchField.value = "Dogs";
      }
      
      // Interaction 2: Click on the "Dogs" button
      var dogsButton = document.querySelector("#quizzle-cards .quizzleCards-list .quizzleCard:nth-child(1) button.quizzleCard-link.small");
      if (dogsButton) {
        dogsButton.click();
      }
      
      // Interaction 3: Click on the "Cats" button
      var catsButton = document.querySelector("#quizzle-cards .quizzleCards-list .quizzleCard:nth-child(2) button.quizzleCard-link.small");
      if (catsButton) {
        catsButton.click();
      }
      
      // Interaction 4: Click on the "Other Animals" button
      var otherAnimalsButton = document.querySelector("#quizzle-cards .quizzleCards-list .quizzleCard:nth-child(3) button.quizzleCard-link");
      if (otherAnimalsButton) {
        otherAnimalsButton.click();
      }
      
      // Interaction 5: Click on the "Shelters & Rescues" button
      var sheltersAndRescuesButton = document.querySelector("#quizzle-cards .quizzleCards-list .quizzleCard:nth-child(4) button.quizzleCard-link");
      if (sheltersAndRescuesButton) {
        sheltersAndRescuesButton.click();
      }
      
      // Interaction 6: Click on the "Karma" pet card link
      var karmaLink = document.querySelector(".petCard a.petCard-link");
      if (karmaLink) {
        karmaLink.click();
      }


  */
}