"use client"

import { useState, useRef } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Upload, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("qr-scanner")!

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState("")
  const [scanning, setScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)

    try {
      // Use jsQR library via CDN
      const image = new Image()
      const reader = new FileReader()

      reader.onload = (event) => {
        image.onload = () => {
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          
          if (!context) {
            throw new Error("Could not get canvas context")
          }

          canvas.width = image.width
          canvas.height = image.height
          context.drawImage(image, 0, 0)

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

          // Load jsQR dynamically
          import("jsqr").then(({ default: jsQR }) => {
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            })

            if (code) {
              setScannedData(code.data)
              toast({
                title: "QR Code Scanned",
                description: "Successfully decoded QR code",
              })
            } else {
              toast({
                title: "No QR Code Found",
                description: "Could not find a valid QR code in the image",
                variant: "destructive",
              })
            }
            setScanning(false)
          }).catch(() => {
            // Fallback message if jsQR is not available
            toast({
              title: "Library Not Available",
              description: "QR scanning library is not available. Please install jsqr package.",
              variant: "destructive",
            })
            setScanning(false)
          })
        }

        if (event.target?.result) {
          image.src = event.target.result as string
        }
      }

      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan QR code from image",
        variant: "destructive",
      })
      setScanning(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scannedData)
    toast({
      title: "Copied",
      description: "Scanned data copied to clipboard",
    })
  }

  const openLink = () => {
    if (scannedData.startsWith("http://") || scannedData.startsWith("https://")) {
      window.open(scannedData, "_blank")
    } else {
      toast({
        title: "Not a URL",
        description: "Scanned data is not a valid URL",
        variant: "destructive",
      })
    }
  }

  const isURL = scannedData.startsWith("http://") || scannedData.startsWith("https://")

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera" disabled>
              Camera (Coming Soon)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload QR Code Image</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={scanning}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {scanning ? "Scanning..." : "Choose Image"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPG, PNG, GIF, WebP formats
                </p>
              </CardContent>
            </Card>

            {/* Results */}
            {scannedData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Scanned Data</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      {isURL && (
                        <Button variant="outline" size="sm" onClick={openLink}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={scannedData}
                    readOnly
                    className="min-h-[150px] font-mono text-sm"
                  />
                  
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Data Type</p>
                    <p className="text-sm font-medium">
                      {isURL ? "🔗 URL" : 
                       scannedData.includes("@") ? "📧 Email" :
                       scannedData.startsWith("tel:") ? "📱 Phone" :
                       scannedData.startsWith("WIFI:") ? "📶 WiFi" :
                       scannedData.startsWith("BEGIN:VCARD") ? "👤 Contact Card" :
                       "📝 Text"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Supported QR Code Types:</strong><br />
                  • URLs and Links<br />
                  • Plain Text<br />
                  • Email Addresses<br />
                  • Phone Numbers<br />
                  • WiFi Credentials<br />
                  • Contact Cards (vCard)<br />
                  <br />
                  <strong>Note:</strong> All processing is done locally in your browser. Images are not uploaded to any server.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="camera">
            <Card>
              <CardContent className="p-8 text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Camera scanning will be available in a future update
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolWrapper>
  )
}
