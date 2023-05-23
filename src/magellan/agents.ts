import {askOpenAI, parseStream} from '@/io'

import {chunkActionExtractor} from './models'
import {processHtml} from './parsers'

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
    const chunkResponseReader = await askOpenAI({authKey, model})
    const chunkResponse = await parseStream(chunkResponseReader)
    console.log('AAAAAAA')
    console.log(chunkResponse)
    const parsedChunk = eval(chunkResponse)
    console.log(parsedChunk)
    interactions = [...interactions, chunkResponse]
  }
  console.log(interactions)
  return interactions
}
