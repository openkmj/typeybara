import * as vscode from 'vscode'
import Renderer from './Renderer'
import WPMManager from './WPMManager'

const statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100,
)
const renderer = new Renderer(statusBarItem)
const wpmManager = new WPMManager()

const appplyConfiguration = () => {
  const config = vscode.workspace.getConfiguration('typeybara')
  const duration = (config.get('wpm.duration') ?? 5) as number
  WPMManager.MEASUREMENT_COUNT =
    (duration * 1000) / WPMManager.MEASUREMENT_DURATION

  const speed = (config.get('runner.speed') ?? 'Normal') as string
  if (speed === 'Fast') {
    Renderer.RUNNER_SPEED = 1.3
  } else if (speed === 'Normal') {
    Renderer.RUNNER_SPEED = 1
  } else if (speed === 'Slow') {
    Renderer.RUNNER_SPEED = 0.7
  }
  const runnerType = (config.get('runner.type') ?? 'Capybara') as string
  Renderer.RUNNER_TYPE = runnerType === 'None' ? '' : runnerType
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(statusBarItem)
  appplyConfiguration()

  renderer.render()
  wpmManager.start(s => {
    renderer.setDisplaySpeed(s)
  })

  vscode.workspace.onDidChangeConfiguration(e => {
    appplyConfiguration()
  })
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(e => {
      const text = e.contentChanges[0].text
      wpmManager.handleTextInput(text)
    }),
  )

  statusBarItem.show()
}

export function deactivate() {
  renderer.stop()
  wpmManager.stop()
  statusBarItem.dispose()
}
