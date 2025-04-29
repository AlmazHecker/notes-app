export default function Footer() {
  return (
    <footer className="w-full border-t border-background-200 py-3 bg-background">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Notes
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/AlmazHecker/notes-app"
            className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github.svg" className="mr-2 size-5" />
            <span>Source code</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
