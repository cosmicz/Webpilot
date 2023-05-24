import { askOpenAI, parseStream } from '@/io'

import { chunkActionExtractor, chunkHtmlCompressor, tickleAgentActionGenerator } from './models'
import { processHtml } from './parsers'

export async function executeTestChain(authKey: string, docString: string) {
  // const interactions = await extractInteractions(authKey, docString)
  const compressedHtml = await compressHtml(authKey, docString)

  // return interactions
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

export async function evalChunkedModel(lmodel: object, chunks: string[], authKey: string) {
  let results = []
  const ctx = {}

  // strip resultKey from model
  let { resultKey, ...model } = lmodel

  for (const chunk of chunks) {
    const content = { chunk, ctx }
    model = {
      ...model,
      messages: [
        ...model.messages,
        {
          role: 'user',
          content: JSON.stringify(content),
        },
      ],
    }
    const chunkResponseReader = await askOpenAI({ authKey, model })
    const chunkResponse = await parseStream(chunkResponseReader)
    const cleanedChunk = cleanUpJsonString(chunkResponse)
    const parsedChunk = JSON.parse(cleanedChunk)

    results = [...results, parsedChunk[resultKey]]
    // ctx = {...ctx, ...parsedChunk.ctx}
    mergeDeep(ctx, parsedChunk.ctx)
  }
  return { results, ctx }
}

export async function compressHtml(authKey: string, docString: string) {
  // DO NOT COMMIT
  authKey = authKey || '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'

  const { results: compressed, ctx } = await evalChunkedModel(
    chunkHtmlCompressor,
    processHtml(docString),
    authKey
  )

  console.log(compressed)
  console.log(ctx)

  return compressed
}

export async function extractInteractions(authKey: string, docString: string) {
  // DO NOT COMMIT
  authKey = authKey || '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'

  let interactions = []
  let ctx = {}
  for (const chunk of processHtml(docString)) {
    const content = { chunk, ctx }
    const model = {
      ...chunkActionExtractor,
      messages: [
        ...chunkActionExtractor.messages,
        {
          role: 'user',
          content: JSON.stringify(content),
        },
      ],
    }
    const chunkResponseReader = await askOpenAI({ authKey, model })
    const chunkResponse = await parseStream(chunkResponseReader)
    const cleanedChunk = cleanUpJsonString(chunkResponse)
    let parsedChunk
    try {
      parsedChunk = JSON.parse(cleanedChunk)
    } catch (error) {
      console.log('Got this error: ' + error)
      continue
    }

    interactions = [...interactions, parsedChunk.interactions]
    ctx = [...ctx, parsedChunk.ctx]
  }
  console.log(interactions)
  return interactions
}

function cleanUpJsonString(jsonString: string): string {
  // Replace single-quoted keys with double-quoted keys.
  jsonString = jsonString.replace(/'/g, '"')

  // Remove trailing commas.
  jsonString = jsonString.replace(/,\s*([\]}])/g, '$1')

  // Concatenate strings split with +
  jsonString = jsonString.replace(/"\s*\+\s*"/g, '')

  return jsonString
}

export async function getJSActions(authKey: string, interactions: JSON[]): Promise<string[]> {
  const actionsJavaScript = []
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
    console.log('interaction string: ' + interactionString)
    const actionJsReader = await askOpenAI({ authKey, model })
    const actionJs = await parseStream(actionJsReader)
    console.log("Current set of actions: " + actionJs)
    actionsJavaScript.push(actionJs)
  }

  return actionsJavaScript
}
