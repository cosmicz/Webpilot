import { MESSAGING_EVENT } from '@/config'
import useConfig from '@/hooks/use-config'
import { processHtml } from '@/magellan/parsers'
import { sendToContentScript } from '@plasmohq/messaging'

export default function StartButton() {
  return <button onClick={startAnalysis}>Go!</button>
}

const startAnalysis = async () => {
  // Pull the current state (i.e. document.documentElement.outerHTML)
  // Send the current state to tickle agent, kick off that whole process

  const { config, setConfig } = useConfig()

  const docString = await sendToContentScript({ name: MESSAGING_EVENT.GET_DOCUMENT })
  console.log("The doc string I got: " + docString)

  const chunks = processHtml(docString)

  console.log(chunks)

  const testChain = executeTestChain(config.authKey, docString)

  console.log("Test chain: " + testChain)
  return testChain
}
