import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { SocialManagerSkeleton } from '@/components/Skeletons';
import {
  Share2, Save, Search, ExternalLink, Link2, Sparkles, Eye, EyeOff, LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { getAbout, getSocialLinks, saveAbout, saveSocialLinks, type SocialLinkItem } from '@/lib/store';
import { getSocialIcon, rgba } from '@/lib/socials';
import { toast } from 'sonner';
import { LocalizedField } from '@/components/dashboard/LocalizedField';
import { localizedValues, type ContentLanguage } from '@/lib/localization';

const SocialManager = () => {
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SocialLinkItem[]>(() => getSocialLinks());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.url.toLowerCase().includes(q));
  }, [items, query]);

  const activeCount = items.filter((i) => i.enabled && i.url.trim()).length;
  const visibleCount = items.filter((i) => i.enabled).length;

  const update = (id: string, patch: Partial<SocialLinkItem>) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSocialLinks(items);

      // keep the legacy profile socials in sync (Hero + Profile cards read them)
      const about = getAbout();
      const url = (id: string) => items.find((i) => i.id === id)?.url.trim() ?? '';
      await saveAbout({
        ...about,
        social_links: {
          github: url('github') || about.social_links.github,
          linkedin: url('linkedin') || about.social_links.linkedin,
          twitter: url('x') || about.social_links.twitter,
          whatsapp: url('whatsapp') || about.social_links.whatsapp,
        },
      });
      toast.success('Social links saved — they now show on your website');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to save social links');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setItems(getSocialLinks());
    toast.info('Reloaded saved links');
  };

  const renderCard = (item: SocialLinkItem, index: number) => {
    const Icon = getSocialIcon(item.icon);
    const filled = item.url.trim().length > 0;
    const shown = item.enabled && filled;

    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
        className="glass-card flex flex-col gap-3 rounded-2xl border p-4"
        style={{
          borderColor: rgba(item.color, shown ? 0.45 : 0.12),
          background: shown ? rgba(item.color, 0.06) : undefined,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-md"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${rgba(item.color, 0.55)})` }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{item.label}</p>
            <p className="truncate text-xs text-muted-foreground">{item.sub}</p>
          </div>

          <Switch
            checked={item.enabled}
            onCheckedChange={(checked) => update(item.id, { enabled: checked })}
            aria-label={`Show ${item.label} on website`}
          />
        </div>

        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={item.url}
            onChange={(e) => update(item.id, { url: e.target.value })}
            placeholder="https://..."
            className="glass-card border-0 pl-9"
          />
        </div>

        <details className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Edit translated label and caption</summary>
          <div className="mt-3 space-y-4">
            <LocalizedField idPrefix={`${item.id}-link-label`} label="Link Label" value={localizedValues(item, 'label')} onChange={(language: ContentLanguage, value) => update(item.id, { [`label_${language}`]: value, ...(language === 'en' ? { label: value } : {}) } as Partial<SocialLinkItem>)} />
            <LocalizedField idPrefix={`${item.id}-caption`} label="Caption" value={localizedValues(item, 'sub')} onChange={(language: ContentLanguage, value) => update(item.id, { [`sub_${language}`]: value, ...(language === 'en' ? { sub: value } : {}) } as Partial<SocialLinkItem>)} />
          </div>
        </details>

        <div className="flex items-center justify-between gap-2">
          <span
            className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: shown ? item.color : undefined }}
          >
            {item.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {shown ? 'Visible on website' : item.enabled ? 'Add a link to show it' : 'Hidden from website'}
          </span>

          {filled && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-primary"
            >
              Open <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <PageLoader skeleton={<SocialManagerSkeleton />} delay={600}>
      <div className="space-y-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Social Media</h1>
          </div>
          <p className="text-muted-foreground">
            Add your social media links — the ones you switch on are displayed on your portfolio website.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search platforms..."
              className="glass-card border-0 pl-9"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{activeCount}</span> published · {visibleCount}/{items.length} enabled
            </span>
            <Button onClick={() => void handleSave()} disabled={saving} className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, index) => renderCard(item, index))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
            No platform matches “{query}”.
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                </div>
                Website Preview
                <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> {activeCount} icons live
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
                {items.filter((i) => i.enabled && i.url.trim()).map((item) => {
                  const Icon = getSocialIcon(item.icon);
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        borderColor: rgba(item.color, 0.25),
                        background: rgba(item.color, 0.08),
                      }}
                    >
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${item.color}, ${rgba(item.color, 0.55)})` }}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: item.color }}>
                        {item.label}
                      </span>
                    </a>
                  );
                })}
                {activeCount === 0 && (
                  <p className="col-span-full text-sm text-muted-foreground">
                    Add at least one link and flip its switch on to see it here and on your website.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <Button variant="outline" onClick={resetToDefaults} className="gap-2">
            Reload Saved
          </Button>
        </motion.div>
      </div>
    </PageLoader>
  );
};

export default SocialManager;
