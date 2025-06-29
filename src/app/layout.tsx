'use client';
import './globals.css';  // import global CSS
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState, AppDispatch } from '@/app/store';
import { fetchCategories } from '@/redux/categorySlice';
import { usePathname } from 'next/navigation'; 

function FrontLayoutContent({ children }: { children: ReactNode }) {
  const categories = useSelector((state: RootState) => state.categories.items);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories.length, dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 flex-col">
      {/* Header with menu */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📰 Acesoftech Blog</h1>
        <nav className="space-x-6">
          <Link href="/" className="hover:text-blue-600">🏠 Home</Link>
          <Link href="/about" className="hover:text-blue-600">📖 About</Link>
          <Link href="/services" className="hover:text-blue-600">🛠 Services</Link>
          <Link href="/contact" className="hover:text-blue-600">📞 Contact</Link>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white shadow-md p-4 overflow-y-auto border-r border-gray-300">
          <h3 className="text-lg font-bold mb-4">📚 Categories</h3>
          <nav className="space-y-2">
            {categories.map((cat) => (
             <Link
              key={cat.id}
              href={`/category-posts/${cat.id}`}
              className="block text-gray-700 hover:text-blue-600"
            >
              {cat.name}
            </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-center text-sm p-4 text-gray-600">
        &copy; {new Date().getFullYear()} Acesoftech Blog. All rights reserved.
      </footer>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); 

  // Check if the current path starts with /admin
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {isAdminPath ? (
            children
          ) : (
            <FrontLayoutContent>{children}</FrontLayoutContent>
          )}
        </Provider>
      </body>
    </html>
  );
}