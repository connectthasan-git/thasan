"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Plus, PlayCircle, IndianRupee } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { communityService } from "@/features/community/communityService";
import { freelancerService } from "@/features/freelancers/freelancerService";
import { CommunityCourse, CommunityCoursePurchase, CommunityGroup } from "@/types/community";

const emptyModule = { title: "", youtubeUrl: "" };

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const normalized = url.trim();
    const match = normalized.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/i);
    if (!match) return "";
    return `https://www.youtube.com/embed/${match[1]}`;
  } catch {
    return "";
  }
};

export default function CommunityGroupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [group, setGroup] = useState<CommunityGroup | null>(null);
  const [courses, setCourses] = useState<CommunityCourse[]>([]);
  const [purchases, setPurchases] = useState<CommunityCoursePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    isPaid: false,
    price: "",
    currency: "INR",
  });
  const [modules, setModules] = useState([{ ...emptyModule }]);

  const fetchData = async () => {
    try {
      const [groupData, courseData] = await Promise.all([
        communityService.getGroup(id),
        communityService.getCoursesByGroup(id),
      ]);
      setGroup(groupData);
      setCourses(courseData);
      if (user) {
        const purchaseData = await communityService.getPurchasesByUser(user.uid);
        setPurchases(purchaseData);
      }
    } catch {
      setGroup(null);
      setCourses([]);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const cleanedModules = useMemo(() => {
    return modules
      .map((module) => ({
        title: module.title.trim(),
        youtubeUrl: module.youtubeUrl.trim(),
      }))
      .filter((module) => module.title && module.youtubeUrl);
  }, [modules]);

  const handleAddModule = () => {
    setModules((prev) => [...prev, { ...emptyModule }]);
  };

  const handleRemoveModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCourse = async () => {
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/community/groups/${id}`)}`);
      return;
    }
    if (group && group.createdBy !== user.uid) {
      setError("Only the community owner can publish courses.");
      return;
    }
    if (!form.title || !form.description) {
      setError("Course title and description are required.");
      return;
    }
    if (cleanedModules.length === 0) {
      setError("Please add at least one YouTube module.");
      return;
    }
    if (form.isPaid && (!form.price || Number(form.price) <= 0)) {
      setError("Please enter a valid price for paid courses.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await communityService.createCourse({
        groupId: id,
        title: form.title.trim(),
        description: form.description.trim(),
        isPaid: form.isPaid,
        // Firestore does not allow undefined values; use 0 for free courses
        price: form.isPaid ? Number(form.price) : 0,
        currency: form.isPaid ? form.currency : "INR",
        instructorId: user.uid,
        instructorName: profile?.name || "",
        // Courses are immediately active; no separate admin approval
        status: "approved",
        modules: cleanedModules,
      });
      setForm({ title: "", description: "", isPaid: false, price: "", currency: "INR" });
      setModules([{ ...emptyModule }]);
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      // Surface the actual error message to help with debugging permissions issues
      // such as Firestore rule failures.
      // eslint-disable-next-line no-console
      console.error("Failed to publish community course", err);
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(`Unable to publish course: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!group || group.status !== "approved") {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Community not available</h1>
          <p className="text-gray-500 mt-2">This community is pending approval or has been removed.</p>
          <Button className="mt-6" onClick={() => router.push("/community")}>Back to Community</Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === group.createdBy;
  const approvedCourses = courses.filter((course) => course.status === "approved");
  const visibleCourses = isOwner ? courses : approvedCourses;
  const purchasedCourseIds = new Set(purchases.map((purchase) => purchase.courseId));

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-sdk")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyCourse = async (course: CommunityCourse) => {
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/community/groups/${id}`)}`);
      return;
    }
    if (!course.price) return;
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Unable to load payment gateway. Please try again.");
      return;
    }

    try {
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: course.price, currency: course.currency || "INR", receipt: course.id }),
      });

      if (!orderResponse.ok) {
        throw new Error("Order creation failed");
      }

      const order = await orderResponse.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: group.name,
        description: course.title,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string }) => {
          await communityService.createPurchase({
            courseId: course.id,
            groupId: course.groupId,
            userId: user.uid,
            amount: course.price || 0,
            currency: course.currency || "INR",
            status: "completed",
            paymentProvider: "razorpay",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });
          await freelancerService.createPayment({
            userId: user.uid,
            communityCourseId: course.id,
            amount: course.price || 0,
            type: "community-course",
            status: "completed",
            gateway: "razorpay",
            transactionId: response.razorpay_payment_id,
            createdAt: new Date().toISOString(),
          });
          const purchaseData = await communityService.getPurchasesByUser(user.uid);
          setPurchases(purchaseData);
        },
        prefill: {
          name: profile?.name || "",
          email: profile?.email || "",
        },
        theme: { color: "#16a34a" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch {
      setError("Unable to start checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <section className="max-w-none mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-gray-500 mt-2">{group.description}</p>
            </div>
            {isOwner && (
              <Button onClick={() => setModalOpen(true)} className="rounded-2xl">
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleCourses.length > 0 ? (
            visibleCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">by {course.instructorName || "Community Instructor"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && course.status !== "approved" && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {course.status}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.isPaid ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                      {course.isPaid ? "Paid" : "Free"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{course.description}</p>
                {course.isPaid && (
                  <div className="mt-3 text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" /> {course.price?.toLocaleString("en-IN")}
                  </div>
                )}
                {course.status !== "approved" ? (
                  <p className="text-xs text-amber-600 mt-4">Awaiting admin approval.</p>
                ) : course.isPaid && !purchasedCourseIds.has(course.id) ? (
                  <div className="mt-4">
                    <Button onClick={() => handleBuyCourse(course)} className="w-full">
                      Buy Course
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">Access unlocked after payment.</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {course.modules.map((module, i) => {
                      const embedUrl = getYouTubeEmbedUrl(module.youtubeUrl);
                      return (
                        <div key={`${course.id}-module-${i}`} className="rounded-2xl border border-gray-100 p-4 bg-gray-50/60">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                              <PlayCircle className="w-4 h-4" /> {module.title}
                            </p>
                            <a
                              href={module.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                              Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          {embedUrl ? (
                            <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingTop: "56.25%" }}>
                              <iframe
                                src={embedUrl}
                                className="absolute inset-0 h-full w-full"
                                title={module.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">Invalid YouTube link</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center col-span-full">
              <p className="text-gray-600 font-semibold">No courses yet</p>
              <p className="text-sm text-gray-500 mt-2">Be the first to upload a YouTube course for this community.</p>
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add YouTube Course"
        size="lg"
      >
        <div className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-2xl text-sm">
              {error}
            </div>
          )}
          <Input
            label="Course Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isPaid}
                onChange={(e) => setForm((prev) => ({ ...prev, isPaid: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Paid course
            </label>
            {form.isPaid && (
              <Input
                label="Price (INR)"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="999"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Modules (YouTube)</h4>
              <Button variant="ghost" onClick={handleAddModule}>
                <Plus className="w-4 h-4 mr-1" /> Add module
              </Button>
            </div>
            {modules.map((module, index) => (
              <div key={`module-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <Input
                  label="Module Title"
                  value={module.title}
                  onChange={(e) =>
                    setModules((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)),
                    )
                  }
                />
                <Input
                  label="YouTube URL"
                  value={module.youtubeUrl}
                  onChange={(e) =>
                    setModules((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, youtubeUrl: e.target.value } : item)),
                    )
                  }
                />
                {modules.length > 1 && (
                  <button
                    onClick={() => handleRemoveModule(index)}
                    className="px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleCreateCourse}>
              Publish Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
