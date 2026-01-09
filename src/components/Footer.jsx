export default function Footer() {
  return (
    <footer className="mt-12 border-t pt-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Cadeau4All</div>
        <div className="flex gap-4">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
