import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { Card, CardContent } from './ui/card'

interface UploadCardProps {
    onImageSelect: (file: File) => void;
    isUploading?: boolean;
}

export function UploadCard({ onImageSelect, isUploading = false }: UploadCardProps) {
    const [preview, setPreview] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setPreview(previewUrl)
            onImageSelect(file)
        }
    }, [onImageSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp']
        },
        maxFiles: 1,
        disabled: isUploading
    })

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(null)
    }

    return (
        <Card className="glass-card w-full max-w-md mx-auto overflow-hidden border-0 relative group">
            <CardContent className="p-0">
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-80 cursor-pointer transition-all duration-300 border-2 border-dashed rounded-xl",
                        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30",
                        preview && "border-solid border-0"
                    )}
                >
                    <input {...getInputProps()} />

                    <AnimatePresence mode="wait">
                        {preview ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative w-full h-full"
                            >
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-medium">
                                        Cliquer pour changer l'image 
                                    </p>
                                </div>
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-destructive text-white rounded-full transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center gap-4 text-center p-6"
                            >
                                <div className={cn(
                                    "p-4 rounded-full transition-colors duration-300",
                                    isDragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                )}>
                                    <UploadCloud size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">
                                        {isDragActive ? "Drop it like it's hot!" : "Upload Image"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-[200px]">
                                       Glissez et déposez votre image ici, ou cliquez pour parcourir
                                    </p>
                                </div>
                                <div className="flex gap-2 text-xs text-muted-foreground mt-4">
                                    <span className="bg-secondary px-2 py-1 rounded">JPG</span>
                                    <span className="bg-secondary px-2 py-1 rounded">PNG</span>
                                    <span className="bg-secondary px-2 py-1 rounded">WEBP</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {isUploading && (
                         <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                            />
                         </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
