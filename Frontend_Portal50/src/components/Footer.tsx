// src/components/Footer.tsx
export default function Footer() {
  return (
      <footer className="bg-gray-200 text-center text-gray-700 py-4 px-2 sm:px-4 mt-auto w-full">
        <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Portal50+. Todos los derechos reservados.</p>
      </footer>
  );
}
