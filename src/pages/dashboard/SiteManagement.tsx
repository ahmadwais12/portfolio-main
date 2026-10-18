import { useEffect, useState } from "react";
import { Globe, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/FileUploadField";
import PageLoader from "@/components/PageLoader";
import { SettingsManagerSkeleton } from "@/components/Skeletons";
import { useSiteSettings, saveSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import { toast } from "sonner";
import { LocalizedField } from "@/components/dashboard/LocalizedField";

export default function SiteManagement() {
  const settings = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(settings), [settings]);
  const update = (key: keyof SiteSettings, val: string) => setForm(current => ({ ...current, [key]: val }));
  const updateLauncherText = (_language: "en", value: string) => {
    update("launcherText_en", value);
    update("launcherText", value);
  };
  const save = async () => {
    setSaving(true);
    try { await saveSiteSettings(form); toast.success("Site branding saved"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to save site branding"); }
    finally { setSaving(false); }
  };

  return <PageLoader skeleton={<SettingsManagerSkeleton />}><div className="mx-auto max-w-5xl space-y-6">
    <div><div className="mb-1 flex items-center gap-3"><div className="rounded-xl bg-gradient-primary p-2.5"><Globe className="h-5 w-5 text-white" /></div><h1 className="text-3xl font-bold">Site Management</h1></div><p className="text-muted-foreground">Update the website logo and browser launcher branding.</p></div>
    <Card className="glass-card border-0"><CardHeader><CardTitle>Website logo</CardTitle><CardDescription>Shown in the website navigation bar.</CardDescription></CardHeader><CardContent><FileUploadField label="Website logo" value={form.websiteLogo} onChange={v => update("websiteLogo", v)} bucket="portfolio-assets" prefix="website-logo" /></CardContent></Card>
    <Card className="glass-card border-0"><CardHeader><CardTitle>Launcher branding</CardTitle><CardDescription>The launcher logo appears as the browser tab icon, and launcher text is used in page titles.</CardDescription></CardHeader><CardContent className="space-y-6"><FileUploadField label="Launcher logo" value={form.launcherLogo} onChange={v => update("launcherLogo", v)} bucket="portfolio-assets" prefix="launcher-logo" /><LocalizedField label="Launcher text" value={{ en: form.launcherText_en || form.launcherText }} onChange={updateLauncherText} placeholder="My Portfolio" /></CardContent></Card>
    <div className="flex justify-end"><Button onClick={() => void save()} disabled={saving || !form.launcherText.trim()} className="gap-2 bg-gradient-primary text-white"><Save className="h-4 w-4" />{saving ? "Saving…" : "Save changes"}<Sparkles className="h-4 w-4" /></Button></div>
  </div></PageLoader>;
}
