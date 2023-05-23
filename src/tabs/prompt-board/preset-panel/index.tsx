import { useRef } from 'react'

import PromptBoardHeader from '@/components/prompt-board-header'

import StartButton from '@/components/start-button'
import useConfig from '@/hooks/use-config'

export default function PresetPanel() {
  const element = useRef<HTMLElement>()

  const { config, setConfig } = useConfig()

  return (
    <section className="preset-panel" ref={element}>
      <PromptBoardHeader />
      <StartButton authKey={config.authKey} />
    </section>
  )
}
