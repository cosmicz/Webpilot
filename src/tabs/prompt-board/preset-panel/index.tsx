import {useRef} from 'react'

import PromptBoardHeader from '@/components/prompt-board-header'

import StartButton from '@/components/start-button'

export default function PresetPanel() {
  const element = useRef<HTMLElement>()

  return (
    <section className="preset-panel" ref={element}>
      <PromptBoardHeader />
      <StartButton />
    </section>
  )
}
