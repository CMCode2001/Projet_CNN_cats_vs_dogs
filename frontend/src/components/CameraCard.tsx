import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StopCircle, CameraIcon, X, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import Webcam from 'react-webcam'

interface CameraCardProps {
    onImageSelect: (file: File) => void;
    isUploading?: boolean;
    onClose?: () => void;
}

export function CameraCard({ onImageSelect, isUploading = false, onClose }: CameraCardProps) {
    const webcamRef = useRef<Webcam>(null)
    const [isActive, setIsActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [isCameraReady, setIsCameraReady] = useState(false)

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: facingMode
    }

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            // Convert base64 to blob
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
                    onImageSelect(file)
                    setIsActive(false)
                })
        }
    }, [onImageSelect])

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
        setIsCameraReady(false)
    }

    return (
        <Card className="glass-card w-full max-w-md mx-auto overflow-hidden border-0 relative group">
            <CardContent className="p-0">
                <div className="relative flex flex-col items-center justify-center w-full h-80 bg-black/60 overflow-hidden rounded-xl border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all duration-300">
                    
                    {onClose && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsActive(false); onClose(); }}
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
                                    <h3 className="font-semibold text-lg">Mode Caméra Pro</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Utilisez react-webcam pour une capture robuste
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => setIsActive(true)} 
                                    className="rounded-full px-8 bg-primary hover:bg-primary/90"
                                >
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
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    onUserMedia={() => setIsCameraReady(true)}
                                    onUserMediaError={(err) => {
                                        console.error("Webcam Error:", err)
                                        setError("Erreur caméra : " + (err as string))
                                    }}
                                    className="w-full h-full object-cover"
                                    forceScreenshotSourceSize={true}
                                />
                                
                                {isCameraReady && (
                                    <>
                                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4 z-20">
                                            <Button 
                                                onClick={capturePhoto} 
                                                className="rounded-full w-14 h-14 p-0 bg-white hover:bg-gray-100 text-primary transition-transform active:scale-90 shadow-xl"
                                            >
                                                <div className="w-10 h-10 rounded-full border-4 border-primary/20" />
                                            </Button>
                                            
                                            <Button 
                                                onClick={toggleCamera} 
                                                className="rounded-full w-14 h-14 p-0 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border-0"
                                                title="Inverser la caméra"
                                            >
                                                <RefreshCw size={24} />
                                            </Button>

                                            <Button 
                                                onClick={() => setIsActive(false)} 
                                                variant="secondary"
                                                className="rounded-full w-14 h-14 p-0 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border-0"
                                            >
                                                <StopCircle size={24} />
                                            </Button>
                                        </div>
                                        
                                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                             <span className="text-[10px] uppercase font-bold text-white tracking-widest drop-shadow-md">LIVE PRO</span>
                                        </div>
                                    </>
                                )}

                                {!isCameraReady && (
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 text-white z-10 text-center px-4">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        >
                                            <RefreshCw size={32} className="text-primary" />
                                        </motion.div>
                                        <p className="text-sm font-medium">Initialisation de la caméra...</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

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
