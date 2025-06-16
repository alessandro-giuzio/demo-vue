import { toast } from '@/components/ui/toast'

export const showError = (message: string) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    duration: 5000,
  })
}

export const showSuccess = (message: string) => {
  toast({
    title: "Success",
    description: message,
    duration: 3000,
  })
}
