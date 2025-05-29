export class BarcodeScanner {
  private video: HTMLVideoElement
  private stream: MediaStream | null = null
  private scanning = false
  private options: {
    barcodeDetector: any
    onDetected: (result: string) => void
  }

  constructor(
    video: HTMLVideoElement,
    options: {
      barcodeDetector: any
      onDetected: (result: string) => void
    },
  ) {
    this.video = video
    this.options = options
  }

  async start() {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser doesn't support getUserMedia")
      }

      // Get camera stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      // Set video source
      this.video.srcObject = this.stream
      this.video.setAttribute("playsinline", "true")

      // Play video
      await this.video.play()

      // Start scanning
      this.scanning = true
      this.scan()

      return true
    } catch (error) {
      console.error("Error starting barcode scanner:", error)
      return false
    }
  }

  stop() {
    this.scanning = false

    // Stop video
    if (this.video) {
      this.video.pause()
      this.video.srcObject = null
    }

    // Stop camera stream
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
  }

  private async scan() {
    if (!this.scanning) return

    try {
      // Check if BarcodeDetector is available
      if (this.options.barcodeDetector) {
        const detector = new this.options.barcodeDetector({
          formats: ["qr_code", "ean_13", "ean_8", "code_128", "code_39", "code_93", "upc_a", "upc_e"],
        })

        // Detect barcodes
        const barcodes = await detector.detect(this.video)

        if (barcodes.length > 0) {
          // Get the first barcode
          const barcode = barcodes[0]

          // Call onDetected callback
          this.options.onDetected(barcode.rawValue)

          // Stop scanning
          this.stop()
          return
        }
      } else {
        console.warn("BarcodeDetector not available")
      }
    } catch (error) {
      console.error("Error scanning barcode:", error)
    }

    // Continue scanning
    if (this.scanning) {
      requestAnimationFrame(() => this.scan())
    }
  }
}
