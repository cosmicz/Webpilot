import {askOpenAI} from '@/io'

import {chunkActionExtractor} from './models'
import {splitDocument} from './parsers'

export async function extractInteractions(html: string) {
  let interactions = []
  for (const chunk of splitDocument(html)) {
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
    interactions = [...interactions, await askOpenAI(model)]
  }
  return interactions
}
