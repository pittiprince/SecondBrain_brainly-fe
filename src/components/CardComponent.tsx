import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Link2, MessageSquare, Play, Trash2 } from "lucide-react"
import type { MemoryDataInterface } from "@/atoms/MemoryData"

interface CardComponentProps extends MemoryDataInterface {
  onUpdate: (updatedCard: MemoryDataInterface) => void
  onDelete: () => void
}

const TYPE_ICON: Record<string, typeof Link2> = { "YouTube Link": Play, Tweet: MessageSquare, PDF: FileText, Link: Link2 }

const Thumb = ({ image, type, title }: { image?: string; type: string; title: string }) => {
  const [failed, setFailed] = useState(false)
  const Icon = TYPE_ICON[type] ?? Link2
  return image && !failed ? (
    <img src={image} alt={title} loading="lazy" onError={() => setFailed(true)} className="h-44 w-full object-cover" />
  ) : (
    <div className="flex h-44 w-full items-center justify-center bg-muted text-muted-foreground" aria-hidden="true">
      <Icon className="h-8 w-8" />
    </div>
  )
}

export const CardComponent: React.FC<CardComponentProps> = ({
  id,
  type,
  title,
  link,
  description,
  tags,
  file,
  image,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<MemoryDataInterface>({ id, type, title, link, description, tags, file })

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
        <Card className="overflow-hidden text-left cursor-pointer transition-shadow hover:shadow-md">
          <Thumb image={image} type={type} title={title} />
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.split(",").map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">{type}</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Memory" : "Memory Details"}</DialogTitle>
        </DialogHeader>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-muted-foreground mb-1">
                Title
              </label>
              <Input
                id="edit-title"
                name="title"
                value={editedCard.title}
                onChange={handleInputChange}
                className="w-full bg-background text-foreground border-input"
              />
            </div>
            <div>
              <label htmlFor="edit-link" className="block text-sm font-medium text-muted-foreground mb-1">
                Link
              </label>
              <Input
                id="edit-link"
                name="link"
                value={editedCard.link}
                onChange={handleInputChange}
                className="w-full bg-background text-foreground border-input"
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-muted-foreground mb-1">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={editedCard.description}
                onChange={handleInputChange}
                className="w-full bg-background text-foreground border-input"
                rows={3}
              />
            </div>
            {type === "PDF" && (
              <div>
                <label htmlFor="edit-file" className="block text-sm font-medium text-muted-foreground mb-1">
                  Upload PDF
                </label>
                <Input
                  id="edit-file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleInputChange}
                  className="w-full bg-background text-foreground border-input"
                />
              </div>
            )}
            <div>
              <label htmlFor="edit-tags" className="block text-sm font-medium text-muted-foreground mb-1">
                Tags (comma-separated)
              </label>
              <Input
                id="edit-tags"
                name="tags"
                value={editedCard.tags}
                onChange={handleInputChange}
                className="w-full bg-background text-foreground border-input"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
              <p>{title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Link</h3>
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:underline">
                {link}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p>{description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.split(",").map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => { if (window.confirm("Delete this memory?")) onDelete() }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

