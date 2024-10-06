
export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen bg-black"
        style={{
          backgroundImage: "url('picture/ian-valerio-CAFq0pv9HjY-unsplash.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} 
      >
        {children}
      </div>
    );
  }
  