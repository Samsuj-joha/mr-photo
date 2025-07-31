// src/components/admin/AddOptionModal.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

interface AddOptionModalProps {
  isOpen: boolean
  onClose: () => void
  type: "category" | "country"
  onSuccess: (newOption: { value: string; label: string }) => void
}

export function AddOptionModal({ isOpen, onClose, type, onSuccess }: AddOptionModalProps) {
  const [label, setLabel] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!label.trim()) {
      toast.error(`Please enter a ${type} name`)
      return
    }

    setLoading(true)
    try {
      const value = label.toLowerCase().replace(/[^a-z0-9]/g, '_')
      
      const response = await fetch('/api/gallery/options/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          value,
          label: label.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`${type === "category" ? "Category" : "Country"} added successfully`)
        onSuccess({ value, label: label.trim() })
        setLabel("")
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.error || `Failed to add ${type}`)
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error)
      toast.error(`Failed to add ${type}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setLabel("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add New {type === "category" ? "Category" : "Country"}
          </DialogTitle>
          <DialogDescription>
            Enter the name for the new {type === "category" ? "category" : "country"} you want to add.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="option-name">
              {type === "category" ? "Category" : "Country"} Name *
            </Label>
            <Input
              id="option-name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`Enter ${type === "category" ? "category" : "country"} name`}
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading || !label.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add {type === "category" ? "Category" : "Country"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}