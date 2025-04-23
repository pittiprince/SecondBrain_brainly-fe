import { atom } from "recoil"
import axios from "axios"

export interface MemoryDataInterface {
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

export const fetchMemoryData = async () => {
  try {
    const response = await axios.get("https://brainly-wzoi.onrender.com/api/memory-get", {
      params: {
        id: "6791e378643be50953bfc0e1",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching memory data:", error)
    return []
  }
}

