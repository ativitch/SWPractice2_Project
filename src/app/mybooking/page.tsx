import Banner from "@/components/Banner";

export default function HomePage() {
  return (
    <main className="bg-[#f8f5f1]">
      <Banner />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold text-stone-900">
            Designed for modern event planning
          </h2>
          <p className="mt-3 text-stone-600">
            Browse venues, compare spaces, and reserve with a cleaner and more
            elegant workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-stone-900">
              Refined venue selection
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              Explore thoughtfully presented spaces with essential details and
              a more focused browsing experience.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-stone-900">
              Smooth reservation flow
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              Make bookings through a cleaner interface that feels simpler and
              more reliable from start to confirmation.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-stone-900">
              Elegant event experience
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              A visual style that fits weddings, private gatherings, and formal
              occasions without looking too playful.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}