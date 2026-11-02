// A simplified architectural illustration of EtenMall. It is labelled as an
// illustration (not a screenshot) and names no infrastructure identifiers.

const people = [
  {
    name: "Retailers and staff",
    note: "Dashboard: catalog, branches, inventory, orders, staff",
  },
  {
    name: "Customers",
    note: "Branded storefront on the retailer’s own address, guest checkout",
  },
  {
    name: "Platform operator",
    note: "Merchant oversight, payment holds, reconciliation",
  },
];

const layers = [
  { name: "Request proxy", note: "Resolves the storefront address to one tenant" },
  { name: "Routes and server actions", note: "Never query the database directly" },
  { name: "Services", note: "Business rules; work on a typed tenant context" },
  { name: "Repositories", note: "The only layer that holds a database client" },
];

const data = [
  { name: "Supabase Auth", note: "Staff and operator sign-in, sessions" },
  {
    name: "PostgreSQL",
    note: "Tenant-scoped tables, row-level security, privileged functions, atomic audit log",
  },
  { name: "Storage", note: "Tenant-scoped upload paths for branding and images" },
  { name: "Payment provider", note: "Stub by default; Paynow adapter in test mode" },
  { name: "Redis rate limiting", note: "Shared login rate limits" },
];

function Column({
  title,
  items,
  accent = false,
}: {
  title: string;
  items: { name: string; note: string }[];
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.name}
            className={`rounded-xl border px-4 py-3 ${
              accent
                ? "border-[color:rgba(120,224,156,0.4)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] bg-[var(--surface-elevated)]"
            }`}
          >
            <p className="text-sm font-medium text-[var(--text)]">{item.name}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center text-xl text-[var(--accent)] opacity-60 max-lg:rotate-90"
    >
      →
    </span>
  );
}

export function EtenMallArchitecture() {
  return (
    <figure className="mt-8" aria-labelledby="etenmall-architecture-caption">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.1fr_auto_1.2fr] lg:gap-5">
          <Column title="People" items={people} />
          <Arrow />
          <Column title="Application layer (Next.js)" items={layers} accent />
          <Arrow />
          <Column title="Data and services" items={data} />
        </div>
      </div>
      <figcaption
        id="etenmall-architecture-caption"
        className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]"
      >
        Architectural illustration, simplified from the project’s own design
        records. It is not a product screenshot, and it omits infrastructure
        identifiers and security configuration on purpose.
      </figcaption>
    </figure>
  );
}
