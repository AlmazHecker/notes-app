export default function Footer() {
  return (
    <footer className="w-full sticky bottom-0 border-t border-background-200 py-3 bg-background">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Notes
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/AlmazHecker/notes-app"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${import.meta.env.BASE_URL}github.svg`}
              className="mr-2 size-5"
            />
            <span>Source code</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
