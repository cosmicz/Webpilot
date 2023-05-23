import {askOpenAI} from '@/io'

import {chunkActionExtractor} from './models'
import {processHtml} from './parsers'

export async function executeTestChain(authKey: string, docString: string) {
  const interactions = await extractInteractions(authKey, docString)
  return interactions
}

export async function extractInteractions(authKey: string, docString: string) {
  let interactions = []
  for (const chunk of processHtml(html)) {
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
    interactions = [...interactions, await askOpenAI({authKey, model})]
    console.log(interactio)
    break
  }
  return interactions
}
