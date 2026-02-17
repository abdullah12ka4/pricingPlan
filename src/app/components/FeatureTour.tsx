import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface TourStep {
  title: string;
  description: string;
  image?: string;
  highlight?: string;
}

interface FeatureTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function FeatureTour({ steps, onComplete, onSkip }: FeatureTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full border-[#044866]/20 shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-[#044866]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{currentStep + 1}</span>
              </div>
              <div>
                <h3 className="text-lg text-[#044866] font-semibold">{steps[currentStep].title}</h3>
                <p className="text-xs text-gray-500">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              {steps[currentStep].description}
            </p>

            {steps[currentStep].image && (
              <div className="rounded-lg bg-gradient-to-br from-[#044866]/5 to-[#F7A619]/5 p-8 mb-6 text-center">
                <div className="text-4xl mb-2">{steps[currentStep].image}</div>
                {steps[currentStep].highlight && (
                  <Badge variant="outline" className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30">
                    {steps[currentStep].highlight}
                  </Badge>
                )}
              </div>
            )}

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-8 bg-[#044866]'
                      : idx < currentStep
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#044866]/10 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-[#044866]/20 text-[#044866]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="bg-[#044866] hover:bg-[#0D5468] text-white"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to manage tour state
export function useFeatureTour(tourKey: string) {
  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem(`tour-completed-${tourKey}`);
  });

  const completeTour = () => {
    localStorage.setItem(`tour-completed-${tourKey}`, 'true');
    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem(`tour-completed-${tourKey}`, 'true');
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(`tour-completed-${tourKey}`);
    setShowTour(true);
  };

  return { showTour, completeTour, skipTour, resetTour };
}
