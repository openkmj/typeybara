/**
 * WPMManager is for measuring the typing speed(words per minute).
 * It evaluates the speed by counting the number of characters typed over recent N seconds.
 */
class WPMManager {
  /**
   * Duration of one measurement(ms)
   */
  static readonly MEASUREMENT_DURATION = 500
  /**
   * Total number of measurements
   */
  static MEASUREMENT_COUNT = 10

  private cur: number[]
  private total: number[][]
  private measurementTimerRef: NodeJS.Timeout | undefined

  constructor() {
    this.cur = []
    this.total = []
  }

  /**
   * Start the typing speed measurement process.
   * @param callback callback function after each measurement.
   */
  start(callback: (measuredSpeed: number) => void) {
    this.measurementTimerRef = setInterval(() => {
      if (this.total.length >= WPMManager.MEASUREMENT_COUNT) {
        this.total.shift()
      }
      this.total.push(this.cur)
      this.cur = []
      const totalCharCount = this.total.reduce(
        (a, b) => a + b.reduce((c, d) => c + d, 0),
        0,
      )
      const charCountPerMeasurement = totalCharCount / this.total.length
      const charCountPerSecond =
        charCountPerMeasurement * (1000 / WPMManager.MEASUREMENT_DURATION)
      const charCountPerMinute = charCountPerSecond * 60
      const wordCountPerMinute = charCountPerMinute / 5
      const speed = Math.floor(wordCountPerMinute)
      callback(speed)
    }, WPMManager.MEASUREMENT_DURATION)
  }

  /**
   * Stop measurement and clear.
   */
  stop() {
    clearInterval(this.measurementTimerRef)
    this.measurementTimerRef = undefined
    this.cur = []
    this.total = []
  }

  /**
   * Handles input text by counting the length of the text and add to current measurement.
   * @param text input text
   */
  handleTextInput(text: string) {
    // Do not increase if space character
    if (text.trim().length === 0) {
      return
    }
    // Increase by 1 only. (handle pasting)
    this.cur.push(1)
  }
}

export default WPMManager
