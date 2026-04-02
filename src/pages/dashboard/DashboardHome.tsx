import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { DashboardHomeSkeleton } from '@/components/Skeletons';
import {
  FolderGit2, Wrench, MessageSquare, Briefcase, Eye,
  TrendingUp, Activity, ArrowUpRight, Sparkles, Zap,
  Clock, CheckCircle2, Circle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { getAbout } from '@/lib/store';

const DashboardHome = () => {
  const about = getAbout();
  const [stats] = useState({ projects: 12, skills: 24, testimonials: 8, services: 6 });
  const [time, setTime] = useState(new Date());
  const lastLogin = localStorage.getItem('last_login') || 'First login';

  useEffect(() => {
    const now = new Date().toLocaleString();
    localStorage.setItem('last_login', now);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completionItems = [
    { label: 'Profile Info', done: true },
    { label: 'Projects Added', done: stats.projects > 0 },
    { label: 'Skills Listed', done: stats.skills > 0 },
    { label: 'Services Defined', done: stats.services > 0 },
    { label: 'Testimonials Added', done: stats.testimonials > 0 },
  ];
  const completionPercent = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: FolderGit2, link: '/dashboard/projects', gradient: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/30' },
    { title: 'Skills', value: stats.skills, icon: Wrench, link: '/dashboard/skills', gradient: 'from-purple-500 to-violet-500', glow: 'shadow-purple-500/30' },
    { title: 'Testimonials', value: stats.testimonials, icon: MessageSquare, link: '/dashboard/testimonials', gradient: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/30' },
    { title: 'Services', value: stats.services, icon: Briefcase, link: '/dashboard/services', gradient: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/30' },
  ];

  const quickActions = [
    { label: 'Add New Project', icon: FolderGit2, link: '/dashboard/projects', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Manage Skills', icon: Wrench, link: '/dashboard/skills', color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Add Testimonial', icon: MessageSquare, link: '/dashboard/testimonials', color: 'bg-yellow-500/10 text-yellow-500' },
    { label: 'Update Services', icon: Briefcase, link: '/dashboard/services', color: 'bg-green-500/10 text-green-500' },
  ];

  return (
    <PageLoader skeleton={<DashboardHomeSkeleton />} delay={600}>
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <motion.div className="flex items-center gap-2 mb-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Welcome Back, {about.full_name.split(' ')[0]}!</span>
            </motion.div>
            <motion.h1 className="text-3xl md:text-4xl font-bold mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              Dashboard <span className="bg-gradient-primary bg-clip-text text-transparent">Overview</span>
            </motion.h1>
            <motion.div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {time.toLocaleTimeString()}
              </span>
              <span>Last login: {lastLogin}</span>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Link to="/" target="_blank">
              <Button className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
                <Eye className="w-4 h-4" /> View Website <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Link to={card.link}>
                <Card className="group relative overflow-hidden glass-card hover:shadow-glow transition-all duration-500 cursor-pointer border-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                    <motion.div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} ${card.glow} shadow-lg`} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}>
                      {card.value}
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-500 font-medium">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-primary/10"><Zap className="w-5 h-5 text-primary" /></div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div key={action.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                    <Link to={action.link}>
                      <Button variant="outline" className="w-full justify-between group hover:border-primary/50 transition-all">
                        <span className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}><Icon className="w-4 h-4" /></div>
                          {action.label}
                        </span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-secondary/10"><Activity className="w-5 h-5 text-secondary" /></div>
                Portfolio Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2" />
              </div>
              <ul className="space-y-2.5 mt-2">
                {completionItems.map((item, i) => (
                  <motion.li key={i} className="flex items-center gap-3 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}>
                    {item.done
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-primary/10"><Clock className="w-5 h-5 text-primary" /></div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { text: 'Project "E-Commerce" updated', time: '2 min ago', color: 'bg-blue-500' },
                  { text: 'New skill "Docker" added', time: '1 hr ago', color: 'bg-purple-500' },
                  { text: 'Testimonial from Sarah added', time: '3 hrs ago', color: 'bg-yellow-500' },
                  { text: 'Profile information saved', time: 'Yesterday', color: 'bg-green-500' },
                  { text: 'Service "UI/UX Design" created', time: '2 days ago', color: 'bg-cyan-500' },
                ].map((item, i) => (
                  <motion.li key={i} className="flex items-start gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.text}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </PageLoader>
  );
};

export default DashboardHome;
