"use client"

import { useState, useEffect } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Copy, MapPin, Wifi } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("ip-lookup")!

interface IPInfo {
  ip: string
  city?: string
  region?: string
  country?: string
  loc?: string
  org?: string
  timezone?: string
  postal?: string
}

export default function IPLookupPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Auto-detect IP on load
    detectIP()
  }, [])

  const detectIP = async () => {
    setLoading(true)
    try {
      // Using ipify API for IP detection (free, no API key needed)
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()
      
      // Using ipapi.co for geolocation (free tier, no API key for basic usage)
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`)
      const geoData = await geoResponse.json()

      setIpInfo({
        ip: ipData.ip,
        city: geoData.city,
        region: geoData.region,
        country: geoData.country_name,
        loc: `${geoData.latitude}, ${geoData.longitude}`,
        org: geoData.org,
        timezone: geoData.timezone,
        postal: geoData.postal,
      })
    } catch (error) {
      toast({
        title: "Detection Error",
        description: "Failed to detect IP address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    })
  }

  const openMap = () => {
    if (ipInfo?.loc) {
      const [lat, lng] = ipInfo.loc.split(",").map(s => s.trim())
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")
    }
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Your IP Address</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically detected from your connection
                  </p>
                </div>
              </div>
              <Button onClick={detectIP} disabled={loading}>
                {loading ? "Detecting..." : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* IP Address */}
        {ipInfo && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">IP Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-6 h-6 text-primary" />
                    <span className="text-2xl font-bold font-mono">{ipInfo.ip}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(ipInfo.ip)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ipInfo.city && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">City</p>
                      <p className="font-semibold">{ipInfo.city}</p>
                    </div>
                  )}
                  {ipInfo.region && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Region</p>
                      <p className="font-semibold">{ipInfo.region}</p>
                    </div>
                  )}
                  {ipInfo.country && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Country</p>
                      <p className="font-semibold">{ipInfo.country}</p>
                    </div>
                  )}
                  {ipInfo.postal && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Postal Code</p>
                      <p className="font-semibold">{ipInfo.postal}</p>
                    </div>
                  )}
                  {ipInfo.timezone && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Timezone</p>
                      <p className="font-semibold">{ipInfo.timezone}</p>
                    </div>
                  )}
                  {ipInfo.loc && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold font-mono text-sm">{ipInfo.loc}</p>
                        <Button variant="ghost" size="sm" onClick={openMap}>
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ISP Info */}
            {ipInfo.org && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Internet Service Provider (ISP)</p>
                    <p className="font-semibold">{ipInfo.org}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Notice */}
            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <strong>Privacy Note:</strong> This tool detects your public IP address and approximate location based on your internet connection. 
                  The data is fetched from third-party APIs and is not stored by this application. 
                  Location accuracy may vary and typically shows your ISP's location rather than your exact physical location.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {!ipInfo && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Click "Refresh" to detect your IP address</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolWrapper>
  )
}
