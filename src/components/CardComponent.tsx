import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { MemoryDataInterface } from "@/atoms/MemoryData"

interface CardComponentProps extends MemoryDataInterface {
  onUpdate: (updatedCard: MemoryDataInterface) => void
}

export const CardComponent: React.FC<CardComponentProps> = ({
  type,
  title,
  link,
  description,
  tags,
  file,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<MemoryDataInterface>({ type, title, link, description, tags, file })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === "file") {
      const fileInput = e.target as HTMLInputElement
      if (fileInput.files && fileInput.files.length > 0) {
        setEditedCard({ ...editedCard, file: fileInput.files[0] })
      }
    } else {
      setEditedCard({ ...editedCard, [e.target.name]: e.target.value })
    }
  }

  const handleSave = () => {
    onUpdate(editedCard)
    setIsEditing(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-[#2a2a2a] text-white hover:bg-[#333333] transition-all duration-300 ease-in-out cursor-pointer border border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm text-gray-300 line-clamp-2">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.split(",").map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-[#191919] text-gray-300 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-400">{type}</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Memory" : "Memory Details"}</DialogTitle>
        </DialogHeader>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <Input
                id="edit-title"
                name="title"
                value={editedCard.title}
                onChange={handleInputChange}
                className="w-full bg-[#333333] text-white border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="edit-link" className="block text-sm font-medium text-gray-300 mb-1">
                Link
              </label>
              <Input
                id="edit-link"
                name="link"
                value={editedCard.link}
                onChange={handleInputChange}
                className="w-full bg-[#333333] text-white border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={editedCard.description}
                onChange={handleInputChange}
                className="w-full bg-[#333333] text-white border-gray-600"
                rows={3}
              />
            </div>
            {type === "PDF" && (
              <div>
                <label htmlFor="edit-file" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload PDF
                </label>
                <Input
                  id="edit-file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleInputChange}
                  className="w-full bg-[#333333] text-white border-gray-600"
                />
              </div>
            )}
            <div>
              <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <Input
                id="edit-tags"
                name="tags"
                value={editedCard.tags}
                onChange={handleInputChange}
                className="w-full bg-[#333333] text-white border-gray-600"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Title</h3>
              <p>{title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Link</h3>
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {link}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Description</h3>
              <p>{description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.split(",").map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-[#191919] text-gray-300 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                Edit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

