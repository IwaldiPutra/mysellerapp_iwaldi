import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-white font-light py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4">
        <Image
          src="/logo.png"
          alt="Blog Genzet Logo"
          width={100}
          height={100}
          className="object-contain"
          priority
        />
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Blog Genzet. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
