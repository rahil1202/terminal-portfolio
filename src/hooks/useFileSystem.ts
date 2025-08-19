
export interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileSystemItem[];
}

export const useFileSystem = () => {
  const fileSystem: FileSystemItem = {
    name: 'rahil',
    type: 'directory',
    children: [
      {
        name: 'about.txt',
        type: 'file',
        content: `Hi! I'm Rahil, a passionate Full-Stack Developer.

I specialize in building scalable web applications using modern
technologies like React, Node.js, and cloud platforms.

Skills:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Python
- Database: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kubernetes
- Tools: Git, CI/CD, Linux

When I'm not coding, you can find me exploring new technologies,
contributing to open-source projects, or brewing the perfect cup of coffee.`
      },
      {
        name: 'projects',
        type: 'directory',
        children: [
          {
            name: 'project-1.txt',
            type: 'file',
            content: `Portfolio Terminal
=================

An interactive developer portfolio styled as a realistic terminal UI.

Tech Stack:
- React + TypeScript
- Tailwind CSS
- Terminal-style interactions
- File system simulation

Features:
- Realistic boot sequence
- Command history and autocomplete
- Fun zone with Matrix rain
- Theme switching capabilities

GitHub: https://github.com/rahil-dev/portfolio-terminal`
          },
          {
            name: 'project-2.txt',
            type: 'file',
            content: `Travel Billing System
====================

Comprehensive travel expense management system for businesses.

Tech Stack:
- React + Node.js
- PostgreSQL
- Express.js
- JWT Authentication

Features:
- Expense tracking and reporting
- Multi-currency support
- PDF receipt generation
- Admin dashboard

GitHub: https://github.com/rahil-dev/travel-billing`
          }
        ]
      },
      {
        name: 'contact',
        type: 'directory',
        children: [
          {
            name: 'email.sh',
            type: 'file',
            content: `#!/bin/bash
# Email contact script

echo "📧 Email: rahil.dev@email.com"
echo "💼 Professional inquiries welcome"
echo "🚀 Open to collaboration opportunities"

# Open default email client
if command -v xdg-open > /dev/null; then
    xdg-open "mailto:rahil.dev@email.com"
fi`
          },
          {
            name: 'socials.sh',
            type: 'file',
            content: `#!/bin/bash
# Social media links

echo "🐙 GitHub: https://github.com/rahil1202"
echo "💼 LinkedIn: https://linkedin.com/in/rahil-vahora"
echo "🌐 Portfolio: https://rahil.pro"
echo "📱 Twitter: @Rahil_Vahora12"

echo ""
echo "Feel free to connect on any platform!"
echo "Always excited to discuss new projects and opportunities."`
          }
        ]
      }
    ]
  };

  const findItem = (path: string[], currentDir: FileSystemItem = fileSystem): FileSystemItem | null => {
    if (path.length === 0) return currentDir;
    
    const [first, ...rest] = path;
    if (first === '~' || first === '') return findItem(rest, currentDir);
    
    const item = currentDir.children?.find(child => child.name === first);
    if (!item) return null;
    
    if (rest.length === 0) return item;
    if (item.type === 'directory') return findItem(rest, item);
    
    return null;
  };

  return { fileSystem, findItem };
};
