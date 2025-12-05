import { Card } from "@/components/ui/card";

type Skill = {
  name: string;
  level: number;
};

const SkillCard = ({ skill }: { skill: Skill }) => {
  return (
    <Card className="p-4 border border-border">
      <h4 className="font-medium">{skill.name}</h4>
    </Card>
  );
};

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React.js", level: 95 },
        { name: "JavaScript", level: 93 },
        { name: "TypeScript", level: 88 },
        { name: "Tailwind CSS", level: 92 },
        { name: "Bootstrap", level: 90 },
        { name: "HTML/CSS", level: 95 },
      ],
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "PHP", level: 85 },
        { name: "MongoDB", level: 88 },
        { name: "MySQL", level: 87 },
        { name: "Firebase", level: 85 },
      ],
    },
    {
      title: "Mobile Development",
      skills: [
        { name: "Flutter", level: 92 },
        { name: "Dart", level: 90 },
        { name: "React Native", level: 80 },
        { name: "Firebase", level: 85 },
      ],
    },
    {
      title: "Programming Languages",
      skills: [
        { name: "Java", level: 88 },
        { name: "Python", level: 85 },
        { name: "JavaScript", level: 93 },
        { name: "Dart", level: 90 },
        { name: "PHP", level: 85 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="bg-gradient-primary bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {skillCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className="text-xl font-bold text-gradient mb-6">
                {category.title}
              </h3>
              <div className="grid gap-4">
                {category.skills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;