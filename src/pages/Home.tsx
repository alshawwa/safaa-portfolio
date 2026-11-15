import { motion } from "framer-motion";
import { Download } from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpLeft,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Mail,
  Palette,
  PenTool,
  Layers,
  Sparkles,
  Menu,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Facebook,
  Twitter,
  Dribbble,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "";

interface Profile {
  id: number;
  name: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  bio?: string;
  bio_ar?: string;
  bio_en?: string;
  profile_image?: string;
  email?: string;
  phone?: string;
  location?: string;
  cv_file?: string;
}

interface ProjectCategory {
  id: number;
  name: string;
}

interface Project {
  id: number;
  title: string;
  title_ar?: string;
  title_en?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  cover_image?: string;
  cover_image_url?: string;
  image_url?: string;
  categories?: ProjectCategory[];
  is_featured?: boolean;
}

interface Service {
  id: number;
  title: string;
  title_ar?: string;
  title_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  sort_order?: number;
}

interface Skill {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  percentage?: number;
  proficiency?: number;
  sort_order?: number;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  sort_order?: number;
  is_active?: boolean;
}

interface SiteSettings {
  site_name?: string;
  site_name_ar?: string;
  site_name_en?: string;
  tagline?: string;
  tagline_ar?: string;
  tagline_en?: string;
  email?: string;
  phone?: string;
  location?: string;
  location_ar?: string;
  location_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  default_language?: string;
  is_published?: string | boolean;
}

const serviceIcons: Record<string, LucideIcon> = {
  palette: Palette,
  brand: Palette,
  brandidentity: Palette,
  pentool: PenTool,
  pen: PenTool,
  graphicdesign: PenTool,
  layers: Layers,
  socialmedia: Layers,
};

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  dribbble: Dribbble,
  email: Mail,
  website: Globe,
  web: Globe,
};

