import { useState, useEffect } from 'react'
import './App.css'
import bubbleSort from './utils/bubblesort'

const initialList = [3, 2, 6, 1, 9, 4, 7, 10, 8, 5];
const steps = bubbleSort(initialList);

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [startAnimate, setStartAnimate] = useState(false);

  const list = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev +1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  const handleReset = () => {
    setCurrentStep(0)
    setStartAnimate(false);
  }
  
  const handleAnimate = () => {
    setStartAnimate(true);
  }

  useEffect(() => {
    let interval: number

    if (!startAnimate) {
      return
    }

    interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev === steps.length -1) {
          if (interval) {
            clearInterval(interval)
          }

          return prev;
        }
        return prev + 1
      })
    }, 200)
    
    return () => {
      clearInterval(interval)  
    }
  }, [startAnimate])

  return (
    <div className="app">
      <div className="chart">
        {list.map((val) => (
          <div key={val} style={{ height: `${val * 20}px` }} />
        ))}
      </div>
      <div className="buttons">
        <button onClick={handleAnimate}>Animate</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}
