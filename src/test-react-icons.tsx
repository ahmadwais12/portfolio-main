import React from "react";
import { 
  SiReact, SiJavascript, SiTypescript, SiTailwindcss, SiBootstrap, SiHtml5, SiCss3,
  SiNodedotjs, SiPhp, SiMongodb, SiMysql, SiFirebase,
  SiFlutter, SiDart, SiReactquery,
  SiPython,
  SiGit, SiGithub, SiDocker, SiGooglecloud
} from "react-icons/si";

const TestReactIcons = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing React Icons</h1>
      <div className="grid grid-cols-5 gap-4">
        <SiReact className="w-8 h-8 text-blue-500" />
        <SiJavascript className="w-8 h-8 text-yellow-500" />
        <SiTypescript className="w-8 h-8 text-blue-600" />
        <SiTailwindcss className="w-8 h-8 text-cyan-500" />
        <SiBootstrap className="w-8 h-8 text-purple-500" />
        <SiHtml5 className="w-8 h-8 text-orange-500" />
        <SiCss3 className="w-8 h-8 text-blue-500" />
        <SiNodedotjs className="w-8 h-8 text-green-500" />
        <SiPhp className="w-8 h-8 text-indigo-500" />
        <SiMongodb className="w-8 h-8 text-green-600" />
        <SiMysql className="w-8 h-8 text-blue-600" />
        <SiFirebase className="w-8 h-8 text-yellow-500" />
        <SiFlutter className="w-8 h-8 text-blue-400" />
        <SiDart className="w-8 h-8 text-blue-600" />
       
        <SiPython className="w-8 h-8 text-blue-400" />
        <SiGit className="w-8 h-8 text-orange-600" />
        <SiGithub className="w-8 h-8 text-gray-800" />
        <SiDocker className="w-8 h-8 text-blue-500" />
       
        <SiGooglecloud className="w-8 h-8 text-blue-400" />
      </div>
    </div>
  );
};

export default TestReactIcons;