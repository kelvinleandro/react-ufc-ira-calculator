const NotFound = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Página não encontrada.
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;
