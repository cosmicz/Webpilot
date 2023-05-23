export default function StartButton() {
  return <button onClick={startAnalysis}>Go!</button>
}

const startAnalysis = () => {
  console.log('Analysis is about to start!')
}
