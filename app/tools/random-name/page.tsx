"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Copy, Check } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

const tool = getToolById("random-name")!

// Name data
const FIRST_NAMES_MALE = [
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph",
  "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven",
  "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy",
  "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas",
  "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin",
  "Samuel", "Raymond", "Gregory", "Frank", "Alexander", "Patrick", "Jack", "Dennis",
  "Jerry", "Tyler", "Aaron", "Jose", "Adam", "Nathan", "Henry", "Douglas", "Zachary"
]

const FIRST_NAMES_FEMALE = [
  "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth", "Susan", "Jessica",
  "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly",
  "Emily", "Donna", "Michelle", "Dorothy", "Carol", "Amanda", "Melissa", "Deborah",
  "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia", "Kathleen", "Amy", "Angela",
  "Shirley", "Anna", "Brenda", "Pamela", "Emma", "Nicole", "Helen", "Samantha",
  "Katherine", "Christine", "Debra", "Rachel", "Carolyn", "Janet", "Catherine", "Maria",
  "Heather", "Diane", "Ruth", "Julie", "Olivia", "Joyce", "Virginia", "Victoria", "Kelly"
]

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter"
]

const ADJECTIVES = [
  "Swift", "Brave", "Clever", "Dark", "Epic", "Fierce", "Golden", "Hidden",
  "Iron", "Jade", "Keen", "Lunar", "Mystic", "Noble", "Omega", "Prime",
  "Quick", "Royal", "Shadow", "Thunder", "Ultra", "Vivid", "Wild", "Xenon",
  "Young", "Zero", "Cosmic", "Digital", "Electric", "Frozen", "Ghost", "Hyper"
]

const NOUNS = [
  "Wolf", "Phoenix", "Dragon", "Tiger", "Eagle", "Shark", "Ninja", "Wizard",
  "Knight", "Raven", "Storm", "Blade", "Hunter", "Warrior", "Shadow", "Star",
  "Fire", "Ice", "Thunder", "Lion", "Hawk", "Viper", "Panther", "Ghost",
  "Cyber", "Nova", "Sonic", "Turbo", "Alpha", "Omega", "Pixel", "Glitch"
]

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateFullName(gender: "male" | "female" | "any"): string {
  let firstName: string
  if (gender === "male") {
    firstName = getRandomItem(FIRST_NAMES_MALE)
  } else if (gender === "female") {
    firstName = getRandomItem(FIRST_NAMES_FEMALE)
  } else {
    firstName = Math.random() > 0.5 
      ? getRandomItem(FIRST_NAMES_MALE) 
      : getRandomItem(FIRST_NAMES_FEMALE)
  }
  return `${firstName} ${getRandomItem(LAST_NAMES)}`
}

function generateUsername(): string {
  const styles = [
    () => `${getRandomItem(ADJECTIVES)}${getRandomItem(NOUNS)}${Math.floor(Math.random() * 1000)}`,
    () => `${getRandomItem(NOUNS)}${getRandomItem(ADJECTIVES)}${Math.floor(Math.random() * 100)}`,
    () => `${getRandomItem(ADJECTIVES)}_${getRandomItem(NOUNS)}`,
    () => `${getRandomItem(NOUNS)}${Math.floor(Math.random() * 10000)}`,
    () => `x${getRandomItem(ADJECTIVES)}${getRandomItem(NOUNS)}x`,
  ]
  return getRandomItem(styles)()
}

function generateHandle(): string {
  const styles = [
    () => `@${getRandomItem(ADJECTIVES).toLowerCase()}${getRandomItem(NOUNS).toLowerCase()}`,
    () => `@${getRandomItem(NOUNS).toLowerCase()}_${Math.floor(Math.random() * 100)}`,
    () => `@the${getRandomItem(NOUNS).toLowerCase()}`,
    () => `@${getRandomItem(ADJECTIVES).toLowerCase()}.${getRandomItem(NOUNS).toLowerCase()}`,
  ]
  return getRandomItem(styles)()
}

export default function RandomNamePage() {
  const [tab, setTab] = useState("fullname")
  const [gender, setGender] = useState<"male" | "female" | "any">("any")
  const [count, setCount] = useState(5)
  const [results, setResults] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generate = useCallback(() => {
    const newResults: string[] = []
    for (let i = 0; i < count; i++) {
      switch (tab) {
        case "fullname":
          newResults.push(generateFullName(gender))
          break
        case "username":
          newResults.push(generateUsername())
          break
        case "handle":
          newResults.push(generateHandle())
          break
      }
    }
    setResults(newResults)
  }, [tab, gender, count])

  const copyName = (name: string, index: number) => {
    navigator.clipboard.writeText(name)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Type Selector */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fullname">Full Name</TabsTrigger>
            <TabsTrigger value="username">Username</TabsTrigger>
            <TabsTrigger value="handle">Handle</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gender Selector (only for full names) */}
        {tab === "fullname" && (
          <div>
            <Label className="mb-3 block">Gender</Label>
            <div className="flex gap-2">
              {(["any", "male", "female"] as const).map((g) => (
                <Button
                  key={g}
                  variant={gender === g ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGender(g)}
                  className="capitalize"
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Count Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>How many?</Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {count}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={([value]) => setCount(value)}
            min={1}
            max={20}
            step={1}
          />
        </div>

        {/* Generate Button */}
        <Button onClick={generate} className="w-full" size="lg">
          <RefreshCw className="size-4 mr-2" />
          Generate {tab === "fullname" ? "Names" : tab === "username" ? "Usernames" : "Handles"}
        </Button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <Label>Generated {tab === "fullname" ? "Names" : tab === "username" ? "Usernames" : "Handles"}</Label>
            <div className="space-y-2">
              {results.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg group"
                >
                  <span className={`font-medium ${tab !== "fullname" ? "font-mono" : ""}`}>
                    {name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyName(name, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
