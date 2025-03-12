export function Footer() {
    return (
        <footer className="border-t py-6 bg-background">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>SähköVertailu &copy; {new Date().getFullYear()} - Suomalainen sähkön hintavertailutyökalu</p>
                <p className="mt-1">Tiedot tarjoaa Fingrid ja ENTSO-E</p>
            </div>
        </footer>
    );
}