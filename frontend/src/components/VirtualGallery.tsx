import { motion } from "framer-motion"
import catGallerie from "../assets/img/gallerie-1-cat.jpg"
import dogGallerie from "../assets/img/gallerie-1-dog.jpg"
import unknownGallerie from "../assets/img/gallerie-1-inconnu.jpg"

interface VirtualGalleryProps {
    onSelect: (file: File) => void
    isLoading: boolean
}

export function VirtualGallery({ onSelect, isLoading }: VirtualGalleryProps) {
    const galleryImages = [
        { src: catGallerie, name: "Chat", filename: "gallerie-1-cat.jpg" },
        { src: dogGallerie, name: "Chien", filename: "gallerie-1-dog.jpg" },
        { src: unknownGallerie, name: "Inconnu", filename: "gallerie-1-inconnu.jpg" },
    ]

    const handleSelectImage = async (imgSrc: string, filename: string) => {
        if (isLoading) return

        try {
            const response = await fetch(imgSrc)
            const blob = await response.blob()
            const file = new File([blob], filename, { type: "image/jpeg" })
            onSelect(file)
        } catch (error) {
            console.error("Error loading gallery image:", error)
        }
    }

    return (
        <div className="w-full space-y-3">
            {/* <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] text-center lg:text-left lg:pl-1">
                Gallerie Test
            </h3> */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                {galleryImages.map((image, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative aspect-square lg:h-24 lg:w-24 mx-auto rounded-xl overflow-hidden border border-white/10 cursor-pointer bg-black/20 backdrop-blur-sm transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleSelectImage(image.src, image.filename)}
                    >
                        <img 
                            src={image.src} 
                            alt={image.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] text-white font-black uppercase tracking-widest">{image.name}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
