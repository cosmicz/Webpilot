import { askOpenAI, parseStream } from '@/io'

import { chunkActionExtractor } from './models'
import { processHtml } from './parsers'

export async function executeTestChain(authKey: string, docString: string) {
  const interactions = await extractInteractions(authKey, docString)
  return interactions
}

export async function extractInteractions(authKey: string, docString: string) {
  let interactions = []
  for (const chunk of processHtml(docString)) {
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
    console.log('AAAAAAA')
    console.log(chunkResponse)
    const cleanedChunk = cleanUpJsonString(chunkResponse)
    const parsedChunk = JSON.parse(cleanedChunk)
    console.log(parsedChunk)
    interactions = [...interactions, chunkResponse]
  }
  console.log(interactions)
  return interactions
}

function cleanUpJsonString(jsonString) {
  // Replace single-quoted keys with double-quoted keys.
  jsonString = jsonString.replace(/'/g, '"');

  // Remove trailing commas.
  jsonString = jsonString.replace(/,\s*([\]}])/g, '\$1');

  return jsonString;
}
