import Navbar from "@/components/layout/Navbar";

export default function CareersPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <section className="flex-1 min-h-0 w-full">
        <iframe
          src="https://job.thasan.org/"
          title="Thasan Jobs"
          className="block h-full min-h-[calc(100vh-4rem)] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  );
}
