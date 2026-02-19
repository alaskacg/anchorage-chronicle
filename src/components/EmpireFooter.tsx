/**
 * NetworkFooter — Footer with parent company attribution.
 * Alaska News Corporation
 */

export default function EmpireFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-400">
            © {new Date().getFullYear()} Alaska News Corporation. All rights reserved.
          </span>
          <a
            href="mailto:admin@alaskaconsultinggroup.com"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
