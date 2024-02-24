import toast from 'react-hot-toast'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'

type FileUploadProps = {
  onChange: (url?: string) => void
  endpoint: keyof typeof ourFileRouter
}

export default function FileUpload({ onChange, endpoint }: FileUploadProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        toast.error(error?.message ?? 'Something went wrong!')
      }}
    />
  )
}
