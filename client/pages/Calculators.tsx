import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calculator,
  Sigma,
  GraduationCap,
  Percent,
  Calendar,
  Delete,
  Equal
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import ScientificCalculator from "./calculators/ScientificCalculator";
import GPACalculator from "./calculators/GPACalculator";
import PercentageCalculator from "./calculators/PercentageCalculator";
import AgeCalculator from "./calculators/AgeCalculator";
import Seo from "@/components/Seo";

export default function Calculators() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setHistory((h)=>[`${previousValue} ${operation} ${inputValue} = ${newValue}`, ...h].slice(0,10));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || (t as any).isContentEditable)) return;
      const k = e.key;
      if (/^[0-9]$/.test(k)) { inputNumber(k); return; }
      if (k === '.') { inputNumber('.'); return; }
      if (k === '+') { inputOperation('+'); return; }
      if (k === '-') { inputOperation('-'); return; }
      if (k === '*' || k.toLowerCase() === 'x') { inputOperation('×'); return; }
      if (k === '/') { inputOperation('÷'); return; }
      if (k === 'Enter' || k === '=') { e.preventDefault(); performCalculation(); return; }
      if (k === 'Backspace') { deleteLast(); return; }
      if (k === 'Escape' || k.toLowerCase() === 'c') { clear(); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [display, operation, previousValue, waitingForNewValue]);

  const calculatorTools = [
    {
      title: "Scientific Calculator",
      description: "Advanced mathematical functions and operations",
      icon: Sigma,
      badge: "Advanced",
      available: true
    },
    {
      title: "GPA Calculator",
      description: "Calculate your Grade Point Average easily",
      icon: GraduationCap,
      badge: "Academic",
      available: true
    },
    {
      title: "Percentage Calculator",
      description: "Percentage calculations and grade conversions",
      icon: Percent,
      badge: "Utility",
      available: true
    },
    {
      title: "Age Calculator",
      description: "Calculate age and date differences precisely",
      icon: Calendar,
      badge: "Date",
      available: true
    }
  ];

  return (
    <Layout>
      <Seo title="Calculators – Nexus AI" description="Scientific, GPA, Percentage, and Age calculators for students." path="/calculators" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              Calculation Tools
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Calculators
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful calculation tools for all your mathematical needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Calculator */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Basic Calculator
                </CardTitle>
                <CardDescription>
                  Perform basic arithmetic operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display */}
                <div className="mb-4">
                  <div className="bg-gray-100 rounded-lg p-4 text-right">
                    <div className="text-3xl font-mono font-bold text-gray-900 min-h-[40px] flex items-center justify-end">
                      {display}
                    </div>
                  </div>
                </div>

                {/* Calculator Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 */}
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    onClick={clear}
                  >
                    C
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={deleteLast}
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => inputOperation("÷")}
                  >
                    ÷
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => inputOperation("×")}
                  >
                    ×
                  </Button>

                  {/* Row 2 */}
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("7")}
                  >
                    7
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("8")}
                  >
                    8
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("9")}
                  >
                    9
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => inputOperation("-")}
                  >
                    -
                  </Button>

                  {/* Row 3 */}
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("4")}
                  >
                    4
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("5")}
                  >
                    5
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("6")}
                  >
                    6
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => inputOperation("+")}
                  >
                    +
                  </Button>

                  {/* Row 4 */}
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("1")}
                  >
                    1
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("2")}
                  >
                    2
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber("3")}
                  >
                    3
                  </Button>
                  <Button 
                    className="h-12 text-lg font-semibold bg-brand-600 hover:bg-brand-700 row-span-2"
                    onClick={performCalculation}
                  >
                    <Equal className="w-5 h-5" />
                  </Button>

                  {/* Row 5 */}
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold col-span-2"
                    onClick={() => inputNumber("0")}
                  >
                    0
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-semibold"
                    onClick={() => inputNumber(".")}
                  >
                    .
                  </Button>
                </div>
                <div className="text-sm text-gray-600 text-right -mt-2 mb-2 h-5">
                  {previousValue !== null && operation ? `${previousValue} ${operation} ${display}` : ' '}
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">History</div>
                  <ScrollArea className="h-24 pr-2">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {history.map((h, i) => (
                        <li key={i} className="flex justify-end"><span>{h}</span></li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            {/* Other Calculator Tools */}
            <div className="space-y-4">
              {calculatorTools.map((tool, index) => (
                <Card
                  key={tool.title}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{tool.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tool.title === "Scientific Calculator" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Tool</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogTitle className="sr-only">Scientific Calculator</DialogTitle>
                          <ScientificCalculator />
                        </DialogContent>
                      </Dialog>
                    ) : tool.title === "GPA Calculator" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Tool</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogTitle className="sr-only">GPA Calculator</DialogTitle>
                          <GPACalculator />
                        </DialogContent>
                      </Dialog>
                    ) : tool.title === "Percentage Calculator" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Tool</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogTitle className="sr-only">Percentage Calculator</DialogTitle>
                          <PercentageCalculator />
                        </DialogContent>
                      </Dialog>
                    ) : tool.title === "Age Calculator" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Tool</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogTitle className="sr-only">Age Calculator</DialogTitle>
                          <AgeCalculator />
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}
