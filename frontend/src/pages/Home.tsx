import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCard } from '../components/UploadCard'
import { PredictionCard } from '../components/PredictionCard'
import type { PredictionResult } from '../components/PredictionCard'
import { ThemeToggle } from '../components/ThemeToggle'
import { VirtualGallery } from '../components/VirtualGallery'
import { predictImage } from '../services/api.ts'
import {AlertCircle } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"


export default function Home() {
    const [prediction, setPrediction] = useState<PredictionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleImageSelect = async (file: File) => {
        setIsLoading(true)
        setError(null)
        
        try {
            const result = await predictImage(file)
            setPrediction(result)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Impossible de traiter l'image. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
        }
    }

    const resetPrediction = () => {
        setPrediction(null)
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center p-4 md:p-8 overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gray-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gray-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Mini Navbar Fixée et Centrée */}
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="z-50 fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 dark:bg-black/30 backdrop-blur-xl shadow-2xl transition-all hover:border-white/20 hover:scale-105"
            >
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-foreground/80 whitespace-nowrap">
                        Deep Learning CNN - Master UIDT
                    </span>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <ThemeToggle />
            </motion.nav>

            <main className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center pt-24 pb-12 px-6">
                {/* Header Centré */}
                <motion.header
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full text-center mb-8 space-y-4"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Chien&nbsp; vs &nbsp;Chat
                        </span>
                    </h1>
                    {/* <p className="text-sm md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
                        Découvrez la puissance du Deep Learning pour identifier vos animaux instantanément.
                    </p> */}
                </motion.header>

                {/* Contenu Principal - Layout Grid Symétrique sur Desktop */}
                <div className="w-full flex justify-center">
                    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10">
                        {/* Zone de Drag & Drop / Résultat */}
                        <div className="w-full max-w-xl shrink-0">
                            <AnimatePresence mode="wait">
                                {!prediction ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    >
                                        <UploadCard onImageSelect={handleImageSelect} isUploading={isLoading} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="perspective-1000"
                                    >
                                        <PredictionCard prediction={prediction} onReset={resetPrediction} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Galerie Latérale Verticale sur Desktop */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full max-w-lg lg:w-32 lg:pt-2"
                        >
                            <VirtualGallery onSelect={handleImageSelect} isLoading={isLoading} />
                        </motion.div>
                    </div>
                </div>

                 <Dialog open={!!error} onOpenChange={(open) => !open && setError(null)}>
                    <DialogContent className="glass-card border-white/20">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                Erreur de Traitement
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground pt-2">
                                {error}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-center pt-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => setError(null)}
                                className="rounded-full px-8 bg-white/5 hover:bg-white/10 border-white/10"
                            >
                                Fermer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
            </main>

            {/* <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-auto text-[10px] md:text-xs text-muted-foreground/60 flex flex-col items-center gap-4 z-10"
            >
                <div className="flex items-center gap-4">
                    <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-muted-foreground/20" />
                    <span className="font-semibold tracking-[0.2em] uppercase">CNN Master UIDT</span>
                    <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-muted-foreground/20" />
                </div>
            </motion.footer> */}
        </div>
    )
}
