import { useForm } from 'react-hook-form';

// Тип для даних форми
interface NewsletterForm {
  email: string;
}

// Footer reference is array instead of JSX copy
const collectionsLinks = ['Pendants', 'Floor Lamps', 'Wall Sconces', 'Chandeliers'];
const companyLinks = ['About Us', 'Architect Portal', 'Sustainability', 'Contact'];

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

export default function Footer() {
  const {
    register,       // registers a field in the form
    handleSubmit,   // wraps onSubmit — validates first
    reset,          // clears the form after submission
    formState: { errors, isSubmitSuccessful }, // form state
  } = useForm<NewsletterForm>();

  const onSubmit = (data: NewsletterForm) => {
    // Here will be an API request in a real project
    console.log('Subscribed:', data.email);
    reset(); // clears the field after submission
  };

  return (
    <footer className="w-full bg-[#0E0F14] border-t border-neutral-800/80 mt-20 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/60">

        {/* Brand  */}
        <div className="md:col-span-4 space-y-4">
          <a href="#" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <SunIcon />
            </div>
            <span className="font-space text-lg font-bold tracking-wider text-white">LOONARI</span>
          </a>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            Crafting architectural luminaires that harmonize space, light, and modern minimalism
            for premium residential & commercial projects.
          </p>
        </div>

        {/* COLLECTIONS */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-space text-xs font-bold uppercase tracking-wider text-white">Collections</h5>
          <ul className="space-y-2 text-xs text-neutral-400">
            {collectionsLinks.map(link => (
              <li key={link}>
                <a href="#" className="hover:text-amber-500 transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-space text-xs font-bold uppercase tracking-wider text-white">Company</h5>
          <ul className="space-y-2 text-xs text-neutral-400">
            {companyLinks.map(link => (
              <li key={link}>
                <a href="#" className="hover:text-amber-500 transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="md:col-span-4 space-y-3">
          <h5 className="font-space text-xs font-bold uppercase tracking-wider text-white">Newsletter</h5>
          <p className="text-xs text-neutral-400">
            Subscribe to receive exclusive previews of new architectural series.
          </p>

          {/* Successfully sent */}
          {isSubmitSuccessful && (
            <p className="text-xs text-amber-500 font-bold">
              ✓ Welcome to LOONARI community!
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-grow">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full bg-[#181920] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-neutral-700/80'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {/* Validation error */}
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shrink-0"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
        <p>© 2026 LOONARI Architectural Lighting. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
            <a key={link} href="#" className="hover:text-neutral-300 transition-colors">{link}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}