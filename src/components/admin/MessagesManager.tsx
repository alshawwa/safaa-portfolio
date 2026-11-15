import { useEffect, useState } from "react";
import {
    Mail,
    MailOpen,
    Trash2,
    X,
    Loader2,
    RefreshCw,
    MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "/api";

interface Message {
    id: number;
    name: string;
    email: string;
    subject?: string;
    message: string;
    is_read?: boolean;
    created_at?: string;
}

export function MessagesManager() {
    const { language, dir } = useLanguage();
    const isAr = language === "ar";

    const text = {
        title: isAr ? "الرسائل" : "Messages",
        description: isAr
            ? "إدارة الرسائل الواردة من زوار موقعك."
            : "Manage messages received from your website visitors.",

        refresh: isAr ? "تحديث" : "Refresh",

        total: isAr ? "إجمالي الرسائل" : "Total Messages",
        unread: isAr ? "الرسائل غير المقروءة" : "Unread Messages",
        read: isAr ? "الرسائل المقروءة" : "Read Messages",

        inbox: isAr ? "صندوق الوارد" : "Inbox",

        noMessages: isAr
            ? "لا توجد رسائل حتى الآن"
            : "No messages yet",

        noMessagesDescription: isAr
            ? "ستظهر رسائل زوار موقعك هنا."
            : "Messages from your visitors will appear here.",

        new: isAr ? "جديد" : "New",
        noSubject: isAr ? "بدون موضوع" : "No subject",

        deleteTitle: isAr ? "حذف الرسالة" : "Delete message",

        messageDetails: isAr ? "تفاصيل الرسالة" : "Message Details",
        from: isAr ? "من" : "From",
        email: isAr ? "البريد الإلكتروني" : "Email",
        subject: isAr ? "الموضوع" : "Subject",
        message: isAr ? "الرسالة" : "Message",
        received: isAr ? "تم الاستلام" : "Received",
        close: isAr ? "إغلاق" : "Close",

        unauthorized: isAr
            ? "غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى."
            : "You are not authorized. Please log in again.",

        loadError: isAr
            ? "فشل تحميل الرسائل."
            : "Failed to load messages.",

        markReadError: isAr
            ? "تعذر تحديد الرسالة كمقروءة."
            : "Could not mark message as read.",

        deleteError: isAr
            ? "تعذر حذف الرسالة."
            : "Could not delete message.",

        generalError: isAr
            ? "حدث خطأ ما. حاول مرة أخرى."
            : "Something went wrong.",

        deleteConfirm: isAr
            ? "هل أنتِ متأكدة من حذف هذه الرسالة؟"
            : "Are you sure you want to delete this message?",
    };

    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] =
        useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getHeaders = () => {
        const token = localStorage.getItem("admin_token");

        return {
            Accept: "application/json",
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
        };
    };

    const formatDate = (date?: string) => {
        if (!date) return "";

        return new Date(date).toLocaleString(
            isAr ? "ar" : "en-US"
        );
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/admin/messages`,
                {
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(
                    response.status === 401 ||
                        response.status === 403
                        ? text.unauthorized
                        : text.loadError
                );
            }

            const data = await response.json();

            setMessages(
                Array.isArray(data)
                    ? data
                    : data.data || []
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : text.generalError
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const openMessage = async (message: Message) => {
        setSelectedMessage(message);

        if (message.is_read) return;

        try {
            const response = await fetch(
                `${API_URL}/admin/messages/${message.id}/read`,
                {
                    method: "PATCH",
                    headers: {
                        ...getHeaders(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        is_read: true,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(text.markReadError);
            }

            const updatedMessage = {
                ...message,
                is_read: true,
            };

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === message.id
                        ? updatedMessage
                        : item
                )
            );

            setSelectedMessage(updatedMessage);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : text.generalError
            );
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(text.deleteConfirm)) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/admin/messages/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(text.deleteError);
            }

            setMessages((previous) =>
                previous.filter(
                    (item) => item.id !== id
                )
            );

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : text.generalError
            );
        }
    };

    const unreadCount = messages.filter(
        (message) => !message.is_read
    ).length;

    return (
        <div
            dir={dir}
            className="space-y-6 text-[#302630]"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">
                        {text.title}
                    </h2>

                    <p className="mt-1 text-sm text-[#746673]">
                        {text.description}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchMessages}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#EADFE7] bg-white px-5 py-3 font-medium transition hover:bg-[#F3A6C8]/10 disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />
                    {text.refresh}
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label={text.close}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#EADFE7] bg-white p-5">
                    <p className="text-sm text-[#746673]">
                        {text.total}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        {messages.length}
                    </h3>
                </div>

                <div className="rounded-2xl border border-[#EADFE7] bg-white p-5">
                    <p className="text-sm text-[#746673]">
                        {text.unread}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#9878E8]">
                        {unreadCount}
                    </h3>
                </div>

                <div className="rounded-2xl border border-[#EADFE7] bg-white p-5">
                    <p className="text-sm text-[#746673]">
                        {text.read}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        {messages.length - unreadCount}
                    </h3>
                </div>
            </div>

            <div className="rounded-2xl border border-[#EADFE7] bg-white p-5 shadow-sm">
                <h3 className="mb-5 font-semibold">
                    {text.inbox}
                </h3>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2
                            className="animate-spin text-[#9878E8]"
                            size={28}
                        />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="py-14 text-center">
                        <MessageSquare
                            className="mx-auto mb-3 text-[#9878E8]"
                            size={36}
                        />

                        <h3 className="font-semibold">
                            {text.noMessages}
                        </h3>

                        <p className="mt-1 text-sm text-[#746673]">
                            {text.noMessagesDescription}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center ${message.is_read
                                    ? "border-[#EADFE7] bg-white"
                                    : "border-[#9878E8]/30 bg-[#9878E8]/5"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        openMessage(message)
                                    }
                                    className="flex min-w-0 flex-1 items-start gap-3 text-start"
                                >
                                    <div className="mt-1 rounded-xl bg-[#F3A6C8]/20 p-3 text-[#9878E8]">
                                        {message.is_read ? (
                                            <MailOpen size={19} />
                                        ) : (
                                            <Mail size={19} />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="font-semibold">
                                                {message.name}
                                            </h4>

                                            {!message.is_read && (
                                                <span className="rounded-full bg-[#9878E8]/10 px-2 py-1 text-xs text-[#9878E8]">
                                                    {text.new}
                                                </span>
                                            )}
                                        </div>

                                        <p
                                            dir="ltr"
                                            className="mt-1 text-start text-sm text-[#746673]"
                                        >
                                            {message.email}
                                        </p>

                                        <p className="mt-2 truncate text-sm font-medium">
                                            {message.subject ||
                                                text.noSubject}
                                        </p>

                                        <p className="mt-1 line-clamp-1 text-sm text-[#746673]">
                                            {message.message}
                                        </p>

                                        {message.created_at && (
                                            <p className="mt-2 text-xs text-[#746673]">
                                                {formatDate(
                                                    message.created_at
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(message.id)
                                    }
                                    className="self-end rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100 sm:self-center"
                                    title={text.deleteTitle}
                                    aria-label={text.deleteTitle}
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
                    <div className="my-auto w-full max-w-xl rounded-2xl bg-[#FFF7F0] p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold">
                                {text.messageDetails}
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                aria-label={text.close}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-[#746673]">
                                    {text.from}
                                </p>

                                <p className="mt-1 font-semibold">
                                    {selectedMessage.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#746673]">
                                    {text.email}
                                </p>

                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    dir="ltr"
                                    className="mt-1 block text-start text-[#9878E8] underline"
                                >
                                    {selectedMessage.email}
                                </a>
                            </div>

                            <div>
                                <p className="text-xs text-[#746673]">
                                    {text.subject}
                                </p>

                                <p className="mt-1 font-medium">
                                    {selectedMessage.subject ||
                                        text.noSubject}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#746673]">
                                    {text.message}
                                </p>

                                <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[#EADFE7] bg-white p-4 text-sm leading-7">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {selectedMessage.created_at && (
                                <p className="text-xs text-[#746673]">
                                    {text.received}:{" "}
                                    {formatDate(
                                        selectedMessage.created_at
                                    )}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="w-full rounded-xl bg-[#9878E8] px-4 py-3 font-medium text-white transition hover:opacity-90"
                            >
                                {text.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}