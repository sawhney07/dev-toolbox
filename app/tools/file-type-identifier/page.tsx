"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileType, Upload, Search } from "lucide-react"

const tool = getToolById("file-type-identifier")!

interface FileInfo {
  extension: string
  mimeType: string
  category: string
  description: string
}

const FILE_TYPES: Record<string, FileInfo> = {
  // Images
  jpg: { extension: ".jpg", mimeType: "image/jpeg", category: "Image", description: "JPEG Image" },
  jpeg: { extension: ".jpeg", mimeType: "image/jpeg", category: "Image", description: "JPEG Image" },
  png: { extension: ".png", mimeType: "image/png", category: "Image", description: "PNG Image" },
  gif: { extension: ".gif", mimeType: "image/gif", category: "Image", description: "GIF Image" },
  webp: { extension: ".webp", mimeType: "image/webp", category: "Image", description: "WebP Image" },
  svg: { extension: ".svg", mimeType: "image/svg+xml", category: "Image", description: "SVG Vector Image" },
  bmp: { extension: ".bmp", mimeType: "image/bmp", category: "Image", description: "Bitmap Image" },
  ico: { extension: ".ico", mimeType: "image/x-icon", category: "Image", description: "Icon File" },
  
  // Documents
  pdf: { extension: ".pdf", mimeType: "application/pdf", category: "Document", description: "PDF Document" },
  doc: { extension: ".doc", mimeType: "application/msword", category: "Document", description: "Word Document" },
  docx: { extension: ".docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", category: "Document", description: "Word Document (Modern)" },
  xls: { extension: ".xls", mimeType: "application/vnd.ms-excel", category: "Document", description: "Excel Spreadsheet" },
  xlsx: { extension: ".xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", category: "Document", description: "Excel Spreadsheet (Modern)" },
  ppt: { extension: ".ppt", mimeType: "application/vnd.ms-powerpoint", category: "Document", description: "PowerPoint Presentation" },
  pptx: { extension: ".pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", category: "Document", description: "PowerPoint Presentation (Modern)" },
  txt: { extension: ".txt", mimeType: "text/plain", category: "Document", description: "Text File" },
  rtf: { extension: ".rtf", mimeType: "application/rtf", category: "Document", description: "Rich Text Format" },
  
  // Video
  mp4: { extension: ".mp4", mimeType: "video/mp4", category: "Video", description: "MP4 Video" },
  avi: { extension: ".avi", mimeType: "video/x-msvideo", category: "Video", description: "AVI Video" },
  mov: { extension: ".mov", mimeType: "video/quicktime", category: "Video", description: "QuickTime Video" },
  wmv: { extension: ".wmv", mimeType: "video/x-ms-wmv", category: "Video", description: "Windows Media Video" },
  flv: { extension: ".flv", mimeType: "video/x-flv", category: "Video", description: "Flash Video" },
  webm: { extension: ".webm", mimeType: "video/webm", category: "Video", description: "WebM Video" },
  mkv: { extension: ".mkv", mimeType: "video/x-matroska", category: "Video", description: "Matroska Video" },
  
  // Audio
  mp3: { extension: ".mp3", mimeType: "audio/mpeg", category: "Audio", description: "MP3 Audio" },
  wav: { extension: ".wav", mimeType: "audio/wav", category: "Audio", description: "WAV Audio" },
  ogg: { extension: ".ogg", mimeType: "audio/ogg", category: "Audio", description: "OGG Audio" },
  m4a: { extension: ".m4a", mimeType: "audio/mp4", category: "Audio", description: "M4A Audio" },
  flac: { extension: ".flac", mimeType: "audio/flac", category: "Audio", description: "FLAC Lossless Audio" },
  aac: { extension: ".aac", mimeType: "audio/aac", category: "Audio", description: "AAC Audio" },
  
  // Archives
  zip: { extension: ".zip", mimeType: "application/zip", category: "Archive", description: "ZIP Archive" },
  rar: { extension: ".rar", mimeType: "application/vnd.rar", category: "Archive", description: "RAR Archive" },
  "7z": { extension: ".7z", mimeType: "application/x-7z-compressed", category: "Archive", description: "7-Zip Archive" },
  tar: { extension: ".tar", mimeType: "application/x-tar", category: "Archive", description: "TAR Archive" },
  gz: { extension: ".gz", mimeType: "application/gzip", category: "Archive", description: "GZIP Archive" },
  
  // Code
  js: { extension: ".js", mimeType: "text/javascript", category: "Code", description: "JavaScript File" },
  ts: { extension: ".ts", mimeType: "text/typescript", category: "Code", description: "TypeScript File" },
  jsx: { extension: ".jsx", mimeType: "text/jsx", category: "Code", description: "JSX File" },
  tsx: { extension: ".tsx", mimeType: "text/tsx", category: "Code", description: "TSX File" },
  py: { extension: ".py", mimeType: "text/x-python", category: "Code", description: "Python File" },
  java: { extension: ".java", mimeType: "text/x-java-source", category: "Code", description: "Java File" },
  cpp: { extension: ".cpp", mimeType: "text/x-c++src", category: "Code", description: "C++ Source File" },
  c: { extension: ".c", mimeType: "text/x-csrc", category: "Code", description: "C Source File" },
  cs: { extension: ".cs", mimeType: "text/x-csharp", category: "Code", description: "C# File" },
  php: { extension: ".php", mimeType: "text/x-php", category: "Code", description: "PHP File" },
  rb: { extension: ".rb", mimeType: "text/x-ruby", category: "Code", description: "Ruby File" },
  go: { extension: ".go", mimeType: "text/x-go", category: "Code", description: "Go File" },
  rs: { extension: ".rs", mimeType: "text/x-rust", category: "Code", description: "Rust File" },
  
  // Web
  html: { extension: ".html", mimeType: "text/html", category: "Web", description: "HTML File" },
  htm: { extension: ".htm", mimeType: "text/html", category: "Web", description: "HTML File" },
  css: { extension: ".css", mimeType: "text/css", category: "Web", description: "CSS File" },
  scss: { extension: ".scss", mimeType: "text/x-scss", category: "Web", description: "SCSS File" },
  sass: { extension: ".sass", mimeType: "text/x-sass", category: "Web", description: "Sass File" },
  json: { extension: ".json", mimeType: "application/json", category: "Web", description: "JSON File" },
  xml: { extension: ".xml", mimeType: "application/xml", category: "Web", description: "XML File" },
  yaml: { extension: ".yaml", mimeType: "text/yaml", category: "Web", description: "YAML File" },
  yml: { extension: ".yml", mimeType: "text/yaml", category: "Web", description: "YAML File" },
}

