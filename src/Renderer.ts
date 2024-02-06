import {StatusBarItem} from 'vscode'

class Renderer {
  static ICON = [
    '$(capybara-1)',
    '$(capybara-2)',
    '$(capybara-3)',
    '$(capybara-4)',
    '$(capybara-5)',
  ]
  private statusBarItem
  private displaySpeed: number
  private iconIdx: number
  private renderTimerRef: NodeJS.Timeout | undefined
  constructor(statusBarItem: StatusBarItem) {
    this.statusBarItem = statusBarItem
    this.iconIdx = 0
    this.displaySpeed = 0
  }

  setDisplaySpeed(speed: number) {
    this.displaySpeed = speed
  }

  render() {
    if (this.displaySpeed === 0) {
      this.statusBarItem.text = `$(capybara-0) ${this.displaySpeed} wpm`
      this.iconIdx = 0
    } else {
      this.statusBarItem.text = `${Renderer.ICON[this.iconIdx]} ${this.displaySpeed} wpm`
      this.iconIdx = (this.iconIdx + 1) % 5
    }

    if (this.displaySpeed < 10) {
      this.renderTimerRef = setTimeout(() => {
        this.render()
      }, 1000 / 2)
    } else if (this.displaySpeed < 20) {
      this.renderTimerRef = setTimeout(() => {
        this.render()
      }, 1000 / 5)
    } else if (this.displaySpeed < 50) {
      this.renderTimerRef = setTimeout(() => {
        this.render()
      }, 1000 / 10)
    } else if (this.displaySpeed < 80) {
      this.renderTimerRef = setTimeout(() => {
        this.render()
      }, 1000 / 12)
    } else {
      this.renderTimerRef = setTimeout(() => {
        this.render()
      }, 1000 / 15)
    }
  }

  stop() {
    clearTimeout(this.renderTimerRef)
    this.renderTimerRef = undefined
    this.iconIdx = 0
    this.displaySpeed = 0
  }
}

export default Renderer
