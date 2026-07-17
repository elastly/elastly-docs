export const ConnectorCards = ({ children }) => (
  <div className="mt-6 grid gap-4 sm:grid-cols-2">{children}</div>
)

// The snippet sandbox evaluates each exported component on its own, so module-scope bindings are
// not in scope at render time. Everything this component needs has to be declared inside it.
export const ConnectorCard = ({ provider, name, kind, href, summary, syncs = [], note }) => {
  const BRAND = "#0e8c6b"

  const logos = {
    netsuite: (
      <svg viewBox="0 0.2 150 150" width="100%" height="100%" fill="none" aria-hidden="true">
        <path
          d="M20.1 47.7h23.7V104h11.8v22H20.1zm109.7 51.8h-23.7V43.2H94.3v-22h35.5z"
          fill="#baccdb"
        />
        <path
          d="M14.6 15.8h74.9v64.3L60.7 43H14.6zm120.6 115.7H60.3V67.2l28.8 37.1h46.1"
          fill="#125580"
        />
      </svg>
    ),
    shopify: (
      <svg viewBox="0 0 108.44 122.88" width="100%" height="100%" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#95BF47"
          d="M94.98,23.66c-0.09-0.62-0.63-0.96-1.08-1c-0.45-0.04-9.19-0.17-9.19-0.17s-7.32-7.1-8.04-7.83 c-0.72-0.72-2.13-0.5-2.68-0.34c-0.01,0-1.37,0.43-3.68,1.14c-0.38-1.25-0.95-2.78-1.76-4.32c-2.6-4.97-6.42-7.6-11.03-7.61 c-0.01,0-0.01,0-0.02,0c-0.32,0-0.64,0.03-0.96,0.06c-0.14-0.16-0.27-0.32-0.42-0.48c-2.01-2.15-4.58-3.19-7.67-3.1 c-5.95,0.17-11.88,4.47-16.69,12.11c-3.38,5.37-5.96,12.12-6.69,17.35c-6.83,2.12-11.61,3.6-11.72,3.63 c-3.45,1.08-3.56,1.19-4.01,4.44C9.03,39.99,0,109.8,0,109.8l75.65,13.08l32.79-8.15C108.44,114.73,95.06,24.28,94.98,23.66 L94.98,23.66z M66.52,16.63c-1.74,0.54-3.72,1.15-5.87,1.82c-0.04-3.01-0.4-7.21-1.81-10.83C63.36,8.47,65.58,13.58,66.52,16.63 L66.52,16.63z M56.69,19.68c-3.96,1.23-8.29,2.57-12.63,3.91c1.22-4.67,3.54-9.33,6.38-12.38c1.06-1.14,2.54-2.4,4.29-3.12 C56.38,11.52,56.73,16.39,56.69,19.68L56.69,19.68z M48.58,3.97c1.4-0.03,2.57,0.28,3.58,0.94C50.55,5.74,49,6.94,47.54,8.5 c-3.78,4.06-6.68,10.35-7.83,16.43c-3.6,1.11-7.13,2.21-10.37,3.21C31.38,18.58,39.4,4.23,48.58,3.97L48.58,3.97z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#5E8E3E"
          d="M93.9,22.66c-0.45-0.04-9.19-0.17-9.19-0.17s-7.32-7.1-8.04-7.83c-0.27-0.27-0.63-0.41-1.02-0.47l0,108.68 l32.78-8.15c0,0-13.38-90.44-13.46-91.06C94.9,23.04,94.35,22.7,93.9,22.66L93.9,22.66z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#FFFFFF"
          d="M57.48,39.52l-3.81,14.25c0,0-4.25-1.93-9.28-1.62c-7.38,0.47-7.46,5.12-7.39,6.29 c0.4,6.37,17.16,7.76,18.11,22.69c0.74,11.74-6.23,19.77-16.27,20.41c-12.05,0.76-18.69-6.35-18.69-6.35l2.55-10.86 c0,0,6.68,5.04,12.02,4.7c3.49-0.22,4.74-3.06,4.61-5.07c-0.52-8.31-14.18-7.82-15.04-21.48c-0.73-11.49,6.82-23.14,23.48-24.19 C54.2,37.88,57.48,39.52,57.48,39.52L57.48,39.52z"
        />
      </svg>
    ),
  }

  return (
    <a
      href={href}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 font-normal no-underline transition-colors hover:border-emerald-600/40 dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-white/10 dark:bg-white/5">
          {logos[provider] ?? null}
        </span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold leading-tight text-gray-900 dark:text-gray-100">
            {name}
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-400">
            {kind}
          </div>
        </div>
        <span
          className="ml-auto rounded-full border px-[7px] py-0.5 font-mono text-[9px] font-semibold tracking-[0.09em]"
          style={{ color: BRAND, background: "#EAF6F1", borderColor: "#D3EAE0" }}
        >
          LIVE
        </span>
      </div>

      <p className="mt-3.5 text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-300">
        {summary}
      </p>

      {syncs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {syncs.map((entity) => (
            <span
              key={entity}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
            >
              {entity}
            </span>
          ))}
        </div>
      )}

      {note && <div className="mt-3 text-[12px] text-gray-400">{note}</div>}

      <div className="mt-4 flex items-center gap-1 text-[13px] font-medium" style={{ color: BRAND }}>
        Set it up
        <svg
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}
