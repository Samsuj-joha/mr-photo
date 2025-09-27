// src/types/feature.ts
export interface Feature {
  id: string
  title: string
  description: string
  image?: string | null
  publicId?: string | null
  icon?: string | null
  published: boolean
  featured: boolean
  order: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreateFeatureData {
  title: string
  description: string
  image?: string
  publicId?: string
  icon?: string
  published?: boolean
  featured?: boolean
  order?: number
}

export interface UpdateFeatureData extends Partial<CreateFeatureData> {
  id: string
}