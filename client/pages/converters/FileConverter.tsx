import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Image as ImageIcon, FileImage, FileText, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from "jspdf";
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from "pdfjs-dist";
import PptxGenJS from "pptxgenjs";
import { Document as DocxDocument, Packer, Paragraph, PageBreak, TextRun } from "docx";

// Configure pdf.js worker
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
GlobalWorkerOptions.workerSrc = new URL("../../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function FileConverter() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileFileConverter />;
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>File Converter</CardTitle>
        <CardDescription>Convert images between formats, make PDFs from images, or export PDF pages as images.</CardDescription>
      </CardHeader>
      <CardContent className="max-w-full overflow-x-hidden p-3 sm:p-6">
        <Tabs defaultValue="image" className="w-full min-w-0">
          <TabsList className="w-full overflow-x-auto no-scrollbar min-w-0">
            <TabsTrigger value="image" className="flex-1 min-w-[160px] sm:min-w-0 text-xs sm:text-sm">Image ↔ Image</TabsTrigger>
            <TabsTrigger value="img2pdf" className="flex-1 min-w-[160px] sm:min-w-0 text-xs sm:text-sm">Images → PDF</TabsTrigger>
            <TabsTrigger value="pdf2img" className="flex-1 min-w-[160px] sm:min-w-0 text-xs sm:text-sm">PDF → Images</TabsTrigger>
            <TabsTrigger value="pdf2docx" className="flex-1 min-w-[180px] sm:min-w-0 text-xs sm:text-sm">PDF → DOCX (text)</TabsTrigger>
            <TabsTrigger value="img2ppt" className="flex-1 min-w-[180px] sm:min-w-0 text-xs sm:text-sm">Images → PPTX</TabsTrigger>
            <TabsTrigger value="pdf2ppt" className="flex-1 min-w-[180px] sm:min-w-0 text-xs sm:text-sm">PDF → PPTX</TabsTrigger>
          </TabsList>
          <TabsContent value="image" className="mt-4">
            <ImageToImage />
          </TabsContent>
          <TabsContent value="img2pdf" className="mt-4">
            <ImagesToPdf />
          </TabsContent>
          <TabsContent value="pdf2img" className="mt-4">
            <PdfToImages />
          </TabsContent>
          <TabsContent value="pdf2docx" className="mt-4">
            <PdfToDocx />
          </TabsContent>
          <TabsContent value="img2ppt" className="mt-4">
            <ImagesToPptx />
          </TabsContent>
          <TabsContent value="pdf2ppt" className="mt-4">
            <PdfToPptx />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ImageToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [quality, setQuality] = useState<number>(0.92);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const convert = async () => {
    if (!file) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
          downloadBlob(blob, `converted.${ext}`);
        },
        format,
        format === "image/jpeg" || format === "image/webp" ? quality : undefined,
      );
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-w-0">
      <div className="space-y-4 min-w-0">
        <div>
          <Label>Source image</Label>
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label>Output format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/png">PNG</SelectItem>
                <SelectItem value="image/jpeg">JPEG</SelectItem>
                <SelectItem value="image/webp">WEBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(format === "image/jpeg" || format === "image/webp") && (
            <div>
              <Label>Quality: {Math.round(quality * 100)}%</Label>
              <Slider value={[quality]} min={0.1} max={1} step={0.01} onValueChange={(v) => setQuality(v[0])} />
            </div>
          )}
        </div>
        <Button onClick={convert} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto" disabled={!file}>
          <Download className="w-4 h-4 mr-2" /> Convert & Download
        </Button>
      </div>
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border min-h-[240px] min-w-0">
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className="max-h-80 object-contain" />
        ) : (
          <div className="text-gray-500 text-sm flex flex-col items-center">
            <ImageIcon className="w-6 h-6 mb-2" /> No image selected
          </div>
        )}
      </div>
    </div>
  );
}

