import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StopCircle, CameraIcon, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface CameraCardProps {
    onImageSelect: (file: File) => void;
    isUploading?: boolean;
    onClose?: () => void;
}

export function CameraCard({ onImageSelect, isUploading = false, onClose }: CameraCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isActive, setIsActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    const startCamera = useCallback(async () => {
        try {
            setError(null)
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } // Préférer la caméra arrière sur mobile
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setIsActive(true)
        } catch (err: any) {
            console.error("Erreur d'accès à la caméra:", err)
            setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setIsActive(false)
    }, [stream])

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')

            if (context) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
                        onImageSelect(file)
                        stopCamera()
                    }
                }, 'image/jpeg', 0.9)
            }
        }
    }, [onImageSelect, stopCamera])

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [stream])

    return (
        <Card className="glass-card w-full max-w-md mx-auto overflow-hidden border-0 relative group">
            <CardContent className="p-0">
                <div className="relative flex flex-col items-center justify-center w-full h-80 bg-black/40 overflow-hidden rounded-xl border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all duration-300">
                    
                    {onClose && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); stopCamera(); onClose(); }}
                            className="absolute top-2 right-2 z-30 p-2 bg-black/50 hover:bg-destructive text-white rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <AnimatePresence mode="wait">
                        {!isActive ? (
                            <motion.div
                                key="start"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-4 p-6"
                            >
                                <div className="p-4 rounded-full bg-primary/20 text-primary">
                                    <CameraIcon size={40} />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="font-semibold text-lg">Mode Caméra</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Prenez une photo en direct de votre animal
                                    </p>
                                </div>
                                <Button onClick={startCamera} className="rounded-full px-8 bg-primary hover:bg-primary/90">
                                    Activer la caméra
                                </Button>
                                {error && <p className="text-xs text-destructive mt-2">{error}</p>}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full h-full"
                            >
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover"
                                />
                                
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4 z-20">
                                    <Button 
                                        onClick={capturePhoto} 
                                        className="rounded-full w-14 h-14 p-0 bg-white hover:bg-gray-100 text-primary transition-transform active:scale-90 shadow-xl"
                                        title="Prendre la photo"
                                    >
                                        <div className="w-10 h-10 rounded-full border-4 border-primary/20" />
                                    </Button>
                                    
                                    <Button 
                                        onClick={stopCamera} 
                                        variant="secondary"
                                        className="rounded-full w-14 h-14 p-0 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border-0"
                                        title="Annuler"
                                    >
                                        <StopCircle size={24} />
                                    </Button>
                                </div>
                                
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                     <span className="text-[10px] uppercase font-bold text-white tracking-widest drop-shadow-md">LIVE</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <canvas ref={canvasRef} className="hidden" />

                    {isUploading && (
                         <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-40 flex items-center justify-center rounded-xl">
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
