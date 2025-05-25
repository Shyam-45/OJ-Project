export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
          © {new Date().getFullYear()} <a href="#" className="font-semibold hover:underline">myOnlineJudge™</a>. All Rights Reserved.
        </span>
        <ul className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Licensing</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
