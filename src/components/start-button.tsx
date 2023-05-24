import { MESSAGING_EVENT } from '@/config'
import useConfig from '@/hooks/use-config'
import { executeTestChain, getJSActions } from '@/magellan/agents'
import { processHtml } from '@/magellan/parsers'
import { sendToContentScript } from '@plasmohq/messaging'

export default function StartButton({
  authKey
}) {
  return <button onClick={() => startAnalysis(authKey)}> Go!</button >
}

const startAnalysis = async (authKey) => {
  // Pull the current state (i.e. document.documentElement.outerHTML)
  // Send the current state to tickle agent, kick off that whole process

  const docString = await sendToContentScript({ name: MESSAGING_EVENT.GET_DOCUMENT })

  const testChain = await executeTestChain(authKey, docString)

  const actions = await getJSActions(authKey, testChain)

  return actions
}
