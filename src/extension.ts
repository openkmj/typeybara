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
  const con = vscode.workspace.getConfiguration('typeybara')
  const duration = (con.get('wpm.duration') ?? 5) as number
  WPMManager.MEASUREMENT_COUNT =
    (duration * 1000) / WPMManager.MEASUREMENT_DURATION
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(statusBarItem)
  appplyConfiguration()

  renderer.render()
  wpmManager.start(s => {
    renderer.setDisplaySpeed(s)
  })

  vscode.workspace.onDidChangeConfiguration(e => {
    // apply configuration
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
