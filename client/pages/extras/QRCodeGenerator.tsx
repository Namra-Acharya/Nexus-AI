import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Copy } from "lucide-react";

export default function QRCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<"L"|"M"|"Q"|"H">("M");

  useEffect(() => {
    const draw = async () => {
      if (!canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, text || " ", {
          errorCorrectionLevel: errorCorrection,
          width: size,
          margin: 1,
          color: { dark: "#111827", light: "#ffffff" }
        });
      } catch {}
    };
    draw();
  }, [text, size, errorCorrection]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        // @ts-ignore
        if (navigator.clipboard && navigator.clipboard.write) {
          // @ts-ignore
          await navigator.clipboard.write([
            new window.ClipboardItem({ "image/png": blob })
          ]);
        }
      }, "image/png");
    } catch {}
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Type any text or URL and save the QR code.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div>
              <Label htmlFor="qr-text">Text or URL</Label>
              <Input id="qr-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Size</Label>
                <Select value={String(size)} onValueChange={(v) => setSize(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[128, 192, 256, 320, 384, 448, 512].map((s) => (
                      <SelectItem key={s} value={String(s)}>{s}px</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Error correction</Label>
                <Select value={errorCorrection} onValueChange={(v) => setErrorCorrection(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["L","M","Q","H"] as const).map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadPng} className="bg-brand-600 hover:bg-brand-700">
                <Download className="w-4 h-4 mr-2" /> Download PNG
              </Button>
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border">
            <canvas ref={canvasRef} width={size} height={size} className="bg-white rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
