import { useState, useEffect } from "react"
import { Network, Plus, X } from 'lucide-react'
import { NodeField } from "./NodeField"
import { CardComponent } from "./CardComponent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRecoilState } from "recoil"
import { MemoryDataAtom, fetchMemoryData, createMemory, updateMemory, searchMemories, deleteMemory, MemoryDataInterface } from "@/atoms/MemoryData"
import { errorMessage } from "@/apiClient"
import { clearToken, getToken } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

export const MainPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [cards, setCards] = useRecoilState(MemoryDataAtom)
  const [newCard, setNewCard] = useState<MemoryDataInterface>({
    type: "",
    title: "",
    link: "",
    description: "",
    tags: "",
  })

  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async (keyword?: string) => {
    try {
      setError(null)
      setCards(keyword ? await searchMemories(keyword) : await fetchMemoryData())
    } catch (err) {
      setError(errorMessage(err, "Could not load your memories"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!getToken()) {
      navigate("/sign-in-page")
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const keyword = query.trim()
    if (keyword && keyword.length < 3) {
      setError("Type at least 3 characters to search")
      return
    }
    load(keyword || undefined)
  }

  const signOut = () => {
    clearToken()
    navigate("/sign-in-page")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === "file") {
      const fileInput = e.target as HTMLInputElement
      if (fileInput.files && fileInput.files.length > 0) {
        setNewCard({ ...newCard, file: fileInput.files[0] })
      }
    } else {
      setNewCard({ ...newCard, [e.target.name]: e.target.value })
    }
  }

  const handleTypeChange = (value: string) => {
    setNewCard({ ...newCard, type: value })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const saved = await createMemory(newCard)
      setCards([saved, ...cards])
      setNewCard({ type: "", title: "", link: "", description: "", tags: "" })
      setIsFormOpen(false)
    } catch (err) {
      setError(errorMessage(err, "Could not save the memory"))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: string | undefined, updatedCard: MemoryDataInterface) => {
    try {
      setError(null)
      const saved = await updateMemory({ ...updatedCard, id })
      setCards(cards.map((c) => (c.id === id ? saved : c)))
    } catch (err) {
      setError(errorMessage(err, "Could not update the memory"))
    }
  }

  const handleDelete = async (id: string | undefined) => {
    if (!id) return
    try {
      setError(null)
      await deleteMemory(id)
      setCards(cards.filter((c) => c.id !== id))
    } catch (err) {
      setError(errorMessage(err, "Could not delete the memory"))
    }
  }

  const visibleCards = typeFilter ? cards.filter((c) => c.type === typeFilter) : cards

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 sm:px-8">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 font-bold tracking-tight focus:outline-none hover:opacity-80 transition-opacity"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Network className="h-4 w-4" />
          </span>
          Brainly
        </button>
        <div className="flex-1" />
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> New memory
        </Button>
        <Button onClick={signOut} variant="outline" size="sm">
          Sign out
        </Button>
      </header>

      <section className="relative flex flex-col items-center gap-4 overflow-hidden px-4 pb-6 pt-12 text-center dot-grid">
        <NodeField />
        <span className="rounded-full border border-border px-3 py-0.5 text-xs font-medium">Your second brain</span>
        <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Save anything. Find it by meaning.</h1>
        <p className="max-w-xl text-muted-foreground">Links, videos, tweets and PDFs in one searchable place.</p>
        <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your memory (press Enter)"
            aria-label="Search your memory"
            className="h-10 flex-1"
          />
          <Button type="submit" className="h-10">Search</Button>
        </form>
        <nav className="flex flex-wrap justify-center gap-1 rounded-lg bg-muted p-1" aria-label="Filter by type">
          {["Link", "YouTube Link", "Tweet", "PDF"].map((item) => (
            <button
              key={item}
              onClick={() => setTypeFilter(typeFilter === item ? null : item)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${typeFilter === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12 sm:px-8">
        {error && <p role="alert" className="mb-4 rounded-md bg-destructive/10 border border-destructive px-3 py-2 text-sm text-destructive">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border" aria-hidden="true">
              <div className="h-44 animate-pulse bg-muted" />
              <div className="space-y-2 p-6">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
          {visibleCards.map((card) => (
            <CardComponent key={card.id} {...card} onUpdate={(updatedCard) => handleUpdate(card.id, updatedCard)} onDelete={() => handleDelete(card.id)} />
          ))}
        </div>
        {!loading && visibleCards.length === 0 && !error && (
          <p className="py-16 text-center text-muted-foreground">
            {query || typeFilter ? "No memories match your search." : "Nothing saved yet. Add your first memory with New memory."}
          </p>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Memory</h2>
              <Button onClick={() => setIsFormOpen(false)} variant="ghost" className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-4">
              {error && <p role="alert" className="rounded bg-destructive/10 border border-destructive px-3 py-2 text-sm text-destructive">{error}</p>}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-muted-foreground mb-1">
                  Type
                </label>
                <Select onValueChange={handleTypeChange} value={newCard.type}>
                  <SelectTrigger className="w-full bg-background text-foreground border-input">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border-input">
                    <SelectItem value="Link">Link</SelectItem>
                    <SelectItem value="YouTube Link">YouTube Link</SelectItem>
                    <SelectItem value="Tweet">Tweet</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={newCard.title}
                  onChange={handleInputChange}
                  className="w-full bg-background text-foreground border-input"
                />
              </div>
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-muted-foreground mb-1">
                  Link
                </label>
                <Input
                  id="link"
                  name="link"
                  value={newCard.link}
                  onChange={handleInputChange}
                  className="w-full bg-background text-foreground border-input"
                  placeholder="Enter link"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCard.description}
                  onChange={handleInputChange}
                  className="w-full bg-background text-foreground border-input"
                  rows={3}
                />
              </div>
              {newCard.type === "PDF" && (
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-muted-foreground mb-1">
                    Upload PDF
                  </label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleInputChange}
                    className="w-full bg-background text-foreground border-input"
                  />
                </div>
              )}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-muted-foreground mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={newCard.tags}
                  onChange={handleInputChange}
                  className="w-full bg-background text-foreground border-input"
                />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Memory"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