export default function FileTypeIdentifierPage() {
  const [filename, setFilename] = useState("")
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const identifyByExtension = () => {
    if (!filename.trim()) return

    const ext = filename.includes(".") 
      ? filename.split(".").pop()?.toLowerCase() 
      : filename.toLowerCase()

    if (ext && FILE_TYPES[ext]) {
      setFileInfo(FILE_TYPES[ext])
    } else {
      setFileInfo({
        extension: ext ? `.${ext}` : "",
        mimeType: "Unknown",
        category: "Unknown",
        description: "Unknown file type"
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const ext = file.name.split(".").pop()?.toLowerCase()
      
      if (ext && FILE_TYPES[ext]) {
        setFileInfo({
          ...FILE_TYPES[ext],
          mimeType: file.type || FILE_TYPES[ext].mimeType
        })
      } else {
        setFileInfo({
          extension: ext ? `.${ext}` : "",
          mimeType: file.type || "Unknown",
          category: "Unknown",
          description: "Unknown file type"
        })
      }
      setFilename(file.name)
    }
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* By Extension */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Identify by Extension
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filename">Filename or Extension</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="filename"
                  placeholder="e.g., document.pdf or just pdf"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && identifyByExtension()}
                />
                <Button onClick={identifyByExtension}>
                  Identify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* By Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Identify by Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
              <Input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileType className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload a file</p>
                <p className="text-xs text-muted-foreground mt-1">
                  File will be analyzed locally - not uploaded to any server
                </p>
              </label>
              {uploadedFile && (
                <p className="mt-4 text-sm font-medium">{uploadedFile.name}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {fileInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Extension</p>
                  <p className="font-semibold text-lg">{fileInfo.extension}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold text-lg">{fileInfo.category}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">MIME Type</p>
                  <p className="font-semibold font-mono">{fileInfo.mimeType}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="font-semibold">{fileInfo.description}</p>
                </div>
                {uploadedFile && (
                  <div className="p-4 bg-muted rounded-lg md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">File Size</p>
                    <p className="font-semibold">
                      {(uploadedFile.size / 1024).toFixed(2)} KB 
                      {uploadedFile.size > 1024 * 1024 && ` (${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolWrapper>
  )
}
