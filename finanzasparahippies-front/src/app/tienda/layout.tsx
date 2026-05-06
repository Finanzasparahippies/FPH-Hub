export default function StoreLayout({
    children,
    }: {
        children: React.ReactNode;
    }) {
        return (
        <section>
            <nav className="p-4 bg-green-100">Navegación de Tienda</nav>
            <main className="p-4">{children}</main>
        </section>
        );
    }