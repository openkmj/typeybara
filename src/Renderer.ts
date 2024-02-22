import {StatusBarItem} from 'vscode'

const RUNNER: {
  [key: string]: {
    default: string
    run: string[]
  }
} = {
  Capybara: {
    default: '$(capybara-0)',
    run: [
      '$(capybara-1)',
      '$(capybara-2)',
      '$(capybara-3)',
      '$(capybara-4)',
      '$(capybara-5)',
    ],
  },
}

/**
 * Renderer is for rendering icon and text in the status bar.
 */
class Renderer {
  static RUNNER_TYPE = 'Capybara'
  static RUNNER_SPEED = 1
  private statusBarItem
  private displaySpeed: number
  private iconIdx: number
  private renderTimerRef: NodeJS.Timeout | undefined
  constructor(statusBarItem: StatusBarItem) {
    this.statusBarItem = statusBarItem
    this.iconIdx = 0
    this.displaySpeed = 0
  }

  /**
   * Set screen refresh rete. Higher speed, fast running.
   * @param speed Text refresh rate(speed of capybara). Currently WPM.
   */
  setDisplaySpeed(speed: number) {
    this.displaySpeed = speed
  }

  /**
   * Starts rendering in the status bar. Replace text periodically.
   */
  render() {
    if (this.displaySpeed === 0) {
      if (Renderer.RUNNER_TYPE) {
        this.statusBarItem.text = `${RUNNER[Renderer.RUNNER_TYPE].default} ${this.displaySpeed} wpm`
      } else {
        this.statusBarItem.text = `${this.displaySpeed} wpm`
      }
      this.iconIdx = 0
    } else {
      if (Renderer.RUNNER_TYPE) {
        this.statusBarItem.text = `${RUNNER[Renderer.RUNNER_TYPE].run[this.iconIdx]} ${this.displaySpeed} wpm`
      } else {
        this.statusBarItem.text = `${this.displaySpeed} wpm`
      }
      this.iconIdx = (this.iconIdx + 1) % 5
    }

    if (this.displaySpeed < 10) {
      this.renderTimerRef = setTimeout(
        () => {
          this.render()
        },
        1000 / 2 / Renderer.RUNNER_SPEED,
      )
    } else if (this.displaySpeed < 20) {
      this.renderTimerRef = setTimeout(
        () => {
          this.render()
        },
        1000 / 5 / Renderer.RUNNER_SPEED,
      )
    } else if (this.displaySpeed < 50) {
      this.renderTimerRef = setTimeout(
        () => {
          this.render()
        },
        1000 / 10 / Renderer.RUNNER_SPEED,
      )
    } else if (this.displaySpeed < 80) {
      this.renderTimerRef = setTimeout(
        () => {
          this.render()
        },
        1000 / 12 / Renderer.RUNNER_SPEED,
      )
    } else {
      this.renderTimerRef = setTimeout(
        () => {
          this.render()
        },
        1000 / 15 / Renderer.RUNNER_SPEED,
      )
    }
  }

  /**
   * Stop rendering and clear.
   */
  stop() {
    clearTimeout(this.renderTimerRef)
    this.renderTimerRef = undefined
    this.iconIdx = 0
    this.displaySpeed = 0
  }
}

export default Renderer
