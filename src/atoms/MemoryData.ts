import { atom } from "recoil"
import { apiClient } from "@/apiClient"

export interface MemoryDataInterface {
  id?: string
  type: string
  title: string
  link: string
  description: string
  tags: string
  file?: File | undefined
}

export const MemoryDataAtom = atom<MemoryDataInterface[]>({
  key: "MemoryDataAtom",
  default: [],
})

// UI labels <-> API values
const TYPE_TO_API: Record<string, string> = { "Link": "link", "YouTube Link": "YoutubeLink", "Tweet": "tweet", "PDF": "pdf" }
const TYPE_FROM_API: Record<string, string> = { link: "Link", YoutubeLink: "YouTube Link", tweet: "Tweet", pdf: "PDF" }

interface ApiMemory { MemoryObjectId: string; type: string; link: string; title: string; desc: string; tags: string[] }

const fromApi = (m: ApiMemory): MemoryDataInterface => ({
  id: m.MemoryObjectId,
  type: TYPE_FROM_API[m.type] ?? m.type,
  title: m.title,
  link: m.link,
  description: m.desc,
  tags: (m.tags ?? []).join(", "),
})

const parseTags = (tags: string) => tags.split(",").map((t) => t.trim()).filter(Boolean)

const toApi = (m: MemoryDataInterface, link: string) => ({
  type: TYPE_TO_API[m.type] ?? m.type,
  link,
  title: m.title,
  desc: m.description,
  tags: parseTags(m.tags),
})

// PDFs are uploaded first; the memory then stores the returned URL as its link
const resolveLink = async (m: MemoryDataInterface): Promise<string> => {
  if (m.type === "PDF" && m.file) {
    const form = new FormData()
    form.append("pdf", m.file)
    const res = await apiClient.post("/api/fileUpload", form, { headers: { "Content-Type": "multipart/form-data" } })
    return res.data.uploadedURL ?? res.data.uploadedURl
  }
  return m.link
}

export const fetchMemoryData = async (): Promise<MemoryDataInterface[]> => {
  const response = await apiClient.get<ApiMemory[]>("/api/memory-get")
  return response.data.map(fromApi)
}

export const createMemory = async (memory: MemoryDataInterface): Promise<MemoryDataInterface> => {
  const link = await resolveLink(memory)
  const res = await apiClient.post("/api/memory-post", toApi(memory, link))
  const id: string = res.data.MemoryObjectId
  // index it for search; a failure here (no embedding key configured, ...) must not fail the save
  apiClient.post("/api/generate-embeddings", { MemoryObjectId: id }).catch(() => undefined)
  return { ...memory, id, link, file: undefined }
}

export const updateMemory = async (memory: MemoryDataInterface): Promise<MemoryDataInterface> => {
  if (!memory.id) throw new Error("This memory has not been saved yet")
  const link = await resolveLink(memory)
  await apiClient.post("/api/memory-update", { MemoryObjectId: memory.id, ...toApi(memory, link) })
  apiClient.post("/api/generate-embeddings", { MemoryObjectId: memory.id }).catch(() => undefined)
  return { ...memory, link, file: undefined }
}

export const searchMemories = async (keyword: string): Promise<MemoryDataInterface[]> => {
  const res = await apiClient.post<{ memories: ApiMemory[] }>("/api/generate-Search-embedding", { keyword })
  return res.data.memories.map(fromApi)
}
