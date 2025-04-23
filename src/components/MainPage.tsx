import { useState, useEffect } from "react"
import { Network, Plus, X } from 'lucide-react'
import { CardComponent } from "./CardComponent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRecoilState } from "recoil"
import { MemoryDataAtom, fetchMemoryData, MemoryDataInterface } from "@/atoms/MemoryData"

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

  useEffect(() => {
    const loadMemoryData = async () => {
      const data = await fetchMemoryData();
      setCards(data);
    };
    loadMemoryData();
  }, [setCards]);

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

  const handleSave = () => {
    setCards([...cards, newCard])
    setNewCard({ type: "", title: "", link: "", description: "", tags: "" })
    setIsFormOpen(false)
  }

  const handleUpdate = (index: number, updatedCard: MemoryDataInterface) => {
    const updatedCards = [...cards]
    updatedCards[index] = updatedCard
    setCards(updatedCards)
  }

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
            <div className="w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search Your memory"
                className="w-full sm:w-[30rem] md:w-[40rem] h-10 px-4 py-2 bg-[#2a2a2a] text-white border-2 border-gray-700 rounded-full focus:outline-none focus:border-gray-500 transition-all placeholder-gray-400"
              />
            </div>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5">
              {["Link", "Youtube Link", "Tweet", "PDF"].map((item) => (
                <button key={item} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#2a2a2a] text-white hover:bg-[#333333] transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Memory
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, index) => (
            <CardComponent key={index} {...card} onUpdate={(updatedCard) => handleUpdate(index, updatedCard)} />
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
              <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Memory
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
