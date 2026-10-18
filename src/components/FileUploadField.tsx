import { useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptFor, replacePortfolioFile, uploadPortfolioFile, type PortfolioBucket } from "@/lib/uploads";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket: PortfolioBucket;
  prefix: string;
  kind?: "image" | "pdf";
  className?: string;
  deletePreviousOnReplace?: boolean;
};

export function FileUploadField({ label, value, onChange, bucket, prefix, kind = "image", className, deletePreviousOnReplace = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const nextUrl = deletePreviousOnReplace && value
        ? await replacePortfolioFile(file, bucket, prefix, value)
        : await uploadPortfolioFile(file, bucket, prefix);
      onChange(nextUrl);
      toast.success(kind === "pdf" ? "File uploaded" : "Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40 text-muted-foreground">
          {value && kind === "image"
            ? <img src={value} alt="" className="h-full w-full object-cover" />
            : kind === "pdf" ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
        </div>
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="https://... or upload a file" className="glass-card border-0" />
        {value && (
          <Button type="button" variant="ghost" size="icon" aria-label="Clear" onClick={() => onChange("")} className="flex-shrink-0 text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading} className="flex-shrink-0 gap-2">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="hidden sm:inline">{uploading ? "Uploading" : "Upload"}</span>
        </Button>
        <input ref={inputRef} type="file" accept={acceptFor(bucket, kind)} className="hidden" onChange={e => void handleFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
