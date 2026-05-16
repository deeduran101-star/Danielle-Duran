import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Scale,
  Pen,
  BookOpen,
  Library,
  Microscope,
  Mail,
  ArrowRight,
  Volume2,
  VolumeX,
  MessageSquare,
  ChevronRight,
  Send,
  Sparkles,
  X,
  FileText,
  Search,
  Upload,
  Star,
  Target,
  ExternalLink,
  Download,
  GripVertical,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";
import {
  analyzeRhetoric,
  getAssistantResponse,
  generateArtifactImage,
} from "./lib/gemini";
import { artifacts, type Artifact } from "./data";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// --- COMPONENTS ---

const Navbar = ({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
}: {
  currentTab: string;
  setCurrentTab: (t: string) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
}) => {
  const tabs = ["Home", "Portfolio", "Reflection Paper", "Resume"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030202]/90 backdrop-blur-md border-b border-[#3d156b]/20 shadow-sm dark:bg-stone-100/90 dark:border-[#3d156b]/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#b09eec] flex items-center justify-center rounded-sm text-stone-900 font-serif font-bold">
            D
          </div>
          <span className="font-serif font-bold tracking-widest text-stone-100 dark:text-[#3d156b] hidden sm:block">
            DANIELLE DURAN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar pb-1 px-2 -mx-2 sm:mx-0 sm:px-0 sm:pb-0 scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-sm border text-[9px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105 relative overflow-hidden group shrink-0",
                  currentTab === tab
                    ? "bg-[#ffffff] border-[#ffffff] text-purple-600"
                    : "bg-[#f9fafd] border-transparent text-purple-400 hover:bg-[#ffffff] hover:text-purple-600",
                )}
              >
                {tab}
                {currentTab === tab && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#3d156b] shadow-[0_0_8px_rgba(61,21,107,0.6)]"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-stone-300 hover:text-[#3d156b] transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <Star className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

const SectionHeading = ({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="mb-12 text-[17px] leading-[22px]">
    <h2 className="text-[45.25px] font-serif font-bold text-stone-900 dark:text-[#3d156b] mb-2 leading-tight">
      {children}
    </h2>
    <div className="h-1 w-20 bg-[#3d156b] rounded-full mb-4" />
    {subtitle && (
      <p className="text-stone-500 dark:text-stone-600 max-w-2xl font-serif italic">
        {subtitle}
      </p>
    )}
  </div>
);

const ArtifactCard = ({
  artifact,
  onClick,
  isEditMode,
  isEditing,
  onEdit,
}: {
  artifact: Artifact;
  onClick: () => void;
  isEditMode?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: artifact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon =
    ({ Scale, Pen, BookOpen, FileText } as any)[artifact.icon] || FileText;
  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: isEditMode || isEditing ? 0 : -5 }}
        onClick={isEditMode || isEditing ? undefined : onClick}
        className={cn(
          "group bg-white dark:bg-stone-50 p-6 rounded-sm border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer relative min-h-[350px]",
          (isEditMode || isEditing) &&
            "ring-2 ring-camel/60 bg-stone-50 border-camel",
        )}
      >
        {(isEditMode || isEditing) && (
          <div className="absolute top-2 right-2 p-1.5 flex gap-2">
            <button
              {...attributes}
              {...listeners}
              className="p-1.5 bg-[#3d156b] text-stone-900 rounded-sm cursor-grab"
            >
              <GripVertical className="w-4 h-4 text-white" />
            </button>
            <div className="p-1.5 bg-[#3d156b] text-stone-900 rounded-sm pointer-events-none">
              <Target className="w-4 h-4" />
            </div>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="absolute bottom-4 right-4 bg-stone-900 text-white text-[10px] uppercase font-bold py-1 px-2 rounded-sm"
          aria-label="Edit artifact details"
        >
          Edit
        </button>
        <div>
          <div className="w-10 h-10 bg-stone-50 flex items-center justify-center mb-4 group-hover:bg-[#3d156b]/10 transition-colors">
            <Icon className="w-5 h-5 text-[#3d156b]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-[#3d156b] mb-2 truncate">
            {artifact.title}
          </h3>
          <p className="text-sm text-stone-500 mb-4 line-clamp-3 leading-relaxed">
            {artifact.summary.length > 150
              ? artifact.summary.slice(0, 150) + "..."
              : artifact.summary}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const ArtifactDeepDiveItem = ({
  art,
  artifactList,
  isEditMode,
  handleUpdateArtifact,
  handleGenerateImage,
  handleFileUpload,
  handlePdfUpload,
  generatingId,
  generatedImages,
  customImages,
  customPdfs,
  fairnessOnTrialImage,
}: {
  art: Artifact;
  artifactList: Artifact[];
  isEditMode: boolean;
  handleUpdateArtifact: (id: string, updates: Partial<Artifact>) => void;
  handleGenerateImage: (art: Artifact) => void;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  generatingId: string | null;
  generatedImages: Record<string, string>;
  customImages: Record<string, string>;
  customPdfs: Record<string, string>;
  fairnessOnTrialImage: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: art.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDownload = () => {
    const blob = new Blob([art.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${art.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={isEditMode ? setNodeRef : undefined}
      style={isEditMode ? style : undefined}
      className="w-full mb-12"
    >
      <motion.div
        id={`artifact-${art.id}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "bg-white border border-stone-200 shadow-sm p-8 sm:p-12 w-full",
          isEditMode && "shadow-inner bg-stone-50 border-2 border-camel/40",
        )}
      >
        {isEditMode && (
          <div className="flex justify-end w-full mb-4">
            <div className="p-2 bg-stone-200 text-stone-900 rounded-sm shadow-sm flex gap-2 w-max">
              <button {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="border-b border-stone-200 pb-6">
            <div className="text-[10px] sm:text-xs uppercase font-bold text-camel tracking-widest mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-camel rounded-full" />
              CORE AREA: {art.category}
            </div>
            {isEditMode ? (
              <input
                value={art.title}
                onChange={(e) =>
                  handleUpdateArtifact(art.id, { title: e.target.value })
                }
                className="font-serif italic font-bold text-stone-900 mb-2 text-2xl sm:text-3xl leading-snug w-full outline-none p-2 bg-stone-50 block border border-stone-200"
              />
            ) : (
              <h3 className="font-serif italic font-bold text-stone-900 mb-2 text-2xl sm:text-3xl leading-snug">
                {art.title}
              </h3>
            )}
            {isEditMode ? (
              <input
                value={art.summary}
                onChange={(e) =>
                  handleUpdateArtifact(art.id, { summary: e.target.value })
                }
                className="text-stone-500 font-serif italic text-base sm:text-lg w-full outline-none p-2 bg-stone-50 border border-stone-200 block"
              />
            ) : (
              <p className="text-stone-500 font-serif italic text-base sm:text-lg">
                {art.summary}
              </p>
            )}
          </div>

          {/* Content (Annotation) */}
          <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed font-serif text-[16px] text-justify space-y-4">
            {isEditMode ? (
              <textarea
                value={art.content}
                onChange={(e) =>
                  handleUpdateArtifact(art.id, { content: e.target.value })
                }
                className="w-full min-h-[250px] bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-camel p-4 text-base outline-none resize-y rounded-sm font-serif block"
              />
            ) : (
              <ReactMarkdown>{art.content}</ReactMarkdown>
            )}
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-sm shadow-sm border border-stone-100 mt-6 sm:mt-8">
          <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-camel" /> Skills Demonstrated
          </h4>
          {art.skills && art.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {art.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-stone-100 text-stone-600 border border-stone-200 text-xs font-bold uppercase tracking-widest rounded-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button Section */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-stone-500 font-serif italic">
            <FileText className="w-5 h-5 text-stone-400" />
            {((customPdfs && customPdfs[art.id]) || art.pdfUrl) ? (
              <span>PDF document ready to view.</span>
            ) : (
              <span>A PDF document for this artifact has not yet been uploaded.</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {isEditMode && (
              <label className="px-4 py-2 bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-bold tracking-widest uppercase hover:bg-stone-200 transition-colors rounded-sm cursor-pointer flex items-center gap-2">
                <Upload className="w-3 h-3 text-camel" /> {((customPdfs && customPdfs[art.id]) || art.pdfUrl) ? "Replace PDF" : "Upload PDF"}
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => handlePdfUpload(e, art.id)}
                />
              </label>
            )}
            
            {((customPdfs && customPdfs[art.id]) || art.pdfUrl) ? (
              <a
                href={(customPdfs && customPdfs[art.id]) || art.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-stone-900 text-stone-100 uppercase tracking-widest font-bold text-xs hover:bg-stone-800 transition-colors rounded-sm shadow-sm flex items-center gap-2"
              >
                View Artifact <ChevronRight className="w-4 h-4" />
              </a>
            ) : (
              <button disabled className="px-6 py-2.5 bg-stone-100 text-stone-400 uppercase tracking-widest font-bold text-xs rounded-sm border border-stone-200 cursor-not-allowed">
                View Artifact
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-stone-50 p-6 rounded-sm border border-stone-100 shadow-sm flex flex-col justify-between min-h-[350px]">
    <div>
      <div className="w-10 h-10 bg-stone-100 animate-pulse mb-4 rounded-sm" />
      <div className="h-6 bg-stone-100 animate-pulse mb-2 w-3/4 rounded-sm" />
      <div className="space-y-2">
        <div className="h-4 bg-stone-50 animate-pulse w-full rounded-sm" />
        <div className="h-4 bg-stone-50 animate-pulse w-5/6 rounded-sm" />
        <div className="h-4 bg-stone-50 animate-pulse w-4/6 rounded-sm" />
      </div>
    </div>
    <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-50">
      <div className="h-4 bg-stone-50 animate-pulse w-12 rounded-sm" />
      <div className="h-4 bg-stone-50 animate-pulse w-16 rounded-sm" />
    </div>
  </div>
);

// --- PAGES ---

import profilePortrait from "./assets/images/regenerated_image_1778055017907.jpg";
import fairnessOnTrialImage from "./assets/images/regenerated_image_1778086151274.png";
import adversityAdvocacyImage from "./assets/images/regenerated_image_1778140849602.png";

const HomePage = ({
  setCurrentTab,
  customImages,
  isEditMode,
  handleFileUpload,
}: {
  setCurrentTab: (t: string) => void;
  customImages: Record<string, string>;
  isEditMode: boolean;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
}) => (
  <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-stone-900">
    <div className="flex flex-col items-center justify-center text-center space-y-6 mb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4 relative group"
      >
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-stone-100 shadow-md relative group mx-auto flex items-center justify-center">
          <img
            src={customImages["profile_portrait"] || profilePortrait}
            alt="Danielle Duran"
            className="max-w-none object-cover"
            style={{
              width: "170px",
              height: "188px",
              marginLeft: "0px",
              marginTop: "-18px",
            }}
          />
          {isEditMode && (
            <label className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
              <Upload className="w-5 h-5 mb-1 text-camel" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-center px-2">
                Update Portrait
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "profile_portrait")}
              />
            </label>
          )}
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-camel"
      >
        SOC 191 Final Portfolio
      </motion.p>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tighter"
      >
        Danielle Duran
      </motion.h1>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl font-serif italic text-stone-600"
      >
        SOC 191 Sociology Portfolio
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm font-bold uppercase tracking-widest text-stone-500"
      >
        Sociology Major | California State University, Sacramento
      </motion.p>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="h-[2px] bg-camel my-4"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="prose prose-stone text-base sm:text-lg text-stone-700 max-w-2xl text-left sm:text-center leading-relaxed"
      >
        <p>
          My name is Danielle Duran, and I am a Sociology major at California State University, Sacramento. This portfolio represents my academic growth through sociology coursework, with a focus on structural inequality, criminal justice, legal systems, public sociology, youth advocacy, and institutional analysis.
        </p>
        <p>
          Across my coursework, I have learned to connect individual experiences to larger social systems. My selected artifacts demonstrate growth in sociological theory, research methods, advanced studies, and thematic areas.
        </p>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-stone-50 border border-stone-200 p-8 sm:p-12 rounded-sm shadow-sm text-center mb-16"
    >
      <h3 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-8 pb-4 border-b border-stone-200">
        Portfolio Core Areas
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          "Theory",
          "Methods",
          "Advanced Studies",
          "Thematic Areas"
        ].map((area) => (
          <div key={area} className="bg-white border border-stone-200 py-4 px-2 rounded-sm text-sm font-bold uppercase tracking-widest text-stone-600 shadow-sm">
            {area}
          </div>
        ))}
      </div>
      
      <p className="text-sm sm:text-base text-stone-600 font-serif italic max-w-xl mx-auto">
        The selected artifacts show my development in theory application, research, critical thinking, written communication, institutional analysis, and sociological imagination.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <button
        onClick={() => setCurrentTab("Portfolio")}
        className="w-full sm:w-auto bg-stone-900 text-stone-100 px-8 py-3.5 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2"
      >
        View Portfolio <ExternalLink className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrentTab("Reflection Paper")}
        className="w-full sm:w-auto bg-camel text-stone-100 px-8 py-3.5 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-camel/80 transition-all shadow-md"
      >
        Read Reflection Paper
      </button>
      <button
        onClick={() => setCurrentTab("Resume")}
        className="w-full sm:w-auto bg-white border border-stone-200 text-stone-900 px-8 py-3.5 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-stone-50 transition-all shadow-sm"
      >
        Resume
      </button>
    </motion.div>
  </div>
);

const ReflectionPaperPage = () => (
  <div className="max-w-4xl mx-auto py-16 sm:py-24 px-4 sm:px-6">
    <SectionHeading>SOC 191 Reflection Paper</SectionHeading>

    <div className="prose prose-stone max-w-none space-y-8">
      <p className="text-lg leading-relaxed text-stone-700">
        In this final reflection paper, I synthesize my sociological learning,
        theoretical applications, and methodological understanding gained
        throughout my degree program.
      </p>

      <div className="my-10 border border-stone-100 p-6 sm:p-8 rounded-sm bg-stone-50 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="w-12 h-12 text-stone-400 mb-4" />
        <p className="text-sm font-serif italic text-stone-500 mb-6">
          Reflection paper PDF will be linked here.
        </p>
      </div>
    </div>
  </div>
);

const PortfolioPage = ({
  customImages,
  setCustomImages,
  customPdfs,
  handlePdfUpload,
  isEditMode,
  handleFileUpload,
}: {
  customImages: Record<string, string>;
  setCustomImages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  customPdfs: Record<string, string>;
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  isEditMode: boolean;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
}) => {
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(
    null,
  );
  const [generatedImages, setGeneratedImages] = useState<
    Record<string, string>
  >({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  const [artifactList, setArtifactList] = useState<Artifact[]>(() => {
    try {
      const savedContent = localStorage.getItem("duran_portfolio_content_v5");
      return savedContent ? JSON.parse(savedContent) : artifacts;
    } catch {
      return artifacts;
    }
  });

  const handleUpdateArtifact = (id: string, updates: Partial<Artifact>) => {
    setArtifactList((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updates } : art)),
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        "duran_portfolio_content_v5",
        JSON.stringify(artifactList),
      );
    } catch {
      // Ignore
    }
  }, [artifactList]);

  const handleGenerateImage = async (art: Artifact) => {
    setGeneratingId(art.id);
    try {
      const imageUrl = await generateArtifactImage(art.title, art.summary);
      setGeneratedImages((prev) => ({ ...prev, [art.id]: imageUrl }));
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setGeneratingId(null);
    }
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setArtifactList((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const coreAreas = [
    "Theory",
    "Methods",
    "Advanced Studies",
    "Thematic Areas",
  ] as const;
  const featuredArtifact = artifactList.find(
    (a) => a.id === "fairness-on-trial",
  );

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={artifactList.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="max-w-6xl mx-auto py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Applied sociological theory, methodological inquiry, and thematic research.">
            Sociology Portfolio
          </SectionHeading>
          
          <div className="mb-12">
            <p className="text-lg leading-relaxed text-stone-700 font-serif mb-8">
              This portfolio includes four selected artifacts that represent the required SOC 191 core areas: theory, methods, advanced studies, and thematic areas. Each artifact was selected because it demonstrates a different part of my growth as a sociology major, including theory application, research, critical thinking, writing, institutional analysis, and the sociological imagination.
            </p>
          </div>

          {/* Artifacts Grid */}
          <div className="grid grid-cols-1 gap-12 sm:gap-16 items-stretch">
            {artifactList
              .map((art) => (
                <ArtifactDeepDiveItem
                  key={art.id}
                  art={art}
                  artifactList={artifactList}
                  isEditMode={isEditMode}
                  handleUpdateArtifact={handleUpdateArtifact}
                  handleGenerateImage={handleGenerateImage}
                  handleFileUpload={handleFileUpload}
                  handlePdfUpload={handlePdfUpload}
                  generatingId={generatingId}
                  generatedImages={generatedImages}
                  customImages={customImages}
                  customPdfs={customPdfs}
                  fairnessOnTrialImage={fairnessOnTrialImage}
                />
              ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

const FutureResearchPage = () => (
  <div className="max-w-5xl mx-auto py-12 sm:py-24 px-4 sm:px-6">
    <SectionHeading subtitle="Upcoming research projects and academic inquiries.">
      Future Research
    </SectionHeading>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-stone-50 border border-stone-200 p-6 sm:p-8 md:p-12 rounded-sm shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-camel/10 flex items-center justify-center rounded-sm shrink-0"
        >
          <Microscope className="w-5 h-5 sm:w-6 sm:h-6 text-camel" />
        </motion.div>
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-[#3d156b] italic">
            Inquiry: Judicial Chambers Transparency
          </h3>
          <p className="text-[9px] sm:text-xs uppercase tracking-widest font-bold text-stone-400">
            Sociology | Sacramento State University
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="prose prose-stone prose-sm">
            <p className="text-stone-600 leading-relaxed text-[17px]">
              This research explores the intersection of legal transparency and
              civic trust within the courtroom.
            </p>
            <h4 className="font-serif font-bold text-stone-900 dark:text-[#3d156b] italic">
              Current Inquiry Goal
            </h4>
            <p className="text-stone-600 text-[17px]">
              To investigate the spatial sociology of courtrooms, specifically
              focusing on the non-public nature of judicial chambers and its
              impact on procedural fairness.
            </p>
          </div>

          <div className="bg-stone-50 p-6 rounded-sm border border-stone-100">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 dark:text-[#3d156b] mb-2">
              Research Focus Areas
            </h4>
            <ul className="space-y-3 text-sm text-stone-600">
              {[
                {
                  text: "The 'Black Box' nature of judicial deliberation.",
                  bold: ["Black Box"],
                },
                {
                  text: "Spatial hierarchy and its reinforcement of legal authority.",
                  bold: ["Spatial hierarchy"],
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <ChevronRight className="w-4 h-4 text-camel mt-0.5 flex-shrink-0" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.text.replace(
                        new RegExp(`(${item.bold.join("|")})`, "g"),
                        "<strong>$1</strong>",
                      ),
                    }}
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-stone-900 text-stone-100 p-8 rounded-sm shadow-lg flex flex-col justify-center text-center space-y-4 cursor-default"
        >
          <FileText className="w-12 h-12 text-camel mx-auto opacity-50" />
          <h4 className="font-serif font-bold text-[#ffffff]">
            Current Status
          </h4>
          <p className="text-[11px] text-stone-400 uppercase tracking-widest leading-relaxed">
            Actively refining core concepts of judicial deliberation
            transparency through comparative legal analysis.
          </p>
          <div className="pt-4">
            <div className="inline-block px-4 py-2 bg-camel/10 text-camel border border-camel/20 text-[10px] uppercase font-bold tracking-widest">
              Research in progress
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

const ResumePage = ({
  customImages,
}: {
  customImages: Record<string, string>;
}) => (
  <div className="max-w-4xl mx-auto py-16 sm:py-24 px-4 sm:px-6">
    <SectionHeading>Professional Experience & Resume</SectionHeading>

    <div className="prose prose-stone max-w-none space-y-8">
      <p className="text-lg leading-relaxed text-stone-700">
        My professional experience has strengthened many of the same skills
        developed throughout my sociology coursework, including communication,
        organization, institutional awareness, problem-solving, and advocacy.
      </p>

      {customImages["resume_image"] ? (
        <div className="my-10 border border-stone-200 rounded-sm overflow-hidden shadow-lg">
          <img
            src={customImages["resume_image"]}
            alt="Professional Resume"
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className="my-10 border border-stone-100 p-6 sm:p-8 rounded-sm bg-stone-50 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <FileText className="w-12 h-12 text-stone-400 mb-4" />
          <p className="text-sm font-serif italic text-stone-500 text-center max-w-md">
            Resume image will be displayed here. The site owner can upload their resume as an image in Edit Mode.
          </p>
        </div>
      )}
    </div>
  </div>
);

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "model"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));
      history.push({ role: "user", parts: [{ text: userMsg }] });

      const resp = await getAssistantResponse(history);
      setMessages((prev) => [...prev, { role: "model", text: resp }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "I'm having trouble connecting right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-stone-50 shadow-2xl border border-stone-200 flex flex-col rounded-sm"
          >
            <div className="p-4 bg-stone-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-camel" />
                <span className="font-serif font-bold text-xs uppercase tracking-widest">
                  Research Assistant
                </span>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Library className="w-8 h-8 mx-auto text-stone-200 mb-2" />
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                    Ask me about Danielle's work
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-xs leading-relaxed max-w-[90%] p-3 rounded-sm",
                    m.role === "user"
                      ? "ml-auto bg-camel text-stone-900"
                      : "bg-stone-50 border border-stone-100 text-stone-700",
                  )}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ))}
              {loading && (
                <div className="text-[10px] text-stone-400 font-bold animate-pulse uppercase tracking-widest">
                  AI Thinking...
                </div>
              )}
            </div>
            <div className="p-3 border-t border-stone-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about a research paper..."
                className="flex-1 text-xs p-2 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-camel rounded-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-stone-900 text-white p-2 rounded-sm"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-stone-900 shadow-xl rounded-full flex items-center justify-center text-white hover:bg-stone-800 transition-all border border-camel/20 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default function App() {
  const [currentTab, setCurrentTab] = useState("Home");
  const [darkMode, setDarkMode] = useState(false);
  const [customImages, setCustomImages] = useState<Record<string, string>>(
    () => {
      try {
        const saved = localStorage.getItem("duran_portfolio_media");
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    },
  );

  const [customPdfs, setCustomPdfs] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("duran_portfolio_pdfs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const isEditMode =
    new URLSearchParams(window.location.search).get("edit") === "true";

  useEffect(() => {
    try {
      localStorage.setItem(
        "duran_portfolio_media",
        JSON.stringify(customImages),
      );
    } catch {
      // Ignore
    }
  }, [customImages]);

  useEffect(() => {
    try {
      localStorage.setItem("duran_portfolio_pdfs", JSON.stringify(customPdfs));
    } catch {
      // Ignore
    }
  }, [customPdfs]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    artifactId: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImages((prev) => ({
          ...prev,
          [artifactId]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    artifactId: string,
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPdfs((prev) => ({
          ...prev,
          [artifactId]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 selection:bg-camel/30",
        darkMode
          ? "dark bg-stone-950 text-stone-200"
          : "bg-stone-50 text-stone-900",
      )}
    >
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.3 }}
          >
            {currentTab === "Home" && (
              <HomePage
                setCurrentTab={setCurrentTab}
                customImages={customImages}
                isEditMode={isEditMode}
                handleFileUpload={handleFileUpload}
              />
            )}
            {currentTab === "Portfolio" && (
              <PortfolioPage
                customImages={customImages}
                setCustomImages={setCustomImages}
                customPdfs={customPdfs}
                handlePdfUpload={handlePdfUpload}
                isEditMode={isEditMode}
                handleFileUpload={handleFileUpload}
              />
            )}
            {currentTab === "Reflection Paper" && <ReflectionPaperPage />}
            {currentTab === "Resume" && (
              <ResumePage customImages={customImages} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Assistant />

      <footer className="py-12 border-t border-stone-200 bg-stone-100 dark:bg-stone-900 dark:border-stone-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            © {new Date().getFullYear()} Danielle Duran | Sociology Portfolio
          </p>
          <div className="flex gap-4">
            <Library className="w-4 h-4 text-stone-300" />
            <Scale className="w-4 h-4 text-stone-300" />
            <Pen className="w-4 h-4 text-stone-300" />
          </div>
        </div>
      </footer>
    </div>
  );
}
