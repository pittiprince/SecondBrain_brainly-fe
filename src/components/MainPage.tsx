import { useState, useEffect } from "react"
import { Network, Plus, X } from 'lucide-react'
import { CardComponent } from "./CardComponent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRecoilState } from "recoil"
import { MemoryDataAtom, fetchMemoryData, createMemory, updateMemory, searchMemories, MemoryDataInterface } from "@/atoms/MemoryData"
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

  const load = async (keyword?: string) => {
    try {
      setError(null)
      setCards(keyword ? await searchMemories(keyword) : await fetchMemoryData())
    } catch (err) {
      setError(errorMessage(err, "Could not load your memories"))
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

  const visibleCards = typeFilter ? cards.filter((c) => c.type === typeFilter) : cards

  return (
    <div className="min-h-screen bg-[#191919] text-white p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
              >
                <div className="relative">
                  <Network className="w-6 h-6 sm:w-8 sm:h-8 text-white transform rotate-45" />
                  <Network className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 absolute top-0 left-0 transform rotate-90" />
                </div>
                <span className="text-lg sm:text-xl font-semibold text-white">Brainly</span>
              </button>
            </div>
            <form onSubmit={handleSearch} className="w-full sm:w-auto">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Your memory (press Enter)"
                className="w-full sm:w-[30rem] md:w-[40rem] h-10 px-4 py-2 bg-[#2a2a2a] text-white border-2 border-gray-700 rounded-full focus:outline-none focus:border-gray-500 transition-all placeholder-gray-400"
              />
            </form>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5">
              {["Link", "YouTube Link", "Tweet", "PDF"].map((item) => (
                <button
                  key={item}
                  onClick={() => setTypeFilter(typeFilter === item ? null : item)}
                  className={`text-sm transition-colors ${typeFilter === item ? "text-white underline" : "text-gray-300 hover:text-white"}`}
                >
                  {item}
                </button>
              ))}
              <button onClick={signOut} className="text-sm text-gray-500 hover:text-white transition-colors">
                Sign out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        {error && <p role="alert" className="mb-4 rounded bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-200">{error}</p>}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#2a2a2a] text-white hover:bg-[#333333] transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Memory
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleCards.map((card) => (
            <CardComponent key={card.id} {...card} onUpdate={(updatedCard) => handleUpdate(card.id, updatedCard)} />
          ))}
        </div>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Memory</h2>
              <Button onClick={() => setIsFormOpen(false)} variant="ghost" className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-4">
              {error && <p role="alert" className="rounded bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-200">{error}</p>}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <Select onValueChange={handleTypeChange} value={newCard.type}>
                  <SelectTrigger className="w-full bg-[#333333] text-white border-gray-600">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#333333] text-white border-gray-600">
                    <SelectItem value="Link">Link</SelectItem>
                    <SelectItem value="YouTube Link">YouTube Link</SelectItem>
                    <SelectItem value="Tweet">Tweet</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={newCard.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#333333] text-white border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
                  Link
                </label>
                <Input
                  id="link"
                  name="link"
                  value={newCard.link}
                  onChange={handleInputChange}
                  className="w-full bg-[#333333] text-white border-gray-600"
                  placeholder="Enter link"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCard.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#333333] text-white border-gray-600"
                  rows={3}
                />
              </div>
              {newCard.type === "PDF" && (
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-1">
                    Upload PDF
                  </label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleInputChange}
                    className="w-full bg-[#333333] text-white border-gray-600"
                  />
                </div>
              )}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={newCard.tags}
                  onChange={handleInputChange}
                  className="w-full bg-[#333333] text-white border-gray-600"
                />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Saving..." : "Save Memory"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
