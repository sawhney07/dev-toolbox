"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Minimize2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("code-minifier")!

export default function CodeMinifierPage() {
  const [jsInput, setJsInput] = useState("")
  const [cssInput, setCssInput] = useState("")
  const [htmlInput, setHtmlInput] = useState("")
  const [jsOutput, setJsOutput] = useState("")
  const [cssOutput, setCssOutput] = useState("")
  const [htmlOutput, setHtmlOutput] = useState("")
  const { toast } = useToast()

  const minifyJS = () => {
    if (!jsInput.trim()) {
      setJsOutput("")
      return
    }

    let minified = jsInput
      // Remove single-line comments
      .replace(/\/\/.*$/gm, "")
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove spaces around operators and punctuation
      .replace(/\s*([{}();,:])\s*/g, "$1")
      // Remove spaces around operators
      .replace(/\s*([=+\-*/<>!&|])\s*/g, "$1")
      .trim()

    setJsOutput(minified)
  }

  const minifyCSS = () => {
    if (!cssInput.trim()) {
      setCssOutput("")
      return
    }

    let minified = cssInput
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove spaces around braces, colons, semicolons
      .replace(/\s*([{}:;,])\s*/g, "$1")
      // Remove last semicolon before closing brace
      .replace(/;}/g, "}")
      // Remove spaces around >
      .replace(/\s*>\s*/g, ">")
      .trim()

    setCssOutput(minified)
  }

  const minifyHTML = () => {
    if (!htmlInput.trim()) {
      setHtmlOutput("")
      return
    }

    let minified = htmlInput
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Remove extra whitespace between tags
      .replace(/>\s+</g, "><")
      // Remove leading/trailing whitespace
      .replace(/\s+/g, " ")
      .trim()

    setHtmlOutput(minified)
  }

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `Minified ${type} copied to clipboard`,
    })
  }

  const getCompressionRatio = (original: string, minified: string): string => {
    if (!original || !minified) return "0"
    const ratio = ((1 - minified.length / original.length) * 100).toFixed(1)
    return ratio
  }

  return (
    <ToolWrapper tool={tool}>
      <Tabs defaultValue="javascript" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>

        {/* JavaScript Tab */}
        <TabsContent value="javascript" className="space-y-6 mt-6">
          <div>
            <Label htmlFor="js-input" className="mb-2 block">
              JavaScript Code
            </Label>
            <Textarea
              id="js-input"
              placeholder="Paste your JavaScript code here..."
              value={jsInput}
              onChange={(e) => setJsInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={minifyJS} className="w-full">
            <Minimize2 className="w-4 h-4 mr-2" />
            Minify JavaScript
          </Button>

          {jsOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="js-output">Minified JavaScript</Label>
                <Button variant="outline" size="sm" onClick={() => handleCopy(jsOutput, "JavaScript")}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                id="js-output"
                value={jsOutput}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted"
              />
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-semibold">{jsInput.length.toLocaleString()} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Minified</p>
                      <p className="font-semibold">{jsOutput.length.toLocaleString()} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-semibold text-green-600">{getCompressionRatio(jsInput, jsOutput)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* CSS Tab */}
        <TabsContent value="css" className="space-y-6 mt-6">
          <div>
            <Label htmlFor="css-input" className="mb-2 block">
              CSS Code
            </Label>
            <Textarea
              id="css-input"
              placeholder="Paste your CSS code here..."
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={minifyCSS} className="w-full">
            <Minimize2 className="w-4 h-4 mr-2" />
            Minify CSS
          </Button>

          {cssOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="css-output">Minified CSS</Label>
                <Button variant="outline" size="sm" onClick={() => handleCopy(cssOutput, "CSS")}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                id="css-output"
                value={cssOutput}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted"
              />
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-semibold">{cssInput.length.toLocaleString()} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Minified</p>
                      <p className="font-semibold">{cssOutput.length.toLocaleString()} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-semibold text-green-600">{getCompressionRatio(cssInput, cssOutput)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* HTML Tab */}
        <TabsContent value="html" className="space-y-6 mt-6">
          <div>
            <Label htmlFor="html-input" className="mb-2 block">
              HTML Code
            </Label>
            <Textarea
              id="html-input"
              placeholder="Paste your HTML code here..."
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={minifyHTML} className="w-full">
            <Minimize2 className="w-4 h-4 mr-2" />
            Minify HTML
          </Button>

          {htmlOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="html-output">Minified HTML</Label>
                <Button variant="outline" size="sm" onClick={() => handleCopy(htmlOutput, "HTML")}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                id="html-output"
                value={htmlOutput}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted"
              />
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-semibold">{htmlInput.length.toLocaleString()} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Minified</p>
                      <p className="font-semibold">{htmlOutput.length.toLocaleString()} bytes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-semibold text-green-600">{getCompressionRatio(htmlInput, htmlOutput)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}
