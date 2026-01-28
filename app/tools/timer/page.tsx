"use client"

import { useState, useEffect, useRef } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Timer as TimerIcon, Clock } from "lucide-react"

const tool = getToolById("timer")!

export default function TimerPage() {
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerTime, setTimerTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Stopwatch functions
  const startStopwatch = () => {
    setStopwatchRunning(true)
    stopwatchIntervalRef.current = setInterval(() => {
      setStopwatchTime((prev) => prev + 10)
    }, 10)
  }

  const pauseStopwatch = () => {
    setStopwatchRunning(false)
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
    }
  }

  const resetStopwatch = () => {
    setStopwatchRunning(false)
    setStopwatchTime(0)
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
    }
  }

  // Timer functions
  const startTimer = () => {
    if (timerTime === 0) {
      const totalSeconds = timerMinutes * 60 + timerSeconds
      if (totalSeconds === 0) return
      setTimerTime(totalSeconds * 1000)
    }
    
    setTimerRunning(true)
    timerIntervalRef.current = setInterval(() => {
      setTimerTime((prev) => {
        if (prev <= 100) {
          pauseTimer()
          // Play sound notification
          playNotificationSound()
          return 0
        }
        return prev - 100
      })
    }, 100)
  }

  const pauseTimer = () => {
    setTimerRunning(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimerTime(0)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    gainNode.gain.value = 0.3
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [])

  const formatStopwatchTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  const formatTimerTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const getTimerProgress = () => {
    const totalTime = (timerMinutes * 60 + timerSeconds) * 1000
    if (totalTime === 0) return 0
    return ((totalTime - timerTime) / totalTime) * 100
  }

  return (
    <ToolWrapper tool={tool}>
      <Tabs defaultValue="stopwatch" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="timer">Countdown Timer</TabsTrigger>
        </TabsList>

        {/* Stopwatch Tab */}
        <TabsContent value="stopwatch" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <Clock className="w-16 h-16 text-primary" />
                <div className="text-6xl md:text-7xl font-mono font-bold">
                  {formatStopwatchTime(stopwatchTime)}
                </div>
                <div className="flex gap-3">
                  {!stopwatchRunning ? (
                    <Button size="lg" onClick={startStopwatch}>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button size="lg" variant="secondary" onClick={pauseStopwatch}>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button size="lg" variant="outline" onClick={resetStopwatch}>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <TimerIcon className="w-16 h-16 text-primary" />
                
                {timerTime === 0 && !timerRunning ? (
                  <div className="w-full max-w-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minutes">Minutes</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="999"
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                          className="text-center text-2xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seconds">Seconds</Label>
                        <Input
                          id="seconds"
                          type="number"
                          min="0"
                          max="59"
                          value={timerSeconds}
                          onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                          className="text-center text-2xl"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl md:text-7xl font-mono font-bold">
                      {formatTimerTime(timerTime)}
                    </div>
                    {/* Progress bar */}
                    <div className="w-full max-w-md h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${getTimerProgress()}%` }}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  {!timerRunning ? (
                    <Button size="lg" onClick={startTimer}>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button size="lg" variant="secondary" onClick={pauseTimer}>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button size="lg" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>

                {timerTime === 0 && !timerRunning && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    <Button variant="outline" onClick={() => { setTimerMinutes(1); setTimerSeconds(0); }}>
                      1 min
                    </Button>
                    <Button variant="outline" onClick={() => { setTimerMinutes(5); setTimerSeconds(0); }}>
                      5 min
                    </Button>
                    <Button variant="outline" onClick={() => { setTimerMinutes(10); setTimerSeconds(0); }}>
                      10 min
                    </Button>
                    <Button variant="outline" onClick={() => { setTimerMinutes(15); setTimerSeconds(0); }}>
                      15 min
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}
