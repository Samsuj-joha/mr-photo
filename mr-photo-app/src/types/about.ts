// src/types/about.ts

export interface AboutData {
  id?: string
  name: string
  description: string
  profileImage?: string
  profileImagePublicId?: string
  journeyTitle: string
  journeyContent: string
  valuesTitle: string
  valuesContent: string
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface ImageUploadResponse {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

export interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}