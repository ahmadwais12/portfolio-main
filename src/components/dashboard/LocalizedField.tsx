import type { HTMLInputTypeAttribute } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContentLanguage, LocalizedValues } from "@/lib/localization";

const languages: { code: ContentLanguage; label: string; direction: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", direction: "ltr" },
];

type LocalizedFieldProps = {
  label: string;
  value: LocalizedValues;
  onChange: (language: ContentLanguage, value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  inputType?: HTMLInputTypeAttribute;
  direction?: "auto" | "ltr";
  idPrefix?: string;
  /** Restrict which language inputs are rendered (defaults to all three). */
  only?: ContentLanguage[];
};

export function LocalizedField({ label, value, onChange, multiline = false, rows = 3, placeholder, required = false, inputType = "text", direction = "auto", idPrefix, only }: LocalizedFieldProps) {
  const visibleLanguages = only?.length ? languages.filter(language => only.includes(language.code)) : languages;
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="text-sm font-medium text-muted-foreground">{label}{required ? " *" : ""}</legend>
      <div className={`grid gap-3 ${visibleLanguages.length > 1 ? "md:grid-cols-3" : "md:grid-cols-1"}`}>
        {visibleLanguages.map(language => {
          const id = `${idPrefix || label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${language.code}`;
          return (
            <div key={language.code} className="min-w-0 space-y-1.5">
              <Label htmlFor={id} className="text-xs text-muted-foreground">{language.label}</Label>
              {multiline ? (
                <Textarea id={id} dir={direction === "ltr" ? "ltr" : language.direction} value={value[language.code]} onChange={event => onChange(language.code, event.target.value)} placeholder={placeholder} rows={rows} className="glass-card resize-y border-0" />
              ) : (
                <Input id={id} type={inputType} dir={direction === "ltr" ? "ltr" : language.direction} value={value[language.code]} onChange={event => onChange(language.code, event.target.value)} placeholder={placeholder} className="glass-card border-0" />
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
