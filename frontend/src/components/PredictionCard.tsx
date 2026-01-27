import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

  if (!displayPrediction) return null

  const label = displayPrediction.label.toLowerCase()
  const isDog = label === "dog"
  const isCat = label === "cat"
  const isUnknown = label === "unknown"

  const confidencePercentage = Math.round(displayPrediction.confidence * 100)

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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="glass-card border-t-4 border-t-primary overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none select-none">
                 {/* {isDog && <span className="text-9xl">🐶</span>}
                 {isCat && <span className="text-9xl">🐱</span>}
                 {isUnknown && <span className="text-9xl">❓</span>} */}
            </div>
            
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Résultat de la prédiction
                </CardTitle>
                <Badge 
                    variant={badgeVariant}
                    className="text-sm px-3 py-1 uppercase tracking-wide"
                >
                    {displayLabel}
                </Badge>
              </div>
              <CardDescription>
                Analyse par Deep Learning terminée
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 relative z-10">
              <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-xl backdrop-blur-sm shadow-inner">
                
                {/* Petit Card pour le GIF */}
                {gif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 overflow-hidden rounded-lg border border-white/20 shadow-sm w-32 h-32"
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
                
                <h2 className={`text-3xl font-extrabold tracking-tight mb-2 capitalize bg-clip-text text-transparent bg-gradient-to-r ${colorClass}`}>
                  {message} !
                </h2>
                
                {/* <p className="text-muted-foreground text-center">
                  D'après les caractéristiques visuelles, l'IA est
                  <strong className="text-foreground mx-1">{confidencePercentage}%</strong>
                  confiante.
                </p> */}
                {isUnknown && displayPrediction.reason && (
                    <p className="text-xs text-white dark:text-white mt-2 bg-red-500/20 dark:bg-red-500/20 px-3 py-1 rounded-full">
                        Raison: {displayPrediction.reason === "stability" ? "Instabilité visuelle" : "Faible confiance"}
                    </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Score de confiance</span>
                  <span>{confidencePercentage}%</span>
                </div>
                <Progress value={confidencePercentage} className="h-3" />
                <p className="text-xs text-muted-foreground text-right pt-1">
                   Seuil strict: 98%
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="relative z-10 bg-secondary/20 pt-6">
              <Button onClick={onReset} variant="outline" className="w-full hover:bg-background transition-colors">
                Scanner une autre image
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
