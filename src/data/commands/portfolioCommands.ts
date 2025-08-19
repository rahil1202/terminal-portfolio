import { portfolioData } from "../portfolioData";
import { projectUrls } from "../projectUrls";

export const portfolioCommands = {
  about: () => portfolioData.about,
  work: () => portfolioData.work,
  projects: () => portfolioData.projects,
  experience: () => portfolioData.experience,
  contact: () => portfolioData.contact,  
};