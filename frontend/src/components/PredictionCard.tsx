import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

// Importation des GIFs depuis les assets
import catGif from "../assets/gif/Cat_1_GIF.gif"
import dogGif from "../assets/gif/Dog_0_GIF.gif"

export interface PredictionResult {
  label: "dog" | "cat" | "unknown";
  confidence: number;
  status?: string;
  reason?: string;
}

interface PredictionCardProps {
  prediction: PredictionResult | null;
  onReset: () => void;
}

export function PredictionCard({ prediction, onReset }: PredictionCardProps) {
  const previousPrediction = useRef<PredictionResult | null>(null)

  useEffect(() => {
    if (prediction) {
      previousPrediction.current = prediction
    }
  }, [prediction])

  // Utiliser la prédiction actuelle ou la précédente pour les animations de sortie
  const displayPrediction = prediction || previousPrediction.current

  if (!displayPrediction || !displayPrediction.label) return null

  const label = displayPrediction.label.toLowerCase()
  const isDog = label === "dog"
  const isCat = label === "cat"
  const isUnknown = label === "unknown"

  const confidencePercentage = displayPrediction.confidence ? Math.round(displayPrediction.confidence * 100) : 0

  // Déterminer les styles et le contenu en fonction du résultat
  let badgeVariant: "success" | "info" | "destructive" = "info"
  let icon = <HelpCircle className="w-16 h-16 text-muted-foreground" />
  let colorClass = "from-gray-500 to-gray-700"
  let displayLabel = "Inconnu"
  let message = "Je ne sais pas ce que c'est..."
  let gif = null

  if (isDog) {
      badgeVariant = "info"
      icon = <CheckCircle2 className="w-16 h-16 text-blue-500" />
      colorClass = "from-blue-500 to-blue-500"
      displayLabel = "Chien"
      message = "Je suis un chien"
      gif = dogGif
  } else if (isCat) {
      badgeVariant = "info"
      icon = <CheckCircle2 className="w-16 h-16 text-yellow-500" />
      colorClass = "from-blue-500 to-blue-500"
      displayLabel = "Chat"
      message = "Je suis un chat"
      gif = catGif
  } else if (isUnknown) {
      badgeVariant = "destructive"
      icon = <AlertOctagon className="w-16 h-16 text-red-500" />
      colorClass = "from-red-500 to-red-500"
      displayLabel = "Inconnu"
      message = "Résultat incertain"
  }

  return (
    <AnimatePresence mode="popLayout">
      {prediction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-[95vw] md:max-w-md mx-auto"
        >
          <Card className="glass-card border-t-4 border-t-primary overflow-hidden relative">
            <CardHeader className="relative z-10 pb-2 px-4 md:px-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2 truncate">
                  Résultat
                </CardTitle>
                <Badge 
                    variant={badgeVariant}
                    className="text-xs md:text-sm px-2 md:px-3 py-1 uppercase tracking-wide shrink-0"
                >
                    {displayLabel}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 md:space-y-6 relative z-10 px-4 md:px-6">
              <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-secondary/50 rounded-xl backdrop-blur-sm shadow-inner">
                
                {/* Petit Card pour le GIF */}
                {gif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 overflow-hidden rounded-lg border border-white/20 shadow-sm w-24 h-24 md:w-32 md:h-32"
                  >
                    <img src={gif} alt="Result GIF" className="w-full h-full object-cover" />
                  </motion.div>
                )}

                {!gif && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-4"
                  >
                      {icon}
                  </motion.div>
                )}
                
                <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-2 capitalize text-center bg-clip-text text-transparent bg-gradient-to-r ${colorClass}`}>
                  {message} !
                </h2>
                
                {isUnknown && displayPrediction.reason && (
                    <p className="text-[10px] md:text-xs text-white dark:text-white mt-1 bg-red-500/20 px-3 py-1 rounded-full text-center">
                        Raison: {displayPrediction.reason === "stability" ? "Instabilité visuelle" : "Faible confiance"}
                    </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm font-medium">
                  <span>Score de confiance</span>
                  <span>{confidencePercentage}%</span>
                </div>
                <Progress value={confidencePercentage} className="h-2 md:h-3" />
              </div>
            </CardContent>
            
            <CardFooter className="relative z-10 bg-secondary/20 py-4 flex justify-center px-4">
              <motion.div
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full flex justify-center"
              >
                <Button 
                  onClick={onReset} 
                  variant="outline" 
                  className="w-full md:w-fit px-8 h-10 md:h-12 text-xs md:text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 border-0 transition-all duration-300"
                >
                  Scanner une autre image
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