function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"p" | "l">("p");
  const [processing, setProcessing] = useState(false);

  const makePdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const doc = new jsPDF({ orientation: orientation === "p" ? "portrait" : "landscape", unit: "pt", format: size });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await fileToDataUrl(file);
        const img = await loadImage(dataUrl);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 24;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const { drawW, drawH } = fitContain(img.width, img.height, maxW, maxH);
        const x = (pageWidth - drawW) / 2;
        const y = (pageHeight - drawH) / 2;
        doc.addImage(img, "PNG", x, y, drawW, drawH);
        if (i < files.length - 1) doc.addPage();
      }
      const blob = doc.output("blob");
      downloadBlob(blob, "images.pdf");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Images</Label>
        <Input multiple type="file" accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label>Page size</Label>
          <Select value={size} onValueChange={(v) => setSize(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Orientation</Label>
          <Select value={orientation} onValueChange={(v) => setOrientation(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Portrait</SelectItem>
              <SelectItem value="l">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={makePdf} disabled={files.length === 0 || processing} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        Create PDF
      </Button>
    </div>
  );
}

function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; index: number }[]>([]);
  const [processing, setProcessing] = useState(false);

  const renderPdf = async () => {
    if (!file) return;
    setProcessing(true);
    setPages([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await getDocument({ data: arrayBuffer }).promise) as PDFDocumentProxy;
      const out: { url: string; index: number }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const url = canvas.toDataURL("image/png");
        out.push({ url, index: i });
      }
      setPages(out);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <Button onClick={renderPdf} disabled={!file || processing} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileImage className="w-4 h-4 mr-2" />}
        Convert to images
      </Button>
      {pages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {pages.map(p => (
            <div key={p.index} className="border rounded-lg p-2 bg-gray-50">
              <img src={p.url} alt={`Page ${p.index}`} className="w-full h-auto" />
              <div className="mt-2 flex justify-between text-sm">
                <span>Page {p.index}</span>
                <Button size="sm" variant="outline" onClick={() => downloadDataUrl(p.url, `page-${p.index}.png`)}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PdfToDocx(){
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try{
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await getDocument({ data: arrayBuffer }).promise) as PDFDocumentProxy;
      const paragraphs: Paragraph[] = [];
      for (let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const lines: string[] = [];
        let lastY: number | null = null;
        for (const item of textContent.items as any[]){
          const str = item.str as string;
          const y = item.transform?.[5] as number | undefined;
          if (lastY !== null && y !== undefined && Math.abs(lastY - y) > 8){
            lines.push("\n");
          }
          lines.push(str);
          lastY = y ?? lastY;
        }
        const text = lines.join("").replace(/\n\n+/g, "\n");
        const paraLines = text.split(/\n/);
        paraLines.forEach((l, idx)=>{
          paragraphs.push(new Paragraph({ children:[ new TextRun(l) ] }));
          if (idx === paraLines.length-1 && i < pdf.numPages){
            paragraphs.push(new Paragraph({ children:[ new PageBreak() ] }));
          }
        });
      }
      const doc = new DocxDocument({ sections:[{ properties:{}, children: paragraphs.length? paragraphs : [new Paragraph(" ")] }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, "converted.docx");
    } finally { setProcessing(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
      </div>
      <Button onClick={convert} disabled={!file || processing} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Export DOCX (text only)
      </Button>
    </div>
  );
}

function ImagesToPptx(){
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const make = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try{
      const pptx = new PptxGenJS();
      for (const f of files){
        const dataUrl = await fileToDataUrl(f);
        const slide = pptx.addSlide();
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.625, sizing: { type: 'contain', w: 10, h: 5.625 } as any });
      }
      await pptx.writeFile({ fileName: "images.pptx" });
    } finally { setProcessing(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Images</Label>
        <Input multiple type="file" accept="image/*" onChange={(e)=>setFiles(Array.from(e.target.files||[]))} />
      </div>
      <Button onClick={make} disabled={files.length===0 || processing} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Create PPTX
      </Button>
    </div>
  );
}

function PdfToPptx(){
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    try{
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await getDocument({ data: arrayBuffer }).promise) as PDFDocumentProxy;
      const pptx = new PptxGenJS();
      for (let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d"); if (!ctx) continue;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/png");
        const slide = pptx.addSlide();
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.625, sizing: { type: 'contain', w: 10, h: 5.625 } as any });
      }
      await pptx.writeFile({ fileName: "slides.pptx" });
    } finally { setProcessing(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
      </div>
      <Button onClick={convert} disabled={!file || processing} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Export PPTX
      </Button>
    </div>
  );
}

function MobileFileConverter() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>File Converter</CardTitle>
        <CardDescription>Mobile-friendly tools. Pick a section below.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 max-w-full overflow-x-hidden">
        <div className="space-y-2">
          <Accordion type="single" collapsible defaultValue="image">
            <AccordionItem value="image">
              <AccordionTrigger>Image ↔ Image</AccordionTrigger>
              <AccordionContent>
                <ImageToImageMobile />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="img2pdf">
              <AccordionTrigger>Images → PDF</AccordionTrigger>
              <AccordionContent>
                <ImagesToPdfMobile />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pdf2img">
              <AccordionTrigger>PDF → Images</AccordionTrigger>
              <AccordionContent>
                <PdfToImagesMobile />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pdf2docx">
              <AccordionTrigger>PDF → DOCX (text)</AccordionTrigger>
              <AccordionContent>
                <PdfToDocxMobile />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="img2ppt">
              <AccordionTrigger>Images → PPTX</AccordionTrigger>
              <AccordionContent>
                <ImagesToPptxMobile />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pdf2ppt">
              <AccordionTrigger>PDF → PPTX</AccordionTrigger>
              <AccordionContent>
                <PdfToPptxMobile />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageToImageMobile() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [quality, setQuality] = useState<number>(0.92);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!file) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const convert = async () => {
    if (!file) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
        downloadBlob(blob, `converted.${ext}`);
      }, format, format === "image/jpeg" || format === "image/webp" ? quality : undefined);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Source image</Label>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div className="space-y-3">
        <div>
          <Label>Output format</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as any)}>
            <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="image/png">PNG</SelectItem>
              <SelectItem value="image/jpeg">JPEG</SelectItem>
              <SelectItem value="image/webp">WEBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(format === "image/jpeg" || format === "image/webp") && (
          <div>
            <Label>Quality: {Math.round(quality * 100)}%</Label>
            <Slider value={[quality]} min={0.1} max={1} step={0.01} onValueChange={(v) => setQuality(v[0])} />
          </div>
        )}
      </div>
      <Button onClick={convert} className="bg-brand-600 hover:bg-brand-700 w-full" disabled={!file}>
        <Download className="w-4 h-4 mr-2" /> Convert & Download
      </Button>
      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-xl border h-[40vh]">
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className="max-h-full object-contain" />
        ) : (
          <div className="text-gray-500 text-sm flex flex-col items-center">
            <ImageIcon className="w-6 h-6 mb-2" /> No image selected
          </div>
        )}
      </div>
    </div>
  );
}