export function Home() {
  const { language, toggleLanguage, dir } = useLanguage();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});

  const [projectsLoading, setProjectsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "success" | "error" | ""
  >("");
  const [formError, setFormError] = useState("");

  const isAr = language === "ar";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch(
          `${API_URL}/api/profile`
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.data || profileData);
        }
      } catch (error) {
        console.error("Profile error:", error);
      }

      try {
        const projectsResponse = await fetch(
          `${API_URL}/api/projects`
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        setProjects(
          Array.isArray(projectsData) ? projectsData : []
        );
      } catch (error) {
        console.error("Projects error:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }

      try {
        const servicesResponse = await fetch(
          `${API_URL}/api/services`
        );

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services");
        }

        const servicesData = await servicesResponse.json();
        setServices(
          Array.isArray(servicesData) ? servicesData : []
        );
      } catch (error) {
        console.error("Services error:", error);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }

      try {
        const skillsResponse = await fetch(
          `${API_URL}/api/skills`
        );

        if (!skillsResponse.ok) {
          throw new Error("Failed to fetch skills");
        }

        const skillsData = await skillsResponse.json();
        setSkills(
          Array.isArray(skillsData) ? skillsData : []
        );
      } catch (error) {
        console.error("Skills error:", error);
        setSkills([]);
      } finally {
        setSkillsLoading(false);
      }

      try {
        const socialResponse = await fetch(
          `${API_URL}/api/social-links`
        );

        if (!socialResponse.ok) {
          throw new Error("Failed to fetch social links");
        }

        const socialData = await socialResponse.json();
        setSocialLinks(
          Array.isArray(socialData) ? socialData : []
        );
      } catch (error) {
        console.error("Social links error:", error);
        setSocialLinks([]);
      }

      try {
        const settingsResponse = await fetch(
          `${API_URL}/api/settings`
        );

        if (!settingsResponse.ok) {
          throw new Error("Failed to fetch settings");
        }

        const settingsData = await settingsResponse.json();
        setSettings(settingsData || {});
      } catch (error) {
        console.error("Settings error:", error);
      }
    };

    fetchData();
  }, []);

  // بيانات صفاء حسب اللغة
  const profileTitle = isAr
    ? profile?.title_ar || profile?.title || ""
    : profile?.title_en || profile?.title || "";

  const profileBio = isAr
    ? profile?.bio_ar || profile?.bio || ""
    : profile?.bio_en || profile?.bio || "";

  // إعدادات الموقع حسب اللغة
  const siteName = isAr
    ? settings.site_name_ar ||
    settings.site_name ||
    settings.site_name_en ||
    "صفاء"
    : settings.site_name_en ||
    settings.site_name ||
    settings.site_name_ar ||
    "Safaa";

  const siteDescription = isAr
    ? settings.description_ar ||
    settings.description ||
    settings.description_en ||
    ""
    : settings.description_en ||
    settings.description ||
    settings.description_ar ||
    "";

  const siteTagline = isAr
    ? settings.tagline_ar ||
    settings.tagline ||
    settings.tagline_en ||
    ""
    : settings.tagline_en ||
    settings.tagline ||
    settings.tagline_ar ||
    "";

  const text = {
    home: isAr ? "الرئيسية" : "Home",
    works: isAr ? "أعمالي" : "My Works",
    services: isAr ? "خدماتي" : "Services",
    skills: isAr ? "مهاراتي" : "Skills",
    contact: isAr ? "تواصلي معي" : "Contact Me",

    greeting: isAr
      ? `مرحباً، أنا ${profile?.name || "صفاء"}`
      : `HELLO, I'M ${(profile?.name || "SAFAA").toUpperCase()}`,

    title:
      profileTitle ||
      (isAr
        ? "أصنع تصاميم تحوّل الأفكار إلى تجارب بصرية."
        : "I create designs that turn ideas into visual experiences."),

    intro:
      profileBio ||
      siteDescription ||
      (isAr
        ? "مصممة جرافيك شغوفة بالتفاصيل، أؤمن أن التصميم الجميل يبدأ بفكرة واضحة وينتهي بتجربة لا تُنسى."
        : "A passionate graphic designer who believes great design starts with a clear idea and ends with an unforgettable experience."),

    explore: isAr ? "استكشفي أعمالي" : "Explore My Work",

    aboutTitle: isAr
      ? "أكثر من مجرد تصميم"
      : "More than just design",

    about:
      profileBio ||
      siteDescription ||
      (isAr
        ? "أعمل على تحويل الأفكار إلى تصاميم بصرية تجمع بين الإبداع والوضوح والاهتمام بالتفاصيل."
        : "I transform ideas into visual designs that combine creativity, clarity, and attention to detail."),

    aboutLabel: isAr ? "نبذة عني" : "ABOUT ME",

    selected: isAr ? "أعمال مختارة" : "SELECTED WORK",
    workTitle: isAr ? "بعض من أعمالي" : "A glimpse of my work",

    workDescription: isAr
      ? "مجموعة من المشاريع الإبداعية"
      : "A collection of creative projects",

    serviceLabel: isAr ? "خدماتي" : "SERVICES",

    serviceTitle: isAr ? "ماذا أقدم؟" : "What I do",

    serviceIntro: isAr
      ? "أحوّل الأفكار إلى حلول بصرية مدروسة."
      : "Turning ideas into thoughtful visual solutions.",

    skillsLabel: isAr ? "مهاراتي" : "MY SKILLS",

    skillsTitle: isAr ? "أدواتي ومهاراتي" : "Skills & Tools",

    skillsIntro: isAr
      ? "أجمع بين الحس الإبداعي والأدوات التي تساعدني على تنفيذ أفكاري."
      : "Combining creative thinking with the tools that bring my ideas to life.",

    contactTitle: isAr
      ? "لنعمل معاً!"
      : "Let's create together!",

    contactIntro: isAr
      ? "لديك فكرة أو مشروع؟ يسعدني أن نبدأ الحديث."
      : "Have an idea or project in mind? I'd love to hear about it.",

    name: isAr ? "الاسم" : "Name",
    email: isAr ? "البريد الإلكتروني" : "Email Address",
    subject: isAr ? "الموضوع" : "Subject",
    message: isAr ? "رسالتك" : "Your Message",

    namePlaceholder: isAr ? "اكتب اسمك" : "Enter your name",

    emailPlaceholder: isAr
      ? "name@example.com"
      : "Enter your email",

    subjectPlaceholder: isAr
      ? "موضوع الرسالة"
      : "What is this about?",

    messagePlaceholder: isAr
      ? "اكتب تفاصيل فكرتك أو مشروعك هنا..."
      : "Tell me about your idea or project...",

    send: isAr ? "إرسال الرسالة" : "Send Message",
    sending: isAr ? "جاري الإرسال..." : "Sending...",

    downloadCV: isAr ? "تحميل السيرة الذاتية" : "Download CV",

    success: isAr
      ? "تم إرسال رسالتك بنجاح! شكراً لتواصلك معي."
      : "Your message has been sent successfully. Thank you!",

    error: isAr
      ? "تعذر إرسال الرسالة. حاول مرة أخرى."
      : "Something went wrong. Please try again.",

    noProjects: isAr
      ? "لا توجد مشاريع منشورة حتى الآن."
      : "No published projects yet.",

    noServices: isAr
      ? "لا توجد خدمات مضافة حتى الآن."
      : "No services added yet.",

    noSkills: isAr
      ? "لا توجد مهارات مضافة حتى الآن."
      : "No skills added yet.",

    loading: isAr ? "جاري التحميل..." : "Loading...",

    available: isAr
      ? "متاحة للمشاريع الجديدة"
      : "Available for projects",

    login: isAr ? "دخول" : "Login",

    creative: isAr
      ? "مبدعة • شغوفة • أهتم بالتفاصيل"
      : "Creative • Passionate • Detail-oriented",

    copyright: isAr
      ? "جميع الحقوق محفوظة."
      : "All rights reserved.",

    backToTop: isAr
      ? "العودة للأعلى ↑"
      : "Back to top ↑",
  };

  const Arrow = isAr ? ArrowUpLeft : ArrowUpRight;

  const getStorageUrl = (path?: string) => {
    if (!path) return null;

    if (path.startsWith("http")) {
      return path;
    }

    const cleanPath = path.replace(/^\/+/, "");

    if (cleanPath.startsWith("storage/")) {
      return `${API_URL}/${cleanPath}`;
    }

    return `${API_URL}/storage/${cleanPath}`;
  };

  const getProjectImage = (project: Project) => {
    const image =
      project.cover_image_url ||
      project.image_url ||
      project.cover_image;

    return getStorageUrl(image);
  };

  const getServiceIcon = (
    iconName?: string
  ): LucideIcon => {
    if (!iconName) return Palette;

    const normalizedName = iconName
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    return serviceIcons[normalizedName] || Palette;
  };

  const getSocialIcon = (
    platform: string
  ): LucideIcon => {
    const normalizedPlatform = platform
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    return socialIcons[normalizedPlatform] || Globe;
  };

  const getSocialUrl = (social: SocialLink) => {
    if (social.platform.toLowerCase() === "email") {
      return social.url.startsWith("mailto:")
        ? social.url
        : `mailto:${social.url}`;
    }

    return social.url;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formStatus) {
      setFormStatus("");
      setFormError("");
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSending(true);
    setFormStatus("");
    setFormError("");

    try {
      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          throw new Error(text.error);
        }

        throw new Error(data.message || text.error);
      }

      setFormStatus("success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setFormStatus("error");
      setFormError(
        error instanceof Error ? error.message : text.error
      );
    } finally {
      setIsSending(false);
    }
  };

  const profileImage =
    getStorageUrl(profile?.profile_image) ||
    "/images/safaa.jpg";

  const displayName = profile?.name || siteName;

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#EADFE7]/70 bg-[#FFF7F0]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <a
            href="#home"
            className="text-2xl font-bold tracking-tight text-[#302630]"
          >
            {siteName}
            <span className="text-[#9878E8]">.</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            <a
              href="#home"
              className="text-sm text-[#746673] transition hover:text-[#9878E8]"
            >
              {text.home}
            </a>

            <a
              href="#works"
              className="text-sm text-[#746673] transition hover:text-[#9878E8]"
            >
              {text.works}
            </a>

            <a
              href="#services"
              className="text-sm text-[#746673] transition hover:text-[#9878E8]"
            >
              {text.services}
            </a>

            <a
              href="#skills"
              className="text-sm text-[#746673] transition hover:text-[#9878E8]"
            >
              {text.skills}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="rounded-full border border-[#EADFE7] px-4 py-2 text-xs font-semibold text-[#302630] transition hover:bg-white"
            >
              {isAr ? "EN" : "عربي"}
            </button>

            <Link
              to="/admin/login"
              className="rounded-full border border-[#EADFE7] bg-white px-4 py-2 text-xs font-semibold text-[#302630] transition hover:border-[#9878E8] hover:text-[#9878E8]"
            >
              {text.login}
            </Link>

            <a
              href="#contact"
              className="hidden rounded-full bg-[#9878E8] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#8564D6] sm:block"
            >
              {text.contact}
            </a>

            <a
              href="#contact"
              className="md:hidden"
              aria-label={text.contact}
            >
              <Menu size={22} />
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-10 lg:pb-32 lg:pt-28"
        >
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#EADFE7] bg-white/70 px-4 py-2 text-xs font-medium text-[#746673]">
                <Sparkles
                  size={14}
                  className="text-[#9878E8]"
                />
                {text.greeting}
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.3] tracking-tight text-[#302630] sm:text-5xl lg:text-6xl">
                {text.title}
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#746673] sm:text-lg">
                {text.intro}
              </p>

              {siteTagline && (
                <p className="mt-3 text-sm text-[#9878E8]">
                  {siteTagline}
                </p>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#works"
                  className="inline-flex items-center gap-3 rounded-full bg-[#9878E8] px-7 py-4 text-sm font-medium text-white shadow-lg shadow-purple-200/50 transition hover:-translate-y-1"
                >
                  {text.explore}
                  <Arrow size={17} />
                </a>

                <a
                  href="#about"
                  className="rounded-full border border-[#EADFE7] px-7 py-4 text-sm font-medium text-[#302630] transition hover:bg-white"
                >
                  {text.aboutTitle}
                </a>
              </div>

              <div className="mt-14 flex flex-wrap items-center gap-5 text-[#746673]">
                {socialLinks
                  .filter((social) => social.is_active !== false)
                  .map((social) => {
                    const Icon = getSocialIcon(social.platform);

                    return (
                      <a
                        key={social.id}
                        href={getSocialUrl(social)}
                        target={
                          social.platform.toLowerCase() === "email"
                            ? undefined
                            : "_blank"
                        }
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="transition hover:text-[#9878E8]"
                      >
                        <Icon size={19} />
                      </a>
                    );
                  })}

                {settings.email &&
                  !socialLinks.some(
                    (social) =>
                      social.platform.toLowerCase() === "email"
                  ) && (
                    <a
                      href={`mailto:${settings.email}`}
                      aria-label={isAr ? "البريد الإلكتروني" : "Email"}
                      className="transition hover:text-[#9878E8]"
                    >
                      <Mail size={19} />
                    </a>
                  )}

                <span className="h-px w-12 bg-[#EADFE7]" />

                <span className="text-xs">
                  {text.available}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-[#F3A6C8]/35 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#9878E8]/25 blur-3xl" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-[10px] border-white bg-white shadow-2xl shadow-[#302630]/10">
                <img
                  src={profileImage}
                  alt={
                    isAr
                      ? `${displayName} - مصممة جرافيك`
                      : `${displayName} - Creative Designer`
                  }
                  className="h-full w-full object-cover object-center"
                />

                <div className="absolute bottom-5 left-5 rounded-full border border-white/60 bg-white/30 px-4 py-2 text-xs text-white backdrop-blur-md">
                  {text.creative}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="border-y border-[#EADFE7]/70 bg-white/45 py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:px-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-[#9878E8]">
                01 / {text.aboutLabel}
              </p>

              <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight text-[#302630] sm:text-5xl">
                {text.aboutTitle}
              </h2>
            </div>

            <div className="flex flex-col items-start gap-6">
              <p className="max-w-xl text-lg leading-9 text-[#746673]">
                {text.about}
              </p>

              {profile?.cv_file && getStorageUrl(profile.cv_file) && (
                <a
                  href={getStorageUrl(profile.cv_file) ?? undefined}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#9878E8] px-6 py-3 text-white font-medium hover:bg-[#8665D5] transition-all"
                >
                  <Download size={18} />
                  {text.downloadCV}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Works */}
        <section
          id="works"
          className="mx-auto max-w-7xl px-5 py-24 lg:px-10"
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-[#9878E8]">
            02 / {text.selected}
          </p>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <h2 className="text-4xl font-semibold text-[#302630] sm:text-5xl">
              {text.workTitle}
            </h2>

            <span className="text-sm text-[#746673]">
              {text.workDescription}
            </span>
          </div>

          {projectsLoading ? (
            <p className="mt-12 text-center text-[#746673]">
              {text.loading}
            </p>
          ) : projects.length === 0 ? (
            <p className="mt-12 text-center text-[#746673]">
              {text.noProjects}
            </p>
          ) : (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const image = getProjectImage(project);

                const projectTitle = isAr
                  ? project.title_ar || project.title
                  : project.title_en || project.title;

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    className="block"
                  >
                    <motion.article
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#F3A6C8]/20">
                        {image ? (
                          <img
                            src={image}
                            alt={projectTitle}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#9878E8]">
                            <Palette size={60} />
                          </div>
                        )}

                        <span className="absolute left-5 top-5 rounded-full bg-white/80 px-4 py-2 text-xs text-[#302630] backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#302630] transition group-hover:rotate-45">
                          <Arrow size={20} />
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3 pt-5">
                        <div>
                          <h3 className="text-xl font-semibold text-[#302630]">
                            {projectTitle}
                          </h3>

                          <p className="mt-1 text-sm text-[#746673]">
                            {project.categories
                              ?.map((category) => category.name)
                              .join(" • ") ||
                              (isAr
                                ? "تصميم إبداعي"
                                : "Creative Design")}
                          </p>
                        </div>

                        <span className="text-xs text-[#9878E8]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Services */}
        <section
          id="services"
          className="bg-[#F3A6C8]/15 py-24"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#9878E8]">
              03 / {text.serviceLabel}
            </p>

            <h2 className="mt-5 text-4xl font-semibold text-[#302630] sm:text-5xl">
              {text.serviceTitle}
            </h2>

            <p className="mt-4 text-[#746673]">
              {text.serviceIntro}
            </p>

            {servicesLoading ? (
              <p className="mt-12 text-center text-[#746673]">
                {text.loading}
              </p>
            ) : services.length === 0 ? (
              <p className="mt-12 text-center text-[#746673]">
                {text.noServices}
              </p>
            ) : (
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {services.map((service, index) => {
                  const Icon = getServiceIcon(service.icon);

                  const serviceTitle = isAr
                    ? service.title_ar || service.title
                    : service.title_en || service.title;

                  const serviceDescription = isAr
                    ? service.description_ar ||
                    service.description ||
                    ""
                    : service.description_en ||
                    service.description ||
                    "";

                  return (
                    <motion.div
                      key={service.id}
                      whileHover={{ y: -7 }}
                      className="rounded-3xl border border-white bg-white/80 p-8 shadow-sm"
                    >
                      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9878E8]/10 text-[#9878E8]">
                        <Icon size={26} />
                      </div>

                      <span className="text-xs text-[#9878E8]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="mt-3 text-xl font-semibold text-[#302630]">
                        {serviceTitle}
                      </h3>

                      {serviceDescription && (
                        <p className="mt-3 leading-7 text-[#746673]">
                          {serviceDescription}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        <section
          id="skills"
          className="mx-auto max-w-7xl px-5 py-24 lg:px-10"
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-[#9878E8]">
            04 / {text.skillsLabel}
          </p>

          <h2 className="mt-5 text-4xl font-semibold text-[#302630] sm:text-5xl">
            {text.skillsTitle}
          </h2>

          <p className="mt-4 text-[#746673]">
            {text.skillsIntro}
          </p>

          {skillsLoading ? (
            <p className="mt-10 text-center text-[#746673]">
              {text.loading}
            </p>
          ) : skills.length === 0 ? (
            <p className="mt-10 text-center text-[#746673]">
              {text.noSkills}
            </p>
          ) : (
            <div className="mt-10 flex flex-wrap gap-3">
              {skills.map((skill) => {
                const skillName = isAr
                  ? skill.name_ar || skill.name
                  : skill.name_en || skill.name;

                return (
                  <span
                    key={skill.id}
                    className="rounded-full border border-[#EADFE7] bg-white/70 px-6 py-3 text-sm text-[#302630] transition hover:border-[#9878E8] hover:text-[#9878E8]"
                  >
                    {skillName}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="px-5 pb-24 lg:px-10"
        >
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#302630] px-7 py-16 sm:px-14">
            <div className="mx-auto max-w-2xl">
              <Sparkles
                className="mb-6 text-[#F3A6C8]"
                size={30}
              />

              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {text.contactTitle}
              </h2>

              <p className="mt-6 text-base leading-8 text-white/65">
                {text.contactIntro}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-white/90"
                  >
                    {text.name}
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={text.namePlaceholder}
                    required
                    maxLength={255}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/40 transition focus:border-[#F3A6C8] focus:ring-2 focus:ring-[#F3A6C8]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-white/90"
                  >
                    {text.email}
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={text.emailPlaceholder}
                    required
                    maxLength={255}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/40 transition focus:border-[#F3A6C8] focus:ring-2 focus:ring-[#F3A6C8]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-medium text-white/90"
                  >
                    {text.subject}
                  </label>

                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={text.subjectPlaceholder}
                    maxLength={255}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/40 transition focus:border-[#F3A6C8] focus:ring-2 focus:ring-[#F3A6C8]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-white/90"
                  >
                    {text.message}
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={text.messagePlaceholder}
                    required
                    rows={5}
                    className="w-full resize-y rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/40 transition focus:border-[#F3A6C8] focus:ring-2 focus:ring-[#F3A6C8]/20"
                  />
                </div>

                {formStatus === "success" && (
                  <div
                    role="status"
                    className="flex items-center gap-3 rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-200"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0"
                    />
                    {text.success}
                  </div>
                )}

                {formStatus === "error" && (
                  <div
                    role="alert"
                    className="flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
                  >
                    <AlertCircle
                      size={20}
                      className="shrink-0"
                    />
                    {formError || text.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#F3A6C8] px-8 py-4 text-sm font-semibold text-[#302630] transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSending ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      {text.sending}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {text.send}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EADFE7] px-5 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <a
            href="#home"
            className="text-xl font-bold text-[#302630]"
          >
            {siteName}
            <span className="text-[#9878E8]">.</span>
          </a>

          <p className="text-xs text-[#746673]">
            © {new Date().getFullYear()} {displayName}.{" "}
            {text.copyright}
          </p>

          <a
            href="#home"
            className="text-xs text-[#746673] transition hover:text-[#9878E8]"
          >
            {text.backToTop}
          </a>
        </div>
      </footer>
    </div>
  );
}
