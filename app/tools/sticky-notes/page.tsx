"use client"

import { useState, useEffect } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Trash2, StickyNote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("sticky-notes")!

interface Note {
  id: string
  content: string
  color: string
  createdAt: number
}

const COLORS = [
  { name: "yellow", class: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700" },
  { name: "pink", class: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700" },
  { name: "blue", class: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700" },
  { name: "green", class: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700" },
  { name: "purple", class: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700" },
  { name: "orange", class: "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700" },
]

export default function StickyNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const { toast } = useToast()

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("sticky-notes")
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error("Failed to load notes:", error)
      }
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0 || localStorage.getItem("sticky-notes")) {
      localStorage.setItem("sticky-notes", JSON.stringify(notes))
    }
  }, [notes])

  const addNote = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      color: randomColor.name,
      createdAt: Date.now(),
    }
    setNotes([newNote, ...notes])
  }

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    toast({
      title: "Note Deleted",
      description: "Your sticky note has been removed",
    })
  }

  const changeNoteColor = (id: string) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        const currentIndex = COLORS.findIndex(c => c.name === note.color)
        const nextIndex = (currentIndex + 1) % COLORS.length
        return { ...note, color: COLORS[nextIndex].name }
      }
      return note
    }))
  }

  const getColorClass = (colorName: string) => {
    return COLORS.find(c => c.name === colorName)?.class || COLORS[0].class
  }

  const clearAllNotes = () => {
    if (confirm("Are you sure you want to delete all notes?")) {
      setNotes([])
      localStorage.removeItem("sticky-notes")
      toast({
        title: "All Notes Cleared",
        description: "All your sticky notes have been removed",
      })
    }
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StickyNote className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Sticky Notes</h3>
              <p className="text-sm text-muted-foreground">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addNote}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
            {notes.length > 0 && (
              <Button variant="outline" onClick={clearAllNotes}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <StickyNote className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No sticky notes yet</p>
              <Button onClick={addNote}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`${getColorClass(note.color)} border-2 transition-all hover:shadow-lg`}
              >
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => changeNoteColor(note.id)}
                      className="w-6 h-6 rounded-full border-2 border-foreground/20 hover:border-foreground/40 transition-colors"
                      style={{ backgroundColor: note.color }}
                      title="Change color"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, e.target.value)}
                    placeholder="Type your note here..."
                    className="min-h-[150px] bg-transparent border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info */}
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>💾 Auto-Save:</strong> Your notes are automatically saved to your browser's local storage. 
              Click on the colored circle to change a note's color.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}
