import {processHtml} from '@/magellan/parsers'

export default function StartButton() {
  return <button onClick={startAnalysis}>Go!</button>
}

const startAnalysis = () => {
  // Pull the current state (i.e. document.documentElement.outerHTML)
  // Send the current state to tickle agent, kick off that whole process
  let docString: string

  chrome.tabs.executeScript({code: 'document.documentElement.outerHTML'}, function (result) {
    docString = result[0]
  })

  const chunks = processHtml(docString)

  console.log(chunks)
}