function ImagesToPdfMobile() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"p" | "l">("p");
  const [processing, setProcessing] = useState(false);

  const makePdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const doc = new jsPDF({ orientation: orientation === "p" ? "portrait" : "landscape", unit: "pt", format: size });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await fileToDataUrl(file);
        const img = await loadImage(dataUrl);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 24;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const { drawW, drawH } = fitContain(img.width, img.height, maxW, maxH);
        const x = (pageWidth - drawW) / 2;
        const y = (pageHeight - drawH) / 2;
        doc.addImage(img, "PNG", x, y, drawW, drawH);
        if (i < files.length - 1) doc.addPage();
      }
      const blob = doc.output("blob");
      downloadBlob(blob, "images.pdf");
    } finally { setProcessing(false); }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Images</Label>
        <Input multiple type="file" accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label>Page size</Label>
          <Select value={size} onValueChange={(v) => setSize(v as any)}>
            <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Orientation</Label>
          <Select value={orientation} onValueChange={(v) => setOrientation(v as any)}>
            <SelectTrigger><SelectValue placeholder="Orientation" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Portrait</SelectItem>
              <SelectItem value="l">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={makePdf} disabled={files.length === 0 || processing} className="bg-brand-600 hover:bg-brand-700 w-full">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        Create PDF
      </Button>
    </div>
  );
}

