import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightLeft,
  Ruler,
  Thermometer,
  FileImage,
  Zap,
  Globe
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import UnitConverter from "./converters/UnitConverter";
import TemperatureConverter from "./converters/TemperatureConverter";
import FileConverter from "./converters/FileConverter";
import Seo from "@/components/Seo";

export default function Converters() {
  const converterTools = [
    {
      title: "Unit Converter",
      description: "Convert length, weight, time, area, and volume",
      icon: Ruler,
      badge: "Utility",
      color: "bg-green-100 text-green-700 border-green-200"
    },
    {
      title: "Temperature Converter",
      description: "Celsius, Fahrenheit, and Kelvin conversions",
      icon: Thermometer,
      badge: "Science",
      color: "bg-red-100 text-red-700 border-red-200"
    },
    {
      title: "File Converter",
      description: "Convert PDF ↔ Word, JPG ↔ PNG, and more",
      icon: FileImage,
      badge: "Files",
      color: "bg-blue-100 text-blue-700 border-blue-200"
    }
  ];

  return (
    <Layout>
      <Seo title="Converters – Nexus AI" description="Unit, temperature, and file converters designed for students." path="/converters" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <ArrowRightLeft className="w-4 h-4" />
              Conversion Tools
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌍 Converters
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convert anything to anything with our comprehensive conversion tools
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converterTools.map((tool) => {
              const isUnit = tool.title === "Unit Converter";
              const isTemp = tool.title === "Temperature Converter";
              const isFile = tool.title === "File Converter";
              return (
                <Card
                  key={tool.title}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl ${tool.color}`}>
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary">{tool.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isUnit ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Converter</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-3xl">
                          <DialogTitle className="sr-only">Unit Converter</DialogTitle>
                          <UnitConverter />
                        </DialogContent>
                      </Dialog>
                    ) : isTemp ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Converter</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-3xl">
                          <DialogTitle className="sr-only">Temperature Converter</DialogTitle>
                          <TemperatureConverter />
                        </DialogContent>
                      </Dialog>
                    ) : isFile ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="brand">Open Converter</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-4xl">
                          <DialogTitle className="sr-only">File Converter</DialogTitle>
                          <FileConverter />
                        </DialogContent>
                      </Dialog>
) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </Layout>
  );
}
