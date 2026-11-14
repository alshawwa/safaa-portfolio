import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    ExternalLink,
    Loader2,
    Palette,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000";

interface ProjectCategory {
    id: number;
    name: string;
}

interface ProjectImage {
    id: number;
    image?: string;
    image_url?: string;
    alt_text?: string;
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
    client?: string;
    project_url?: string;
    cover_image_url?: string;
    images?: ProjectImage[];
    categories?: ProjectCategory[];
}

export function ProjectDetails() {
    const { slug } = useParams();
    const { language, dir } = useLanguage();
    const isAr = language === "ar";

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(
                    `${API_URL}/api/projects/${slug}`
                );

                if (!response.ok) {
                    throw new Error("Project not found");
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                console.error("Project details error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProject();
        }
    }, [slug]);

    const Arrow = isAr ? ArrowRight : ArrowLeft;

    if (loading) {
        return (
            <div
                dir={dir}
                className="flex min-h-screen items-center justify-center bg-[#FFF7F0]"
            >
                <div className="flex items-center gap-3 text-[#9878E8]">
                    <Loader2 size={25} className="animate-spin" />
                    <span>
                        {isAr ? "جاري تحميل المشروع..." : "Loading project..."}
                    </span>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div
                dir={dir}
                className="flex min-h-screen flex-col items-center justify-center bg-[#FFF7F0] px-5 text-center"
            >
                <Palette size={55} className="text-[#9878E8]" />

                <h1 className="mt-6 text-3xl font-semibold text-[#302630]">
                    {isAr ? "المشروع غير موجود" : "Project Not Found"}
                </h1>

                <p className="mt-3 text-[#746673]">
                    {isAr
                        ? "عذراً، لم نتمكن من العثور على هذا المشروع."
                        : "Sorry, we couldn't find this project."}
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#9878E8] px-6 py-3 text-white transition hover:bg-[#8665D5]"
                >
                    <Arrow size={18} />
                    {isAr ? "العودة للأعمال" : "Back to Portfolio"}
                </Link>
            </div>
        );
    }

    const projectTitle = isAr
        ? project.title_ar || project.title
        : project.title_en || project.title;

    const projectDescription = isAr
        ? project.description_ar || project.description
        : project.description_en || project.description;

    const gallery = (project.images || [])
        .filter((image) => image.image_url || image.image)
        .sort((a, b) => a.id - b.id);

    return (
        <div
            dir={dir}
            className="min-h-screen overflow-hidden bg-[#FFF7F0] text-[#302630]"
        >
            <header className="border-b border-[#EADFE7] bg-white/70">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight"
                    >
                        safaa<span className="text-[#9878E8]">.</span>
                    </Link>

                    <Link
                        to="/#works"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#746673] transition hover:text-[#9878E8]"
                    >
                        <Arrow size={18} />
                        {isAr ? "العودة للأعمال" : "Back to Works"}
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <p className="text-xs font-semibold tracking-[0.25em] text-[#9878E8]">
                        {isAr ? "تفاصيل المشروع" : "PROJECT DETAILS"}
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                        {projectTitle}
                    </h1>

                    {project.categories && project.categories.length > 0 && (
                        <div className="mt-7 flex flex-wrap gap-3">
                            {project.categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="rounded-full border border-[#EADFE7] bg-white px-5 py-2 text-sm text-[#746673]"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {project.cover_image_url && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="mt-12 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#302630]/5"
                    >
                        <img
                            src={project.cover_image_url}
                            alt={projectTitle}
                            className="max-h-[650px] w-full object-cover"
                        />
                    </motion.div>
                )}

                <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px]">
                    <section>
                        <h2 className="text-2xl font-semibold">
                            {isAr ? "عن المشروع" : "About the Project"}
                        </h2>

                        <p className="mt-6 whitespace-pre-line text-base leading-9 text-[#746673] sm:text-lg">
                            {projectDescription ||
                                (isAr
                                    ? "لا توجد تفاصيل إضافية لهذا المشروع."
                                    : "No additional details available for this project.")}
                        </p>
                    </section>

                    <aside className="h-fit rounded-3xl border border-[#EADFE7] bg-white p-7">
                        <h3 className="text-lg font-semibold">
                            {isAr ? "معلومات المشروع" : "Project Information"}
                        </h3>

                        {project.client && (
                            <div className="mt-6 border-b border-[#EADFE7] pb-5">
                                <p className="text-xs text-[#9878E8]">
                                    {isAr ? "العميل" : "Client"}
                                </p>
                                <p className="mt-2 font-medium">
                                    {project.client}
                                </p>
                            </div>
                        )}

                        {project.categories && project.categories.length > 0 && (
                            <div className="mt-5">
                                <p className="text-xs text-[#9878E8]">
                                    {isAr ? "التصنيفات" : "Categories"}
                                </p>
                                <p className="mt-2 leading-7 text-[#746673]">
                                    {project.categories
                                        .map((category) => category.name)
                                        .join("، ")}
                                </p>
                            </div>
                        )}

                        {project.project_url && (
                            <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#9878E8] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8665D5]"
                            >
                                {isAr ? "زيارة المشروع" : "Visit Project"}
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </aside>
                </div>

                {gallery.length > 0 && (
                    <section className="mt-24">
                        <p className="text-xs font-semibold tracking-[0.25em] text-[#9878E8]">
                            {isAr ? "معرض الصور" : "PROJECT GALLERY"}
                        </p>

                        <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
                            {isAr ? "معرض الصور" : "Project Gallery"}
                        </h2>

                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            {gallery.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    className="overflow-hidden rounded-3xl bg-white"
                                >
                                    <img
                                        src={image.image_url || image.image}
                                        alt={
                                            image.alt_text ||
                                            `${projectTitle} - ${index + 1}`
                                        }
                                        loading="lazy"
                                        className="w-full object-cover transition duration-700 hover:scale-[1.03]"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-20 text-center">
                    <Link
                        to="/#works"
                        className="inline-flex items-center gap-3 rounded-full border border-[#EADFE7] bg-white px-8 py-4 text-sm font-medium transition hover:border-[#9878E8] hover:text-[#9878E8]"
                    >
                        <Arrow size={18} />
                        {isAr ? "العودة إلى جميع الأعمال" : "Back to All Works"}
                    </Link>
                </div>
            </main>

            <footer className="border-t border-[#EADFE7] px-5 py-8 text-center text-xs text-[#746673]">
                © {new Date().getFullYear()} Safaa.{" "}
                {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </footer>
        </div>
    );
}