function PdfToImagesMobile() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; index: number }[]>([]);
  const [processing, setProcessing] = useState(false);

  const renderPdf = async () => {
    if (!file) return;
    setProcessing(true); setPages([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await getDocument({ data: arrayBuffer }).promise) as PDFDocumentProxy;
      const out: { url: string; index: number }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d"); if (!ctx) continue;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const url = canvas.toDataURL("image/png");
        out.push({ url, index: i });
      }
      setPages(out);
    } finally { setProcessing(false); }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <Button onClick={renderPdf} disabled={!file || processing} className="bg-brand-600 hover:bg-brand-700 w-full">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileImage className="w-4 h-4 mr-2" />}
        Convert to images
      </Button>
      {pages.length > 0 && (
        <div className="space-y-3">
          {pages.map(p => (
            <div key={p.index} className="border rounded-lg p-2 bg-gray-50">
              <img src={p.url} alt={`Page ${p.index}`} className="w-full h-auto max-h-[40vh] object-contain" />
              <div className="mt-2 flex justify-between text-sm">
                <span>Page {p.index}</span>
                <Button size="sm" variant="outline" onClick={() => downloadDataUrl(p.url, `page-${p.index}.png`)}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PdfToDocxMobile(){
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const convert = async () => {
    if (!file) return; setProcessing(true);
    try{
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await getDocument({ data: arrayBuffer }).promise) as PDFDocumentProxy;
      const paragraphs: Paragraph[] = [];
      for (let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = (textContent.items as any[]).map(it=>it.str as string).join(" ");
        paragraphs.push(new Paragraph({ children:[ new TextRun(text) ] }));
        if (i < pdf.numPages) paragraphs.push(new Paragraph({ children:[ new PageBreak() ] }));
      }
      const doc = new DocxDocument({ sections:[{ properties:{}, children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, "converted.docx");
    } finally { setProcessing(false); }
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
      </div>
      <Button onClick={convert} disabled={!file || processing} className="bg-brand-600 hover:bg-brand-700 w-full">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Export DOCX (text)
      </Button>
    </div>
  );
}

function ImagesToPptxMobile(){
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const make = async () => {
    if (files.length === 0) return; setProcessing(true);
    try{
      const pptx = new PptxGenJS();
      for (const f of files){
        const dataUrl = await fileToDataUrl(f);
        const slide = pptx.addSlide();
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.625, sizing: { type: 'contain', w: 10, h: 5.625 } as any });
      }
      await pptx.writeFile({ fileName: "images.pptx" });
    } finally { setProcessing(false); }
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Images</Label>
        <Input multiple type="file" accept="image/*" onChange={(e)=>setFiles(Array.from(e.target.files||[]))} />
      </div>
      <Button onClick={make} disabled={files.length===0 || processing} className="bg-brand-600 hover:bg-brand-700 w-full">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Create PPTX
      </Button>
    </div>
  );
}

function PdfToPptxMobile(){
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const convert = async () => {
    if (!file) return; setProcessing(true);
    try{
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await getDocument({ data: arrayBuffer }).promise) as PDFDocumentProxy;
      const pptx = new PptxGenJS();
      for (let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d"); if (!ctx) continue;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/png");
        const slide = pptx.addSlide();
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.625, sizing: { type: 'contain', w: 10, h: 5.625 } as any });
      }
      await pptx.writeFile({ fileName: "slides.pptx" });
    } finally { setProcessing(false); }
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>PDF file</Label>
        <Input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
      </div>
      <Button onClick={convert} disabled={!file || processing} className="bg-brand-600 hover:bg-brand-700 w-full">
        {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Export PPTX
      </Button>
    </div>
  );
}

function fitContain(w: number, h: number, maxW: number, maxH: number) {
  const ratio = Math.min(maxW / w, maxH / h);
  return { drawW: w * ratio, drawH: h * ratio };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
